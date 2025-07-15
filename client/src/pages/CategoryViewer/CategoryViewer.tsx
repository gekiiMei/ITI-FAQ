import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./CategoryViewer.css"
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns"
import { IoIosArrowForward } from "react-icons/io";


interface Category {
    category_id: number,
    name: string,
    parent_category: number | null,
    is_active: boolean
}

interface Topic {
    title:string
    thumbnail_path:string
    total_rating:number
    rating_count:number
    updatedAt:string
    topic_id: number
}


function CategoryViewer() {
    const base_url = import.meta.env.VITE_backend_base_url;
    const image_url = import.meta.env.VITE_image_base_path;

    const [searchParams, setSearchParams] = useSearchParams()
    // eehh logic could be better (just taking these details directly from a category interface/obj) but time is tight so we're just copying CategoryModal logic with these hacky tweaks -harley
    const currentCategoryID = searchParams.get("category")
    const [parentCat, setParentCat] = useState<Category|null>(null)
    const [currentCat, setCurrentCat] = useState<Category|null>(null)
    const [categList, setCategList] = useState<Category[]>([]); 
    const [topicList, setTopicList] = useState<Topic[]>([])

    const navigate = useNavigate()

    const getCategories = async () => {
        await axios.post(base_url+'/api/authorfetch/fetch-categories', {
            curr_parent:currentCategoryID
        })
        .then((resp) => {
            console.log("succ");
            console.log(resp.data.categories);
            setCategList(resp.data.categories);
            setCurrentCat(resp.data.parent)
            console.log("grandparent: " + resp.data.grandparent)
            setParentCat(resp.data.grandparent)
        })
        .catch((err) => {
            console.log("err")
            console.log(err)
        })
    }

    const getTopics = async () => {
        await axios.post(base_url+'/api/authorfetch/fetch-topics', {
            parent_cat: currentCategoryID
        })
        .then((resp) => {
            setTopicList(resp.data.topics)
        })
        .catch((err) => {

        })
    }

    const openCategory = (id:number) => {
        navigate(`/category?category=${id}`)
    }

    const openTopic = (id:number) => {
        navigate(`/viewer?topic_id=${id}`)
    }

    useEffect(() => {
        console.log("fetching categtories..")
        //tsx workaround thank you tobias lins on stackoverflow -harley
        const asyncGetCategories = async () => {
            await getCategories()
        }
        const asyncGetTopics = async () => {
            await getTopics()
        }
        asyncGetCategories();
        asyncGetTopics()
    }, [currentCategoryID]);

    
    return(
        <>
        <div className="categoryviewer-main">
            <NavBar />
            <div id="categoryviewer-body">
                <div id="categoryviewer-header">
                    <h1>Category: {parentCat && <div id="parent-label" onClick={()=>{navigate(`/category?category=${parentCat.category_id}`)}}><span>{parentCat.name}
                        </span> <IoIosArrowForward /></div>}<span>{currentCat?.name}</span></h1>
                </div>
                <div id="categoryviewer-content">
                    <h1>Categories</h1>
                    {
                        categList.map((cat, index) => {
                            return (
                                <div className="categoryItem" key={index} onClick={() => {openCategory(cat.category_id)}}>
                                    <p>{cat.name}</p>
                                </div>
                            )
                        })
                    }
                    <h1>Topics</h1>
                    {
                        topicList.map((top, index) => {
                            return (
                                <div className="topicItem" key={index} onClick={() => {openTopic(top.topic_id)}}>
                                    <div className="resultTopic-left">
                                        <img className="topic-thumbnail" src={top.thumbnail_path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+top.thumbnail_path} alt="" />
                                        <div className="topic-titledate-wrapper">
                                            <p>{top.title}</p>
                                            <p>Last updated: <span>{format(new Date(top.updatedAt), "MM/dd/yyyy")}</span></p>
                                        </div>
                                    </div>  
                                    <div className="resultTopic-right">
                                        <p>{((top.total_rating/top.rating_count)==0 || top.rating_count == 0) ? "0.0" : (top.total_rating/top.rating_count).toFixed(1)}</p>
                                        <p>({top.rating_count})</p>
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

export default CategoryViewer;