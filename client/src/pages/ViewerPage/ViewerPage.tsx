import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./ViewerPage.css"
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ViewerHeader from "../../components/ViewerBlocks/ViewerHeader/ViewerHeader";
import ViewerParagraph from "../../components/ViewerBlocks/ViewerParagraph/ViewerParagraph";
import ViewerList from "../../components/ViewerBlocks/ViewerList/ViewerList";
import ViewerImage from "../../components/ViewerBlocks/ViewerImage/ViewerImage";

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


function ViewerPage() {
    const base_url = import.meta.env.VITE_backend_base_url;

    const [searchParams, setSearchParams] = useSearchParams()
    //it says currParent but really it's the one that we're looking at, will change if i find time -Harley
    const [currParent_top, setCurrParent_top] = useState<number|null>(parseInt(searchParams.get("topic_id")??""));
    const [currParent_sub, setCurrParent_sub] = useState<number|null>(null);
    const [currSubName, setCurrSubName] = useState<string|null>(null);

    const [subList, setSubList] = useState<Subject[]>([])
    const [pageList, setPageList] = useState<Page[]>([])

    const [navStack, setNavStack] = useState<{i:number, name:string}[]>([]);

    const [activePageTitle, setActivePageTitle] = useState<string|null>(null);
    const [activePageContent, setActivePageContent] = useState<BlockObject[]>([])

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

    return (
        <>
        <div className="viewerpage-main">
            <NavBar />
            <div id="viewer-body">
                <div id="viewer-nav">
                    <div id="viewernav-label">
                        <p>Content</p>
                    </div>
                    <div id="viewernav-body">
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
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div id="viewer-page">
                    <div id="viewer-header">
                        <div id="editor-header">
                            <h1>{activePageTitle}</h1>
                        </div>
                    </div>
                    <div id="viewer-content">
                        {
                            
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ViewerPage;