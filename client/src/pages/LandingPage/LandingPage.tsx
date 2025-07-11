import "./LandingPage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import AccountButton from "../../components/AccountButton/AccountButton";
function LandingPage() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [debouncedQuery, setDebouncedQuery] = useState<string>("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const base_url = import.meta.env.VITE_backend_base_url;
    const handleSearchSubmit = async () => {

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
                <form id="search-form" onSubmit={(e) => {e.preventDefault; handleSearchSubmit()}}>
                    <input type="text" placeholder="What would you like to learn today?" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
                    <button id="search-butt">
                        search
                    </button>
                </form>
            </div>
            <div id="lower-container">

            </div>
        </div>
        </>
    )
}

export default LandingPage;