import "./SearchResultsPage.css"
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns"
import NavBar from "../../components/NavBar/NavBar";
import axios from "axios";

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

    const [showSortModal, setShowSortModal] = useState<boolean>(false)

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
    }, [searchQuery, sortMethod])

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
                <div id="searchres-header">
                    <div id="searchquery">
                        <p>Search Results: "{searchQuery}"</p>
                    </div>
                    <div id="sort-cont">
                        <button onClick={() => {setShowSortModal(true)}}>sort</button>
                        {showSortModal && 
                        <div id="sort-modal">
                            <p onClick={()=>{navigate(`/search?q=${searchQuery}&sort=date`); }}>date updated</p>
                            <p onClick={()=>{navigate(`/search?q=${searchQuery}&sort=rating`)}}>rating</p>
                        </div>
                        }
                    </div>
                </div>
                <div id="searchres-container">
                    <h1>Topics</h1>
                    {
                        resultTopics.map((res, i) => {
                            return (
                                <div className="resultTopic" onClick={() => {handleTopicClick(res.topic_id)}}>
                                    <div className="resultTopic-left">
                                        <img className="topic-thumbnail" src={res.thumbnail_path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+res.thumbnail_path} alt="" />
                                        <div className="topic-titledate-wrapper">
                                            <p>{res.title}</p>
                                            <p>Last updated: <span>{format(new Date(res.updatedAt), "MM/dd/yyyy")}</span></p>
                                        </div>
                                    </div>  
                                    <div className="resultTopic-right">
                                        <p>{((res.total_rating/res.rating_count)==0 || res.rating_count == 0) ? "0.0" : (res.total_rating/res.rating_count).toFixed(1)}</p>
                                        <p>({res.rating_count})</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <h1>Pages</h1>
                    {
                        resultPages.map((res, i) => {
                            return (
                                <div className="resultPage" onClick={() => {handlePageClick(res.page_id, res.parent_topic)}}>
                                    <div className="pagetitle-wrapper">
                                        <p>Topic: {res.parentTopic.title}</p>
                                    </div>
                                    <div className="pagetopic-wrapper">
                                        <p>{res.title}</p>
                                    </div>  
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default SearchResultsPage;