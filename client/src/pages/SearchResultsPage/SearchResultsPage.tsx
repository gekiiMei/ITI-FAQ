import "./SearchResultsPage.css"
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns"
import NavBar from "../../components/NavBar/NavBar";
import axios from "axios";

import { GoTriangleDown } from "react-icons/go";
import { GoTriangleRight } from "react-icons/go";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaBook } from "react-icons/fa6";

interface ResultItem {
    title:string
    parentTopic:{title:string}
    thumbnail_path:string
    total_rating:number
    rating_count:number
    updatedAt:string
    topic_id: number
    page_id: number
    parent_topic: number
}


function SearchResultsPage() {
    const base_url = import.meta.env.VITE_backend_base_url;
    const image_url = import.meta.env.VITE_image_base_path;

    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get("q")??""
    const sortMethod = searchParams.get("sort")??""
    const [resultTopics, setResultTopics] = useState<ResultItem[]>([])
    const [resultPages,setResultPages] = useState<ResultItem[]>([])
    const [featuredTopics, setFeaturedTopics] = useState<ResultItem[]>([])

    const [showSortModal, setShowSortModal] = useState<boolean>(false)

    const [showTopics, setShowTopics] = useState<boolean>(true)
    const [showPages, setShowPages] = useState<boolean>(true)
    

    console.log("search results page mounted")
    const getResults = async () => {
        console.log("calling search api endpoint")
        await axios.get(base_url+"/api/userfetch/search", {
            params: {
                search_query: searchQuery,
                sort_method: sortMethod
            }
        })
        .then((resp) => {
            setResultTopics(resp.data.results_topics)
            setResultPages(resp.data.results_pages)
        })
        .catch((err) => {

        })
    }

    const handleTopicClick = (topicId: number) => {
        console.log(`Navigating to topic: ${topicId}`)
        navigate(`/viewer?topic_id=${topicId}`)
    }

    const handlePageClick = (pageId: number, parentTopicId: number) => {
        console.log(`Navigating to page: ${pageId} in topic: ${parentTopicId}`)
        navigate(`/viewer?topic_id=${parentTopicId}&page=${pageId}`)
    }

    useEffect(() => {
        const asyncGetResults = async () => {
            await getResults()
        }
        asyncGetResults()
    }, [searchParams])

    useEffect(() => {
        setShowTopics(resultTopics.length>0)
        setShowPages(resultPages.length>0)
    }, [resultTopics, resultPages])

    useEffect(() => {
        const asyncGetFeatured = async () => {
            await axios.get(base_url+"/api/userfetch/fetch-featured")
            .then((resp) => {
                console.log(resp.data.featured_topics)
                setFeaturedTopics(resp.data.featured_topics)
            })
            .catch((err) => {

            })
        }

        asyncGetFeatured()
    },[])

    // useEffect(() => {
    //     console.log("query: " + searchParams.get("q"))
    //     console.log("got results: ")
    //     console.log(searchResults)
    // }, [searchResults])
    
    return (
        <>
        <div className="searchpage-main">
            <NavBar />
            <div id="searchpage-body">
                <div id="leftfeat-container">
                    {/* this is so stupid but i dont know how else to get the padding right with the bg aghgh im sorry -harley */}
                    <div id="leftfeat-wrapper">
                        <div id="featcont-head">
                            <p>Featured Topics</p>
                            <hr/>
                        </div>
                        <div id="featcont-feats">
                            {
                                featuredTopics.map((res, i) => {
                                    return (
                                        <div className="search-featuredTopic" onClick={() => {handleTopicClick(res.topic_id)}}>
                                            <FaBook />
                                            <p>{res.title}</p>
                                            {/* <p>Last updated: <span>{format(new Date(res.updatedAt), "MM/dd/yyyy")}</span></p> */}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div id="searchres-container">
                    <div id="searchres-header">
                        <div id="searchquery">
                            <p>Search Results: "{searchQuery}"</p>
                        </div>
                        <div id="sort-cont">
                            <button onClick={() => {setShowSortModal(!showSortModal)}}><span><TbArrowsSort /></span> Sort</button>
                            {showSortModal && 
                            <div id="sort-modal">
                                <p onClick={()=>{navigate(`/search?q=${searchQuery}&sort=date`); setShowSortModal(false)}}>Date updated</p>
                                <p onClick={()=>{navigate(`/search?q=${searchQuery}&sort=rating`); setShowSortModal(false)}}>Rating</p>
                            </div>
                            }
                        </div>
                    </div>
                    {
                    (resultPages.length<=0 && resultTopics.length<=0) ?
                    <div id="rightres-container">
                        <p>No results found</p>
                    </div>
                    :
                    <div id="rightres-container">
                        <p onClick={() => {if(resultTopics.length<=0){return}setShowTopics(!showTopics)}} className={resultTopics.length>0?"clickable-res-header":"disabled-res-header"}>
                            <span>
                                {resultTopics.length>0?showTopics?<GoTriangleDown />:<GoTriangleRight />:null}
                            </span>
                            Topics <span>({resultTopics.length})</span>
                        </p>
                        {
                            resultTopics.map((res, i) => {
                                if (showTopics) {
                                    return (
                                        <div className="resultTopic" onClick={() => {handleTopicClick(res.topic_id)}}>
                                            <div className="resultTopic-left">
                                                <img className="res-topic-thumbnail" src={res.thumbnail_path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+res.thumbnail_path} alt="" />
                                                <div className="topic-titledate-wrapper">
                                                    <p>{res.title}</p>
                                                    <p className="res-datelabel">Last updated: <span>{format(new Date(res.updatedAt), "MM/dd/yyyy")}</span></p>
                                                </div>
                                            </div>  
                                            <div className="resultTopic-right">
                                                {/* <div className="topicres-star-wrapper">
                                                    <FaStar color="gold"/>
                                                </div>
                                                <p>{((res.total_rating/res.rating_count)==0 || res.rating_count == 0) ? "0.0" : (res.total_rating/res.rating_count).toFixed(1)} <span>({res.rating_count})</span></p> */}
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                        <p onClick={() => {if(resultPages.length<=0){return}setShowPages(!showPages)}} className={resultPages.length>0?"clickable-res-header":"disabled-res-header"}>
                            <span>
                                {resultPages.length>0?showPages?<GoTriangleDown />:<GoTriangleRight />:null}
                            </span>
                            Pages <span>({resultPages.length})</span>
                        </p>
                        {
                            resultPages.map((res, i) => {
                                if (showPages) {
                                    return (    
                                        <div className="resultPage" onClick={() => {handlePageClick(res.page_id, res.parent_topic)}}>
                                            <div className="resultPage-left">
                                                <IoDocumentTextOutline size={48}/>
                                                <div className="res-pagetopic-wrapper">
                                                    <p>{res.title}</p>
                                                    <p className="res-parentlabel">{res.parentTopic.title}</p>
                                                </div>  
                                            </div>
                                            <div className="resultPage-right">
                                                <div className="topicres-star-wrapper">
                                                    <FaStar color="gold"/>
                                                </div>
                                                <p>{((res.total_rating/res.rating_count)==0 || res.rating_count == 0) ? "0.0" : (res.total_rating/res.rating_count).toFixed(1)} <span>({res.rating_count})</span></p>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default SearchResultsPage;