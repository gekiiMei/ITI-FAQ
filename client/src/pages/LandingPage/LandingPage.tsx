import "./LandingPage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import AccountButton from "../../components/AccountButton/AccountButton";
import { useNavigate } from "react-router-dom";

interface Topic {
    topic_id: number;
    title: string;
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
    const base_url = import.meta.env.VITE_backend_base_url;
    
    const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`search?q=${searchQuery}`)
        navigate(`/search?q=${searchQuery}`)
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
    
    return (
        <>
        <div className="landing-main">
            <div id="top-bar">
                <AccountButton />
            </div>
            <div id="upper-container">
                <div id="logo">

                </div>
                <form id="search-form" onSubmit={(e) => {handleSearchSubmit(e)}}>
                    <input type="text" placeholder="What would you like to learn today?" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
                    <button id="search-butt">
                        search
                    </button>
                </form>
                <div id='suggestions-container'>
                    {/* Topics */}
                    {suggestions.topics && suggestions.topics.map((topic, index) => {
                        return(
                            <div 
                                key={`topic-${topic.topic_id}`} 
                                className="suggestion-item topic-suggestion"
                                onClick={() => handleTopicClick(topic.topic_id)}
                            >
                                <span className="suggestion-icon">📚</span> {topic.title}
                            </div>
                        )
                    })}
                    {/* Pages */}
                    {suggestions.pages && suggestions.pages.map((page, index) => {
                        return(
                            <div 
                                key={`page-${page.page_id}`} 
                                className="suggestion-item page-suggestion"
                                onClick={() => handlePageClick(page.page_id, page.parent_topic)}
                            >
                                <span className="suggestion-icon">📄</span> {page.title}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div id="lower-container">

            </div>
        </div>
        </>
    )
}

export default LandingPage;