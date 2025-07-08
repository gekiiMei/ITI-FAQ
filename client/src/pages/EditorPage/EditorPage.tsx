import "./EditorPage.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NamePrompt from "../../components/NamePrompt/NamePrompt";

interface Subject {
    subject_id:number,
    name:string,
    parent_subject:number,
    parent_topic:number,
}

function EditorPage() {
    const base_url = import.meta.env.VITE_backend_base_url;
    const [searchParams] = useSearchParams()
    //it says currParent but really it's the one that we're looking at, will change if i find time -Harley
    const [currParent_top, setCurrParent_top] = useState<number|null>(parseInt(searchParams.get("topic_id")??""));
    const [currParent_sub, setCurrParent_sub] = useState<number|null>(null);
    const [subList, setSubList] = useState<Subject[]>([])
    const [navStack, setNavStack] = useState<number[]>([]);
    const [parentTopTemp, setParentTopTemp] = useState<number|null>(null);

    const [promptNameSub, setShowPromptNameSub] = useState(false);
    
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

    const handleCreateSubject = async (name:string) => {
        await axios.post(base_url+"/api/create/create-subject", {
            subject_name: name,
            parent_topic: currParent_top,
            parent_subject: currParent_sub,
        })
        .then(async (resp) => {
            await getSubjects()
        })
        .catch((err) => {

        })
    }

    const handleCreatePage = async (title:string) => {
        
    }

    const openSubject = async (id: number) => {
        if (currParent_sub != null) {
            setNavStack(prev => [...prev, currParent_sub]);
        }
        setCurrParent_top(null)
        setCurrParent_sub(id)
    }

    const backSubject = async () => {
        setNavStack(prev => {
            const hist = [...prev]
            const new_curr = hist.pop() ?? null
            setCurrParent_sub(new_curr)
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
        await getSubjects();
    }

    useEffect(() => {
        const asyncLoadSubs = async() => {
            console.log('getting subjects')
            await getSubjects()
        }
        if (currParent_sub == null) {
            console.log("backsub: currParent_sub is null" )
            setCurrParent_top(parseInt(searchParams.get("topic_id")??""))
        }
        asyncLoadSubs()
    }, [currParent_sub, currParent_top])
    
    return(
        <>
        {promptNameSub && <NamePrompt setShowNamePrompt={setShowPromptNameSub} label="subject" someAction={async (name) => { await handleCreateSubject(name)}}/>}
        <div className="editorpage-main">

            <div id="editor-container">
                <div id="editor-navigator">
                    <div id="editornav-label">
                        <p>Content</p>
                        <div id="sub-create-wrapper">
                            <button id="sub-createnew" onClick={() => {setShowPromptNameSub(true)}}>
                                new sub
                            </button>
                            <button id="page-createnew">
                                new page
                            </button>
                        </div>
                    </div>
                    <div id="editornav-body">
                        {currParent_sub != null && 
                            <div id="cat-back-button" onClick={async () => {await backSubject()}}>
                                back
                            </div>
                        }
                        {
                            subList.map((sub, i) => {
                                return(
                                    <div className="subjectItem" key={sub.subject_id}>
                                        <div className="subjectItem-left" onClick={async () => {await openSubject(sub.subject_id)}}>
                                            <p>{sub.name}</p>
                                        </div>
                                        <div className="subjectItem-right">
                                            <button onClick={async () => {await archiveSub(sub.subject_id)}}>delete</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div id="editor-workbench">
                    adsad
                </div>
            </div>
        </div>
        </>
    )
}

export default EditorPage;