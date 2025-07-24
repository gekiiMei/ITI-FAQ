import { useEffect, useState } from "react"
import axios from "axios";
import "./CategoryModal.css"
import NamePrompt from "../NamePrompt/NamePrompt";

import { RiArrowGoBackFill, RiCloseCircleLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

interface props {
    setShowCategModal: React.Dispatch<React.SetStateAction<boolean>>
}

interface Category {
    category_id: number,
    name: string,
    parent_category: number | null,
    is_active: boolean
}

function CategoryModal( {setShowCategModal}:props ) {
    const base_url = import.meta.env.VITE_backend_base_url;

    const [showNameModal, setShowNameModal] = useState(false);
    const [currentCat, setCurrentCat] = useState<number|null>(null);
    const [navStack, setNavStack] = useState<number[]>([]);

    const [categList, setCategList] = useState<Category[]>([]); //for type safety nyehehe -harley

    const handleCreateCategory = async (name:string) => {
        await axios.post(base_url+'/api/create/create-category', {
            category_name: name,
            category_parent: currentCat
        })
        .then(async (resp) => {
            console.log("succ")
            console.log(resp.data)
            await getCategories()
        })
        .catch((err) => {
            console.log("err")
            console.log(err)
        })
    }

    const getCategories = async () => {
        await axios.post(base_url+'/api/authorfetch/fetch-categories', {
            curr_parent:currentCat
        })
        .then((resp) => {
            console.log("succ");
            console.log(resp.data.categories);
            setCategList(resp.data.categories);
        })
        .catch((err) => {
            console.log("err")
            console.log(err)
        })
    }

    const openCategory = async (id: number) => {
        if (currentCat != null) {
            setNavStack(prev => [...prev, currentCat]);
        }
        setCurrentCat(id)
        // await getCategories()
    }

    const backCategory = async () => {
        setNavStack(prev => {
            const hist = [...prev]
            const new_curr = hist.pop() ?? null
            setCurrentCat(new_curr)
            return hist
        })
        // await getCategories()
    }

    const archiveCat = async (id:number) => {
        await axios.post(base_url+'/api/archive/archive-category', {
            category_id: id
        })
        await getCategories();
    }

    useEffect(() => {
        console.log("fetching categtories..")
        //tsx workaround thank you tobias lins on stackoverflow -harley
        const asyncGetCategories = async () => {
            await getCategories()
        }
        asyncGetCategories();
    }, [currentCat]);

    return (
        <>
        {showNameModal && <NamePrompt setShowNamePrompt={setShowNameModal} label="category" someAction={async (name) => { await handleCreateCategory(name)}}/>}
        <div className="categorymodal-main">
            <div id="categorymodal-container">
                <div id="categoryclose-wrapper">
                    <p onClick={()=>{setShowCategModal(false)}}> <RiCloseCircleLine size={25}/> </p>
                </div>
                <div id="category-createnew-wrapper1">
                    <button id="categ-createnew" onClick={()=>{setShowNameModal(true)}}>
                        New Category
                    </button>
                </div>
                <div id="category-list">
                    {currentCat != null && 
                    <div id="cat-back-button-wrapper"> 
                        <div id="cat-back-button" onClick={async () => {await backCategory()}}>
                         <RiArrowGoBackFill/> back
                        </div>
                    </div>
                    }
                    
                    {
                        categList.map((cat) => {
                            return (
                                <div className="categoryItem" key={cat.category_id} onClick={async () => {await openCategory(cat.category_id)}}>
                                    <div className="categoryItem-left" >
                                        <p>{cat.name}</p>
                                    </div>
                                        <div className="categoryItem-right">
                                            <button onClick={async (e) => {e.stopPropagation(); await archiveCat(cat.category_id)}}> <MdDelete /> Delete</button>
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

export default CategoryModal;