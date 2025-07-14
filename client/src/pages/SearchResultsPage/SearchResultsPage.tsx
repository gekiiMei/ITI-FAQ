import "./SearchResultsPage.css"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import axios from "axios";

interface ResultItem {
    title:string
    total_rating:number
    rating_count:number
}

function SearchResultsPage() {
    const base_url = import.meta.env.VITE_backend_base_url;

    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get("q")??""
    const [sortMethod, setSortMethod] = useState<string>("date")
    const [searchResults, setSearchResults] = useState<ResultItem[]>([])
    console.log("search results page mounted")
    const getResults = async () => {
        console.log("calling search api endpoint")
        await axios.get(base_url+"/api/userfetch/search", {
            params: {
                search_query: searchQuery
            }
        })
        .then((resp) => {
            setSearchResults(resp.data.results)
        })
        .catch((err) => {

        })
    }

    useEffect(() => {
        const asyncGetResults = async () => {
            await getResults()
        }
        asyncGetResults()
    }, [])

    useEffect(() => {
        console.log("query: " + searchParams.get("q"))
        console.log("got results: ")
        console.log(searchResults)
    }, [searchResults])
    
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
                        {
                            searchResults.map((res, i) => {
                                return (
                                    <div className="resultItem">
                                        <div className="resultItem-left">
                                            <p>{res.title}</p>
                                        </div>  
                                        <div className="resultItem-right">
                                            <p>{((res.total_rating/res.rating_count)==0 || res.rating_count == 0) ? "0.0" : (res.total_rating/res.rating_count).toFixed(1)}</p>
                                            <p>({res.rating_count})</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div id="searchres-container">
                    
                </div>
            </div>
        </div>
        </>
    )
}

export default SearchResultsPage;