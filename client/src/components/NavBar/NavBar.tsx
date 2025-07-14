import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountButton from "../AccountButton/AccountButton";
import "./NavBar.css"
import axios from "axios";

interface suggestion{
    title : string
}

function NavBar() {
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
        <div className="navbar-main">
            <form id="searchbar" onSubmit={(e) => {handleSearchSubmit(e)}}>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}}/>
                {suggestions.map((suggestion, i) => {
                    return(
                        <div className="suggestion-item">
                            
                        </div>
                    )
                })}
            </form>
            <div id="accountbutt-wrapper">
                <AccountButton />
            </div>
        </div>
    )
}

export default NavBar;