import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./ViewerPage.css"
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'hast-util-sanitize';

import { FaAngleRight, FaStar } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdFolderOpen } from "react-icons/io";

import { Rating } from "react-simple-star-rating"

const extendedSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'u',
  ],
  attributes: {
    ...defaultSchema.attributes,
    u: [],
  },
};

interface Category {
    category_id: number
    name: string,
}
interface Subject {
    subject_id:number,
    name:string,
}
interface Page {
    page_id: number,
    title: string
}



function ViewerPage()  {
    const base_url = import.meta.env.VITE_backend_base_url;

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentTopic, setCurrTopic] = useState<number|null>(searchParams.get("topic_id")?parseInt(searchParams.get("topic_id")??""):null);
    const [currentSub, setCurrSub] = useState<number|null>(searchParams.get("subject")?parseInt(searchParams.get("subject")??""):null);
    const [currSubName, setCurrSubName] = useState<string>("")
    const [currPage, setCurrPage] = useState<number|null>(searchParams.get("page")?parseInt(searchParams.get("page")??""):null) 

    const [parentSub, setParentSub] = useState<Subject|null>(null)
    const [parentCat, setParentCat] = useState<Category|null>(null)

    // const [currSubName, setCurrSubName] = useState<string|null>(null);

    const [subList, setSubList] = useState<Subject[]>([])
    const [pageList, setPageList] = useState<Page[]>([])

    // in hindsight this nav system was stupid of me LOL -harley
    // const [navStack, setNavStack] = useState<{i:number, name:string}[]>([]);


    const [activePageTitle, setActivePageTitle] = useState<string|null>(null);
    const [activePageContent, setActivePageContent] = useState<string>("")
    const [activePageAvgRating, setActivePageAvgRating] = useState<string>("0.0")
    const [activePageRatingCount, setActivePageRatingCount] = useState<number>(0)

    const [topicTitle, setTopicTitle] = useState<string>("")

    const [chosenRating, setChosenRating] = useState<number>(0)

    const setParam = (key:string, val:string|null) => {
        const params = new URLSearchParams(searchParams);
        if (val) {
            params.set(key, val);
        } else { 
            params.delete(key);
            console.log("Deleted " + key + " from params")
        }
        console.log("params: ", params)
        setSearchParams(params);
    }

    const getSubjects = async () => {
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

    const getPageDetails = async () => {
        setActivePageContent("")
        await axios.post(base_url+"/api/authorfetch/fetch-details", {
            page_id: currPage
        })
        .then((resp) => {
            console.log(resp.data.details)
            const avg_rating = ((resp.data.details.total_rating/resp.data.details.rating_count)==0 || resp.data.details.rating_count == 0) ? "0.0" : (resp.data.details.total_rating/resp.data.details.rating_count).toFixed(1)
            setActivePageAvgRating(avg_rating)
            setActivePageRatingCount(resp.data.details.rating_count)
            setActivePageTitle(resp.data.details.title)
            setActivePageContent(resp.data.details.content)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const openPage = async (id:number) => {
        console.log("opening page id " + id)
        setParam("page", id.toString())
    }

    const openSubject = async (id: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("subject", id.toString());
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
        setParam("subject", parentSub?parentSub.subject_id.toString():null)

        // if (currentSub == null) {
        //     console.log("backsub: currentSub is null" )
        //     setCurrTopic(parseInt(searchParams.get("topic_id")??""))
        // }
    }

    const handleRating = (rating:number) => {
        setChosenRating(rating)
    }

    const handleSubmitRating = async () => {
        await axios.post(base_url+"/api/authorupdate/update-rating", {
            page_id: currPage,
            new_rating: chosenRating
        })
        .then( async (resp)=>{
            //succ
            alert("Rating submitted")
            await getPageDetails()
        })
        .catch((e)=>{

        })
    }

    useEffect(() => {
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
        const asyncGetPageDetails = async () => {
            await getPageDetails()
        }

        asyncGetPageDetails()
    }, [currPage])

    useEffect(() => {
        if (!searchParams.get("topic_id")) {
            navigate("/")
        }
        setCurrTopic(searchParams.get("topic_id")?parseInt(searchParams.get("topic_id")??""):null);
        setCurrSub(searchParams.get("subject")?parseInt(searchParams.get("subject")??""):null);
        setCurrPage(searchParams.get("page")?parseInt(searchParams.get("page")??""):null) 
    }, [searchParams])

    const getTopicTitleFeat = async () => {
        await axios.post(base_url+"/api/authorfetch/fetch-topic-title-feat", {
            curr_topic: currentTopic
        })
        .then((resp) => {
            setTopicTitle(resp.data.topic.title)
            setParentCat(resp.data.topic.category)
        })
        .catch((err) => {

        })
    }

    useEffect(()=>{
        const asyncGetTopicTitleFeat = async () => {
            await getTopicTitleFeat()
        }
        const asyncOpenPage = async () => {
            console.log("mounted")
            if (searchParams.get("page")) {
                console.log("got page from params")
                await openPage(currPage??-1)
            }
        }
        asyncGetTopicTitleFeat()
        asyncOpenPage()
        
    }, [])

    return (
        <>
        <div className="viewerpage-main">
            <NavBar />
            <div id="viewer-body">
                <div id="viewer-nav">
                    <div id="viewernav-labelbody">
                        <div id="viewernav-label">
                            <p id="view-parentcat-label" onClick={()=>{navigate(`/category?category=${parentCat?.category_id}`)}}>{parentCat?.name}</p>
                            <div id="cat-topic-arrow-wrapper">
                                <FaAngleRight />
                            </div>
                            <p id ="viewer-title">{topicTitle}</p>
                        </div>
                        <div id="viewernav-body">
                            {currentSub != null && 
                                <div id="cat-back-button" onClick={async () => {await backSubject()}}>
                                    <RiArrowGoBackFill />{parentSub?`../${parentSub.name}`:''}../{currSubName}
                                </div>
                            }
                            {
                                subList.map((sub, i) => {
                                    return(
                                        <div className="subjectItem" key={sub.subject_id} onClick={async () => {await openSubject(sub.subject_id)}}>
                                            <div className="subjectItem-left" >
                                                <IoMdFolderOpen /> <p> {sub.name}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                pageList.map((page, i) => {
                                    return(
                                        <div className="pageItem" key={page.page_id} onClick={async () => {await openPage(page.page_id)}}>
                                            <div className="pageItem-left" >
                                            <IoDocumentTextOutline /> <p> {page.title}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div id="viewer-page">
                    {currPage &&
                    <div id="viewer-header">
                        <h1>{activePageTitle}</h1>
                        <div id="viewer-header-rating">
                            <FaStar color={'gold'} size={24}/>
                            <h2>{activePageAvgRating} <span>({activePageRatingCount})</span></h2>
                        </div>
                    </div>}
                    <div id="viewer-content">
                        {
                            currPage?
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, extendedSchema]]}>{activePageContent}</ReactMarkdown>
                            :
                            <div id="no-page-loaded">
                                <p id="no-page-loaded-header">
                                    No page loaded.
                                </p>
                                <p id="no-page-loaded-desc">
                                    Select a page to view its content.
                                </p>
                            </div>
                            
                        }   
                        {
                            currPage&&
                            <div id="viewernav-rating">
                                How useful is this information?
                                <Rating onClick={handleRating} />
                                <button onClick={async () => {await handleSubmitRating()}}>Submit</button>
                            </div>
                        }
                    </div>
                    
                </div>
            </div>
        </div>
        </>
    )
}

export default ViewerPage;