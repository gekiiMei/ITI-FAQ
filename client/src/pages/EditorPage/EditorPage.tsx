import "./EditorPage.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NamePrompt from "../../components/NamePrompt/NamePrompt";



import { BlockTypeSelect, InsertThematicBreak, ListsToggle, MDXEditor, UndoRedo, BoldItalicUnderlineToggles, InsertImage, InsertTable} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css'
import { headingsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, listsPlugin, linkPlugin, imagePlugin, tablePlugin, markdownShortcutPlugin } from "@mdxeditor/editor";

import { IoArrowBackCircleSharp } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdFolderOpen } from "react-icons/io";

import { FaStar } from "react-icons/fa6";
import { FaPlusCircle, FaRegStar, FaSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";

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
    const [currentTopic, setCurrTopic] = useState<number|null>(searchParams.get("topic_id")?parseInt(searchParams.get("topic_id")??""):null);
    const [currentSub, setCurrSub] = useState<number|null>(searchParams.get("subject")?parseInt(searchParams.get("subject")??""):null);
    const [currSubName, setCurrSubName] = useState<string>("")
    const [currPage, setCurrPage] = useState<number|null>(searchParams.get("page")?parseInt(searchParams.get("page")??""):null) 

    const [parentSub, setParentSub] = useState<Subject|null>(null)
    // const [activePage, setActivePage] = useState<number|null>(searchParams.get("page")?parseInt(searchParams.get("page")??""):null) //messy i know -Harley
    const [subList, setSubList] = useState<Subject[]>([])
    const [pageList, setPageList] = useState<Page[]>([])
    // const [navStack, setNavStack] = useState<{i:number, name:string}[]>([]);

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

    // const setParam = (key:string, val:string|null) => {
    //     const params = new URLSearchParams(searchParams);
    //     if (val) {
    //         params.set(key, val);
    //     } else { 
    //         params.delete(key);
    //         console.log("Deleted " + key + " from params")
    //     }
    //     console.log("params: ", params)
    //     setSearchParams(params);
    // }
    
    const getSubjects = async () => {
        console.log("getSubjects called")
        console.log("fetching subjects with: ")
        console.log('currentTopic: ' + currentTopic)
        console.log('currentSubject: ' + currentSub)
        await axios.post(base_url+'/api/authorfetch/fetch-subjects', {
            curr_topic: currentTopic,
            curr_subject: currentSub
        })
        .then((resp) => {
            setSubList(resp.data.subjects)
            setParentSub(resp.data.curr_subject.parentSubject??null)
            setCurrSubName(resp.data.curr_subject.name)
            console.log("get subject results: ", resp.data)
        })
        .catch((err) => {

        })
    }

    const getPages = async() => {
        console.log("getPages called")
        await axios.post(base_url+"/api/authorfetch/fetch-pages", {
            curr_topic: currentTopic,
            curr_subject: currentSub
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
            setTopicTitle(resp.data.topic.title)
            setFeatured(resp.data.topic.is_featured)
            console.log("featured: ", resp.data.topic.is_featured)
        })
        .catch((err) => {

        })
    }

    const handleCreateSubject = async (name:string) => {
        await axios.post(base_url+"/api/create/create-subject", {
            subject_name: name,
            parent_topic: currentTopic,
            parent_subject: currentSub
        })
        .then(async (resp) => {
            // const params = new URLSearchParams(searchParams)
            // params.set("subject", resp.data.subject_id.toString())
            // params.delete("page");
            // setSearchParams(params)
            await getSubjects()
            await openSubject(resp.data.subject.id)
        })
        .catch((err) => {

        })
    }

    const handleCreatePage = async (title:string) => {
        console.log("handlecreate called")
        await axios.post(base_url+"/api/create/create-page", {
            page_title: title,
            parent_topic: currentTopic,
            parent_subject: currentSub
        })
        .then(async (resp) => {
            // setParam("page", resp.data.page_id.toString())
            // const params = new URLSearchParams(searchParams)
            // params.set("page", resp.data.page_id.toString())
            // setSearchParams(params)
            await getPages()
            await openPage(resp.data.page_id)
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
            parent_topic: currentTopic,
            parent_subject: currentSub
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

    const getPageDetails = async () => {
        // setActivePageContent([])
        console.log("getPageDetails called")
        console.log("loading new page")
        setCurrentMarkdown("")
        setInitialMarkdown("")
        await axios.post(base_url+"/api/authorfetch/fetch-details", {
            page_id: currPage
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
        console.log("openPage called")
        console.log("opening page id " + id)
        // setParam("page", id.toString())
        const params = new URLSearchParams(searchParams)
        params.set("page", id.toString())
        setSearchParams(params)

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
            await getPageDetails()
            setActivePageTitle(tempTitle??activePageTitle)
            alert("saved")
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const openSubject = async (id: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("subject", id.toString());
        params.delete("page")
        setSearchParams(params);
        
    }

    const backSubject = async () => {
        // setNavStack(prev => {
        //     const hist = [...prev]
        //     const new_curr = hist.pop() ?? null
        //     if (new_curr != null) {
        //         setCurrSub(new_curr.i)
        //         setCurrSubName(new_curr.name)
        //     } else {
        //         setCurrSub(null)
        //         setCurrSubName(null)
        //     }
        //     return hist
        // })
        console.log("back func fired. currentSub = " + currentSub + " parentSub = " + parentSub?.subject_id)
        // setParam("subject", parentSub?parentSub.subject_id.toString():null)
        const params = new URLSearchParams(searchParams)
        params.delete("page")
        if (parentSub) {
            params.set("subject", parentSub.subject_id.toString())
        } else {
            params.delete("subject")
        }
        setSearchParams(params)

        // if (currentSub == null) {
        //     console.log("backsub: currentSub is null" )
        //     setCurrTopic(parseInt(searchParams.get("topic_id")??""))
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
        console.log("currentSub or currentTopic changed")
        console.log("sub: " + currentSub)
        console.log("topic: " + currentTopic)
        const asyncLoadSubs = async () => {
            console.log('getting subjects')
            await getSubjects()
        }
        const asyncLoadPages = async () => {
            await getPages()
        }
        
        
        asyncLoadSubs()
        asyncLoadPages()
    }, [currentSub, currentTopic])

    useEffect(() => {
        console.log("currPage changed: " + currPage)
        const asyncGetPageDetails = async () => {
            await getPageDetails()
        }

        asyncGetPageDetails()
    }, [currPage])

    useEffect(() => {
        console.log("search params changed: ")
        console.log(searchParams)
        setCurrTopic(searchParams.get("topic_id")?parseInt(searchParams.get("topic_id")??""):null);
        setCurrSub(searchParams.get("subject")?parseInt(searchParams.get("subject")??""):null);
        setCurrPage(searchParams.get("page")?parseInt(searchParams.get("page")??""):null) 
    }, [searchParams])

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
                    <IoArrowBackCircleSharp size={18}/> Back to dashboard
                </button>
            </div>
            <div id="editor-container">
                <div id="editor-navigator">
                    <div id="editornav-label">
                        <div id="title-featurebutt">
                            <p>{topicTitle}</p>
                            <div id="feature-button" onClick={async () => {await handleFeatureClick()}}>
                                {/* {featured?<FaStar color="gold"/> : <FaRegStar />} */}
                                <input type="checkbox" checked={featured==true}/>
                                <p>Featured</p>
                            </div>
                        </div>
                        <div id="sub-create-wrapper">
                            <button id="sub-createnew" onClick={() => {setShowPromptNameSub(true)}}>
                                <FaPlusCircle /> Subject
                            </button>
                            <button id="page-createnew" onClick={() => {setShowPromptNamePage(true)}}>
                                <FaPlusCircle /> Page
                            </button>
                        </div>
                    </div>
                    <div id="editornav-body">
                        {currentSub != null && 
                            <div id="cat-back-button" onClick={async () => {await backSubject()}}>
                                ..{parentSub?`/${parentSub.name}`:''}/{currSubName}
                            </div>
                        }
                        {
                            subList.map((sub, i) => {
                                return(
                                    <div className="subjectItem" key={sub.subject_id}>
                                        <div className="subjectItem-left" onClick={async (e) => {e.stopPropagation(); await openSubject(sub.subject_id)}}>
                                            <p><IoMdFolderOpen /> {sub.name}</p>
                                        </div>
                                        <div className="subjectItem-right">
                                            <button onClick={async () => {await archiveSub(sub.subject_id)}}><MdDelete /> Delete</button>
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
                                            <p><span><IoDocumentTextOutline /></span> {page.title}</p>
                                        </div>
                                        <div className="pageItem-right">
                                            <button onClick={async (e) => {e.stopPropagation();await archivePage(page.page_id)}}><MdDelete /> Delete</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div id="editor-workbench">
                    {
                        searchParams.get("page")==null ? 
                        <div id="editorworkbench-container">
                            <div id="no-page-loaded">
                                <p id="no-page-loaded-header">
                                    No page loaded.
                                </p>
                                <p id="no-page-loaded-desc">
                                    Select a page to edit its content.
                                </p>
                            </div>
                        </div> : 
                        <div id="editorworkbench-container">
                            <div id="editor-header">
                                { editingTitle ?
                                <form id="editortitle-left" onSubmit={async (e) => { e.preventDefault(); await handleUpdateTitle(tempTitle??"")}}>
                                    <input type="text" value={tempTitle??activePageTitle} onChange={(e) => {setTempTitle(e.target.value)}}/>
                                    <button id="editortitle-edit">
                                        Ok
                                    </button>
                                </form>
                                :
                                <div id="editortitle-left">
                                    <h1>{activePageTitle}</h1>
                                    <button id="editortitle-edit" onClick={() => {setEditingTitle(true)}}>
                                        <BiSolidEdit /> Rename
                                    </button>
                                </div>
                                }
                                {/* rating count here -harley */}
                                {/* {
                                    !editingTitle &&
                                    <div id="editortitle-right">
                                        <FaStar color="gold" /> 
                                    </div>
                                }
                                 */}
                            </div>
                            <div id="editor-body">
                                <div id="editor-content">
                                    {
                                        searchParams.get("page")==null ? <p>no page loaded</p> : 
                                        <MDXEditor
                                        key={initialMarkdown}
                                        contentEditableClassName="prose"
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
                                    <div id="editor-savebutt-wrapper">
                                        <button id="editor-savebutt" onClick={() => {savePage()}}>
                                            <FaSave /> Save
                                        </button>
                                    </div>
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