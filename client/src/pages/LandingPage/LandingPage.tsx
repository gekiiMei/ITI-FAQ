import "./LandingPage.css"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AccountButton from "../../components/AccountButton/AccountButton";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"
import HRDotNetLogo from "../../../public/HRDOTNET Logo.png"

interface Topic {
    topic_id: number;
    title: string;
    thumbnail_path:string
    total_rating:number
    rating_count:number
    updatedAt:string
}

interface Page {
    page_id: number;
    title: string;
    parent_topic: number;
}

interface Suggestions {
    topics: Topic[];
    pages: Page[];
}

function LandingPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedQuery, setDebouncedQuery] = useState<string>("")
    const [suggestions, setSuggestions] = useState<Suggestions>({ topics: [], pages: [] })
    const [featuredTopics, setFeaturedTopics] = useState<Topic[]>([])
    const [searchFocused, setSearchFocused] = useState<boolean>(false)
    const base_url = import.meta.env.VITE_backend_base_url;
    const image_url = import.meta.env.VITE_image_base_path;

    const search_ref = useRef<HTMLInputElement>(null)
    
    const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`search?q=${searchQuery}&sort=date`)
        navigate(`/search?q=${searchQuery}&sort=date`)
    }

    const handleTopicClick = (topicId: number) => {
        console.log(`Navigating to topic: ${topicId}`)
        navigate(`/viewer?topic_id=${topicId}`)
    }

    const handlePageClick = (pageId: number, parentTopicId: number) => {
        console.log(`Navigating to page: ${pageId} in topic: ${parentTopicId}`)
        navigate(`/viewer?topic_id=${parentTopicId}&page=${pageId}`)
    }
    
    useEffect(()=>{
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500)

        return () => {clearTimeout(handler)}
    }, [searchQuery])

    useEffect(() => {
        if (debouncedQuery != "") {
            axios.get( base_url +'/api/userfetch/get-suggestions', {
                params: {current_query: debouncedQuery}
            })
            .then((resp)=>{
                setSuggestions(resp.data.suggestions)
            })
            .catch((err) => {
                console.error(err)
            })
        } else {
            setSuggestions({ topics: [], pages: [] });
        }
    }, [debouncedQuery])

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
    
    return (
        <>
        <div className="landing-main">
            <div id="top-bar">
                <AccountButton />
            </div>
            <div id="upper-container">
                <div id="logo">
                    <img src={HRDotNetLogo} alt="" style={{width:'auto', height:'20rem'}}/>
                </div>
                <div id="search-sugg-cont">
                    <form id="search-form" onSubmit={(e) => {handleSearchSubmit(e)}}>
                        <input type="text" placeholder="What would you like to learn today?" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} ref={search_ref} onFocus={() => {setSearchFocused(true)}} onBlur={() => {setSearchFocused(false)}} />
                        <button id="search-butt">
                            search
                        </button>
                    </form>
                    <div id='suggestions-container'>
                        {/* Topics */}
                        {suggestions.topics && searchFocused && suggestions.topics.map((topic, index) => {
                            return(
                                <div 
                                    key={`topic-${topic.topic_id}`} 
                                    className="suggestion-item topic-suggestion"
                                    onMouseDown={() => handleTopicClick(topic.topic_id)}  // <- onMouseDown instead of onClick, because mouseDown registers before onBlur
                                >
                                    <span className="suggestion-icon">📚</span> {topic.title}
                                </div>
                            )
                        })}
                        {/* Pages */}
                        {suggestions.pages && searchFocused && suggestions.pages.map((page, index) => {
                            return(
                                <div 
                                    key={`page-${page.page_id}`} 
                                    className="suggestion-item page-suggestion"
                                    onMouseDown={() => handlePageClick(page.page_id, page.parent_topic)}
                                >
                                    <span className="suggestion-icon">📄</span> {page.title}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div id="lower-container">
                <div id="featuredlabel-wrapper">
                    <p>Featured topics:</p>
                </div>
                <div id="featured-cont">
                    {
                        featuredTopics.map((res, i) => {
                            return (
                                <div className="featuredTopic" onClick={() => {handleTopicClick(res.topic_id)}}>
                                    {/* <div className="featuredTopic-left">
                                        <img className="featured-topic-thumbnail" src={res.thumbnail_path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+res.thumbnail_path} alt="" />
                                        <div className="featured-topic-titledate-wrapper">
                                            <p>{res.title}</p>
                                            <p>Last updated: <span>{format(new Date(res.updatedAt), "MM/dd/yyyy")}</span></p>
                                        </div>
                                    </div>  
                                    <div className="featuredTopic-right">
                                        <p>{((res.total_rating/res.rating_count)==0 || res.rating_count == 0) ? "0.0" : (res.total_rating/res.rating_count).toFixed(1)}</p>
                                        <p>({res.rating_count})</p>
                                    </div> */}
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

export default LandingPage;