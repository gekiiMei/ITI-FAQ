import "./LandingPage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import AccountButton from "../../components/AccountButton/AccountButton";
import { useNavigate } from "react-router-dom";

interface suggestion{
    title : string
}
function LandingPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedQuery, setDebouncedQuery] = useState<string>("")
    const [suggestions, setSuggestions] = useState<suggestion[]>([])
    const base_url = import.meta.env.VITE_backend_base_url;
    const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`search?q=${searchQuery}`)
        navigate(`/search?q=${searchQuery}`)
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
            setSuggestions([]);
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
                    {
                        suggestions.map((suggestion, index) => {
                            return(
                                <div key={index}>
                                    {suggestion.title}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div id="lower-container">

            </div>
        </div>
        </>
    )
}

export default LandingPage;