import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AccountButton from "../AccountButton/AccountButton";
import "./NavBar.css"
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import HRDotNetLogo from "../../../public/HRDOTNET Logo.png"

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

function NavBar() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedQuery, setDebouncedQuery] = useState<string>("")
    const [suggestions, setSuggestions] = useState<Suggestions>({ topics: [], pages: [] })
    const [searchFocused, setSearchFocused] = useState<boolean>(false)
    const base_url = import.meta.env.VITE_backend_base_url;

    const search_ref = useRef<HTMLInputElement>(null)
    
    const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`search?q=${searchQuery}`)
        navigate(`/search?q=${searchQuery}&sort=date`)
    }

    const handleTopicClick = (topicId: number) => {
        console.log(`Navigating to topic: ${topicId}`)
         console.log(`Navigating to topic: ${topicId}`)
        navigate(`/viewer?topic_id=${topicId}`)
    }

    const handlePageClick = (pageId: number, parentTopicId: number) => {
        console.log(`Navigating to page: ${pageId} in topic: ${parentTopicId}`)
         console.log(`Navigating to page: ${pageId} in topic: ${parentTopicId}`)
        navigate(`/viewer?topic_id=${parentTopicId}&page=${pageId}`)
    }

    //note to selvin: use useNavigate() for navigating between pages bc window.open opens it in a new tab -Harley
    // const handleFAQClick = () => {
    //     window.open('/faq', '_blank');
    // }
    const handleSupportClick = () => {
        navigate("/support");
    }
    const handleLogoClick = () => {
        navigate('/')
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
        <div className="navbar-main">
            <div className="navbar-left">
                <div id="navbarlogo" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
                    <img src={HRDotNetLogo} alt="" style={{width:'13.438rem', height:'4.375rem'}}/>
                </div>
            </div>
            <form id="searchbar" onSubmit={handleSearchSubmit}>
                <div id="bar-wrapper">
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} ref={search_ref} onFocus={() => {setSearchFocused(true)}} onBlur={() => {setSearchFocused(false)}} />
                    <button type="submit"><IoSearchOutline size={24} /></button>
                </div>
                <div id="navbar-suggestions-container">
                    {suggestions.topics && searchFocused && suggestions.topics.map((topic, index) => {
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

                    {suggestions.pages && searchFocused && suggestions.pages.map((page, index) => {
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
            </form>
            <div className="navbar-links">
                {/* <span className="navbar-link" onClick={handleFAQClick}>FAQ</span> */}
                <span className="navbar-link" onClick={handleSupportClick}>SUPPORT LINK</span>
            </div>
            {/* <div id="accountbutt-wrapper">
                <AccountButton />
            </div> */}
        </div>
    )
}

export default NavBar;