import "./EditorPage.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NamePrompt from "../../components/NamePrompt/NamePrompt";

import { FaRegStar } from "react-icons/fa";

import { BlockTypeSelect, InsertThematicBreak, ListsToggle, MDXEditor, UndoRedo, BoldItalicUnderlineToggles, InsertImage, InsertTable} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import { headingsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, listsPlugin, linkPlugin, imagePlugin, tablePlugin, markdownShortcutPlugin } from "@mdxeditor/editor";
import { FaZ } from "react-icons/fa6";

interface Subject {
    subject_id:number,
    name:string,
}
interface Page {
    page_id: number,
    title: string
}

function EditorPage() {
    const base_url = import.meta.env.VITE_backend_base_url;
    const image_url = import.meta.env.VITE_image_base_path;
    const [searchParams, setSearchParams] = useSearchParams()
    //it says currParent but really it's the one that we're looking at, will change if i find time -Harley
    const [currParent_top, setCurrParent_top] = useState<number|null>(parseInt(searchParams.get("topic_id")??""));
    const [currParent_sub, setCurrParent_sub] = useState<number|null>(null);
    const [currSubName, setCurrSubName] = useState<string|null>(null);
    // const [activePage, setActivePage] = useState<number|null>(searchParams.get("page")?parseInt(searchParams.get("page")??""):null) //messy i know -Harley
    const [subList, setSubList] = useState<Subject[]>([])
    const [pageList, setPageList] = useState<Page[]>([])
    const [navStack, setNavStack] = useState<{i:number, name:string}[]>([]);

    const [promptNameSub, setShowPromptNameSub] = useState<boolean>(false);
    const [promptNamePage, setShowPromptNamePage] = useState<boolean>(false);
    const [activePageTitle, setActivePageTitle] = useState<string>("");

    const [currentMarkdown, setCurrentMarkdown] = useState<string>("")
    const [initialMarkdown, setInitialMarkdown] = useState<string>("")

    const [editingTitle, setEditingTitle] = useState<boolean>(false)
    const [tempTitle, setTempTitle] = useState<string|null>(null)

    const [topicTitle, setTopicTitle] = useState<string>("")
    const [featured, setFeatured] = useState<boolean>(false);

    const navigate = useNavigate()
    
    const getSubjects = async () => {
        console.log("fetching subjects with: ")
        console.log('currParent_topic: ' + currParent_top)
        console.log('currParent_subject: ' + currParent_sub)
        await axios.post(base_url+'/api/authorfetch/fetch-subjects', {
            curr_topic: currParent_top,
            curr_subject: currParent_sub
        })
        .then((resp) => {
            setSubList(resp.data.subjects)
        })
        .catch((err) => {

        })
    }

    const getPages = async() => {
        await axios.post(base_url+"/api/authorfetch/fetch-pages", {
            curr_topic: currParent_top,
            curr_subject: currParent_sub
        })
        .then((resp) => {
            setPageList(resp.data.pages)
        })
        .catch((err) => {

        })
    }

    const getTopicTitleFeat = async () => {
        await axios.post(base_url+"/api/authorfetch/fetch-topic-title-feat", {
            curr_topic: parseInt(searchParams.get("topic_id")??"")
        })
        .then((resp) => {
            setTopicTitle(resp.data.topic_title)
            setFeatured(resp.data.featured)
        })
        .catch((err) => {

        })
    }

    const handleCreateSubject = async (name:string) => {
        await axios.post(base_url+"/api/create/create-subject", {
            subject_name: name,
            parent_topic: currParent_top,
            parent_subject: currParent_sub
        })
        .then(async (resp) => {
            await getSubjects()
        })
        .catch((err) => {

        })
    }

    const handleCreatePage = async (title:string) => {
        await axios.post(base_url+"/api/create/create-page", {
            page_title: title,
            parent_topic: currParent_top,
            parent_subject: currParent_sub
        })
        .then(async (resp) => {
            await getPages()
        })
        .catch((err) => {
         
        })
    }

    const handleUpdateTitle = async (newTitle:string) => {
        if (newTitle == "") {
            alert("Title cannot be empty")
        }

        await axios.post(base_url+"/api/authorfetch/check-page-title", {
            new_title:newTitle,
            parent_topic: currParent_top,
            parent_subject: currParent_sub
        })
        .then((resp) => {
            if (resp.data.found) {
                alert("exists")
                setTempTitle(null)
            }
            console.log("temp is now updated")
            console.log(tempTitle??"")
            setEditingTitle(false)
            setActivePageTitle(tempTitle??activePageTitle)
        })
        .catch((err) => {

        })
    }
    
    const handleFeatureClick = async () => {
        await axios.post(base_url+"/api/authorupdate/toggle-feat", {
            curr_topic: parseInt(searchParams.get("topic_id")??""),
            feat: !featured
        })
        .then((resp) => {
            setFeatured(!featured);
        })
        .catch((err) => {

        })
    }

    const getPageDetails = async (id:number) => {
        // setActivePageContent([])
        setCurrentMarkdown("")
        await axios.post(base_url+"/api/authorfetch/fetch-details", {
            page_id: id
        })
        .then((resp) => {
            console.log(resp.data.details)
            setActivePageTitle(resp.data.details.title)
            setCurrentMarkdown(resp.data.details.content)
            setInitialMarkdown(resp.data.details.content)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const openPage = async (id:number) => {
        console.log("opening page id " + id)
        const params = new URLSearchParams(searchParams);
        params.set("page", id.toString());
        setSearchParams(params);

        await getPageDetails(id)
    }

    const savePage = async () => {
        await axios.post(base_url+"/api/authorupdate/save-page", {
            page_id: searchParams.get("page"),
            new_content: currentMarkdown,
            new_title: tempTitle ? tempTitle : activePageTitle
        })
        .then(async (resp) => {
            console.log("markdown: ")
            console.log(currentMarkdown)
            await getPages()
            setActivePageTitle(tempTitle??activePageTitle)
            alert("saved")
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const openSubject = async (id: number, name:string) => {
        if (currParent_sub != null) {
            setNavStack(prev => [...prev, {i:currParent_sub, name:name}]);
        }
        setCurrParent_top(null)
        setCurrParent_sub(id)
        setCurrSubName(name)
    }

    const backSubject = async () => {
        setNavStack(prev => {
            const hist = [...prev]
            const new_curr = hist.pop() ?? null
            if (new_curr != null) {
                setCurrParent_sub(new_curr.i)
                setCurrSubName(new_curr.name)
            } else {
                setCurrParent_sub(null)
                setCurrSubName(null)
            }
            return hist
        })
        console.log("back func fired. currParent_sub = " + currParent_sub)
        // if (currParent_sub == null) {
        //     console.log("backsub: currParent_sub is null" )
        //     setCurrParent_top(parseInt(searchParams.get("topic_id")??""))
        // }
    }

    const archiveSub = async (id: number) => {
        console.log("archiving subject id: " + id)
        await axios.post(base_url+'/api/archive/archive-subject', {
            subject_id: id
        })
        .then(async (resp)=>{await getSubjects()})
    }

    const archivePage = async (id: number) => {
        await axios.post(base_url+'/api/archive/archive-page', {
            page_id: id
        })
        .then(async (resp)=>{await getPages()})
    }

    useEffect(() => {
        const asyncLoadSubs = async () => {
            console.log('getting subjects')
            await getSubjects()
        }
        const asyncLoadPages = async () => {
            await getPages()
        }
        if (currParent_sub == null) {
            console.log("backsub: currParent_sub is null" )
            setCurrParent_top(parseInt(searchParams.get("topic_id")??""))
        }
        asyncLoadSubs()
        asyncLoadPages()
    }, [currParent_sub, currParent_top])

    useEffect(()=>{
        const asyncGetTopicTitleFeat = async () => {
            await getTopicTitleFeat()
        }
        asyncGetTopicTitleFeat()
    }, [])

    // useEffect(()=>{
    //     console.log(currentMarkdown)
    // }, [currentMarkdown])
    
    return(
        <>
        {promptNameSub && <NamePrompt setShowNamePrompt={setShowPromptNameSub} label="subject" someAction={async (name) => { await handleCreateSubject(name)}}/>}
        {promptNamePage && <NamePrompt setShowNamePrompt={setShowPromptNamePage} label="page" someAction={async (name) => { await handleCreatePage(name)}}/>}
        <div className="editorpage-main">
            <div id="back-dashboard-wrapper">
                <button id="back-dash" onClick={() => {navigate("/dashboard")}}>
                    back to dashboard
                </button>
            </div>
            <div id="editor-container">
                <div id="editor-navigator">
                    <div id="editornav-label">
                        <div id="title-featurebutt">
                            <p>{topicTitle}</p>
                            <div id="feature-button" onClick={async () => {await handleFeatureClick()}}>
                                <FaRegStar /> 
                                <input type="checkbox" checked={featured}/>
                            </div>
                        </div>
                        <div id="sub-create-wrapper">
                            <button id="sub-createnew" onClick={() => {setShowPromptNameSub(true)}}>
                                new sub
                            </button>
                            <button id="page-createnew" onClick={() => {setShowPromptNamePage(true)}}>
                                new page
                            </button>
                        </div>
                    </div>
                    <div id="editornav-body">
                        {currParent_sub != null && 
                            <div id="cat-back-button" onClick={async () => {await backSubject()}}>
                                ../{currSubName}
                            </div>
                        }
                        {
                            subList.map((sub, i) => {
                                return(
                                    <div className="subjectItem" key={sub.subject_id}>
                                        <div className="subjectItem-left" onClick={async () => {await openSubject(sub.subject_id, sub.name)}}>
                                            <p>(subject) {sub.name}</p>
                                        </div>
                                        <div className="subjectItem-right">
                                            <button onClick={async () => {await archiveSub(sub.subject_id)}}>delete</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            pageList.map((page, i) => {
                                return(
                                    <div className="pageItem" key={page.page_id}>
                                        <div className="pageItem-left" onClick={async () => {await openPage(page.page_id)}}>
                                            <p>(page) {page.title}</p>
                                        </div>
                                        <div className="pageItem-right">
                                            <button onClick={async () => {await archivePage(page.page_id)}}>delete</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div id="editor-workbench">
                    {
                        searchParams.get("page")==null ? <p>no page loaded</p> : 
                        <div id="editorworkbench-container">
                            <div id="editor-header">
                                { editingTitle ?
                                <form id="editortitle-left" onSubmit={async (e) => { e.preventDefault(); await handleUpdateTitle(tempTitle??"")}}>
                                    <input type="text" value={tempTitle??activePageTitle} onChange={(e) => {setTempTitle(e.target.value)}}/>
                                    <button id="editortitle-edit">
                                        ok
                                    </button>
                                </form>
                                :
                                <div id="editortitle-left">
                                    <h1>{activePageTitle}</h1>
                                    <button id="editortitle-edit" onClick={() => {setEditingTitle(true)}}>
                                        edit title
                                    </button>
                                </div>
                                }
                            </div>
                            <div id="editor-body">
                                <div id="editor-content">
                                    {
                                        searchParams.get("page")==null ? <p>no page loaded</p> : 
                                        <MDXEditor
                                        key={initialMarkdown}
                                        placeholder="Write information here!"
                                        markdown={initialMarkdown}
                                        onChange={(md:string) => {setCurrentMarkdown(md)}}
                                        plugins={[
                                            toolbarPlugin({
                                            toolbarClassName: 'my-classname',
                                            toolbarContents: () => (
                                                <>
                                                <UndoRedo />
                                                <BlockTypeSelect />
                                                <BoldItalicUnderlineToggles />
                                                <ListsToggle />
                                                <InsertThematicBreak />
                                                <InsertImage />
                                                <InsertTable />
                                                </>
                                            )
                                            }),
                                            linkPlugin(),
                                            imagePlugin({
                                                imageUploadHandler:  async (imageFile) => {
                                                    console.log(imageFile)
                                                    const data = new FormData()
                                                    data.append("user_id", localStorage.getItem("current_user_id")??"")
                                                    data.append("page_id", searchParams.get("topic_id")??"")
                                                    data.append("file", imageFile)
                                                    try {
                                                        const resp = await axios.post(base_url+"/api/authorupdate/save-image", data, {
                                                            headers: {
                                                                "Content-Type":"multipart/form-data"
                                                            }
                                                        })
                                                        const path = await resp.data.path
                                                        console.log("image path")
                                                        console.log(base_url +  path)
                                                        return Promise.resolve(base_url + path)
                                                    } catch (e) {
                                                        console.log(e)
                                                        return Promise.resolve("err")
                                                    }
                                                }
                                            }),
                                            tablePlugin(),
                                            headingsPlugin(),
                                            quotePlugin(),
                                            listsPlugin(),
                                            thematicBreakPlugin(),
                                            markdownShortcutPlugin()

                                        ]}
                                        />
                                    }
                                    {/* IMPORTANT!!! IMAGE DELETION LOGIC FROM SERVER STORAGE WHEN MARKUP IMG IS DELETED IS MISSING!!
                                        i will try to implement it if i find time, but if i do not then I AM SORRY 
                                        but the idea i had for the deletion logic is:
                                            1. on mount of the markdown editor, scan through the loaded markdown and extract all image links into an array using regex
                                            2. when save is clicked, extract the new links into an array as well
                                            3. compare the array of old links vs new links
                                            4. send the list of URLs missing to server
                                            5. delete the corresponding files in server
                                            6. profit!!!!!!!!!!
                                            
                                        -Harley
                                    */}
                                    <button id="editor-savebutt" onClick={() => {savePage()}}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
        </>
    )
}

export default EditorPage;