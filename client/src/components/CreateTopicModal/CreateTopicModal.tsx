import { useEffect, useState } from "react"
import axios from "axios";
import useIsMountedRef from "use-is-mounted-ref";
import "./CreateTopicModal.css"
import NamePrompt from "../NamePrompt/NamePrompt";
import { RiArrowGoBackFill, RiCloseCircleLine } from "react-icons/ri";

interface props {
    setShowTopicModal: React.Dispatch<React.SetStateAction<boolean>>,
    getTopics: () => Promise<void>
}

interface Category {
    category_id: number,
    name: string,
    parent_category: number | null,
    is_active: boolean
}

// almost everything copied from CategoryModal. will try to clean up if there's time -Harley
function CreateTopicModal( {setShowTopicModal, getTopics}:props ) {
    const base_url = import.meta.env.VITE_backend_base_url;
    const isMounted = useIsMountedRef(); //for use effect -harley

    const [showNameModal, setShowNameModal] = useState(false);
    const [currentCat, setCurrentCat] = useState<number|null>(null);
    const [navStack, setNavStack] = useState<number[]>([]);

    const [categList, setCategList] = useState<Category[]>([]); //for type safety nyehehe -harley

    const handleCreateTopic = async (name:string) => {
        await axios.post(base_url+'/api/create/create-topic', {
            topic_name: name,
            parent_category: currentCat,
            author_id: parseInt(localStorage.getItem('current_user_id') ?? '')
        })
        .then(async (resp) => {
            console.log("succ");
            setShowTopicModal(false);
            await getTopics()
        })
        .catch((err) => {
            console.log('err') 
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

    useEffect(() => {
        console.log("fetching categtories..")
        if (!isMounted) {
            return
        } else {
            //tsx workaround thank you tobias lins on stackoverflow -harley
            const asyncGetCategories = async () => {
                await getCategories()
            }
            asyncGetCategories();
        }
    }, [currentCat]);

    return (
        <>
        {showNameModal && <NamePrompt setShowNamePrompt={setShowNameModal} label="topic" someAction={async (name) => { await handleCreateTopic(name)}}/>}
        <div className="categorymodal-main">
            <div id="categorymodal-container">
                <div id="categoryclose-wrapper">
                    <p onClick={()=>{setShowTopicModal(false)}}> <RiCloseCircleLine size={25}/> </p>
                </div>
                <div id="category-createnew-wrapper">
                    Choose Category:
                    <button id="categ-createnew" onClick={()=>{setShowNameModal(true)}}>
                        New Topic
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
                                    <div className="categoryItem-left">
                                        <p>{cat.name}</p>
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

export default CreateTopicModal;