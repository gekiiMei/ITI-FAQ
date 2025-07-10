import "./EditorPage.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NamePrompt from "../../components/NamePrompt/NamePrompt";
import EditorHeader from "../../components/EditorBlocks/EditorHeader/EditorHeader";
import EditorParagraph from "../../components/EditorBlocks/EditorParagraph/EditorParagraph";
import EditorList from "../../components/EditorBlocks/EditorList/EditorList";
import EditorImage from "../../components/EditorBlocks/EditorImage/EditorImage";

interface Subject {
    subject_id:number,
    name:string,
}
interface Page {
    page_id: number,
    title: string
}

interface BlockObject {
    [key:string]: any
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
    const [showBlockModal, setShowBlockModal] = useState<boolean>(false);

    const [activePageTitle, setActivePageTitle] = useState<string|null>(null);
    const [activePageContent, setActivePageContent] = useState<BlockObject[]>([])

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

    const getPageDetails = async (id:number) => {
        setActivePageContent([])
        await axios.post(base_url+"/api/authorfetch/fetch-details", {
            page_id: id
        })
        .then((resp) => {
            console.log(resp.data.details)
            setActivePageTitle(resp.data.details.title)
            setActivePageContent(resp.data.details.content)
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
        console.log(activePageContent)
        await axios.post(base_url+"/api/authorupdate/save-page", {
            page_id: searchParams.get("page"),
            new_content: activePageContent
        })
        .then((resp) => {
            alert("saved")
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const createBlock = (block_type:string) => {
        setShowBlockModal(false)
        let newItem: BlockObject = {type: block_type}
        switch (block_type) {
            case "header":
                newItem.text = ""
                newItem.font = 24
                break;
            case "paragraph":
                newItem.text = ""
                break;
            case "list":
                newItem.listType = "numbered"
                newItem.label = ""
                newItem.entries = []
                break;
            case "image":
                newItem.user_id = localStorage.getItem("current_user_id")
                newItem.page_id = searchParams.get("topic_id")??""
                newItem.block_hash = newItem.user_id + '_' + newItem.page_id + '_' + new Date().getTime().toString()
                newItem.path = image_url+"/topic-thumbnails/placeholder.png"
                break;
        }
        setActivePageContent([...activePageContent, newItem])
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
                        <p>Content</p>
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
                                <h1>{activePageTitle}</h1>
                            </div>
                            <div id="editor-body">
                                <div id="editor-content">
                                   
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