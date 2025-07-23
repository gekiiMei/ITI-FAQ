import { useNavigate } from "react-router-dom";
import CategoryModal from "../../components/CategoryModal/CategoryModal";
import CreateTopicModal from "../../components/CreateTopicModal/CreateTopicModal";
import "./DashboardPage.css"
import axios from "axios";
import { useEffect, useState } from "react";
import ThumbnailUploadModal from "../../components/ThumbnailUploadModal/ThumbnailUploadModal";
import RenamePrompt from "../../components/RenamePrompt/RenamePrompt";
import { MdDelete, MdModeEditOutline, MdOutlineAddCircle } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { HiOutlineViewGridAdd } from "react-icons/hi";

interface Topic {
    topic_id: number,
    title: string,
    parent_category: number,
    author_id: number,
    total_rating: number,
    rating_count: number,
    thumbnail_path: string
    updatedAt:string,
}

function DashboardPage() {
    const navigate = useNavigate()
    const base_url = import.meta.env.VITE_backend_base_url;
    const image_url = import.meta.env.VITE_image_base_path;
    const current_user = localStorage.getItem("current_user")
    const [showCategModal, setShowCategModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [topicList, setTopicList] = useState<Topic[]>([])
    
    const [showThumbModal, setShowThumbModal] = useState<boolean>(false)
    const [selectedTopicForThumb, setSelectedTopicForThumb] = useState<number|null>(null)
    const [selectedTopicPath, setSelectedTopicPath] = useState<string|null>(null)

    const [selectedTopicForRename, setSelectedTopicForRename] = useState<number|null>(null)

    
    const handleLogout = async () => {
        localStorage.removeItem("JWT_accesstoken")
        localStorage.removeItem("current_user")
        try {
            await axios.get(base_url+"/api/auth/remove-refresh")
            navigate("/login")
        } catch(e) {
            console.log(e)
        }
    }
    const getTopics = async () => {
        await axios.post(base_url+'/api/authorfetch/fetch-topics', {
            author_id: parseInt(localStorage.getItem("current_user_id")??'')
        })
        .then((resp) => {
            setTopicList(resp.data.topics)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const archiveTopic = async (id:number) => {
        await axios.post(base_url+'/api/archive/archive-topic', {
            topic_id: id
        })
        .then(async (resp)=>{await getTopics()})
    }

    const renameTopic = async (id: number, new_title:string) => {
        await axios.post(base_url+'/api/authorupdate/rename-topic', {
            topic_id: id,
            new_title: new_title
        })
        .then(async (resp) => {await getTopics()})
        .catch((err) => {console.log(err)})
    }

    const openRenameModal = (id:number) => {
        setSelectedTopicForRename(id)

        setShowRenameModal(true)
    }

    const openThumbModal = (id:number, path:string) => {
        setSelectedTopicForThumb(id)
        setSelectedTopicPath(path)

        setShowThumbModal(true)
    }

    const closeModal = () => {
        setSelectedTopicForThumb(null)
        setSelectedTopicPath(null)

        setShowThumbModal(false)
        setShowRenameModal(false)
        window.location.reload()
    }
    
    useEffect(() => {
        console.log("fetching topics")
        const asyncGetTopics = async () => {
            await getTopics()
        }
        asyncGetTopics()
    }, [])

    return (
        <>  
            {showThumbModal && <ThumbnailUploadModal userID={parseInt(localStorage.getItem("current_user_id")??"")} topicID={selectedTopicForThumb??-1} path={selectedTopicPath??"placeholder"} closeModal={closeModal}/>}
            {showCategModal && <CategoryModal setShowCategModal={setShowCategModal}/>}
            {showTopicModal && <CreateTopicModal setShowTopicModal={setShowTopicModal} getTopics={getTopics}/>}
            {showRenameModal && <RenamePrompt setShowRenamePrompt={setShowRenameModal} label="new topic" someAction={renameTopic} closeModal={closeModal} id={selectedTopicForRename??-1}/> }
        
            <div className="dash-main">
                <div id="dash-header">
                    <div id="author-label">
                        <h1>Welcome, {current_user}!</h1>
                    </div>
                    <div id="logout">
                        <button id="logout-button" onClick={() => { handleLogout() }}>
                            <CiLogout strokeWidth={2} /> Logout
                        </button>
                    </div>
                </div>
                <div id="dash-content">
                    <div id="dash-content-container">
                        <div id="dash-content-labels">
                            <h1 id="your-topics"> Your topics:</h1>
                            <div id="dash-categbutton-wrapper">
                                <button id="categ-button" onClick={()=>{setShowCategModal(true)}}> <HiOutlineViewGridAdd /> Manage Categories</button>
                            </div>
                        </div>
                        <div id="dash-content-list">
                            {
                                topicList.map((topic, i) => {
                                    return (
                                        <div className="dash-topic-item" key={i} onClick={()=>{ navigate("/editor?topic_id=" + topic.topic_id) }}>
                                            
                                            <div className="dash-topicitem-left" >
                                                <div id="images-button-wrapper"> 
                                                    <button className="thumbbutton" onClick={(e) => {e.stopPropagation();openThumbModal(topic.topic_id, topic.thumbnail_path)}}> <MdModeEditOutline />Edit</button>
                                                    <img className="dash-topic-thumbnail" src={topic.thumbnail_path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+topic.thumbnail_path} alt="thumbnail" />
                                                </div>
                                                <div className="dash-topicitem-title-wrapper">
                                                    <p>{topic.title}</p>
                                                </div>
                                            </div>
                                            <div className="dash-topicitem-right">
                                                <div className="dash-topicitem-ratings">
                                                    {/* <p>{((topic.total_rating/topic.rating_count)==0 || topic.rating_count == 0) ? "0.0" : (topic.total_rating/topic.rating_count).toFixed(1)}</p>
                                                    <p>({topic.rating_count})</p> */}
                                                </div>
                                                <div className="dash-topicitem-deletewrapper">
                                                    <button id="dash-topic-rename" onClick={async (e) => {e.stopPropagation(); openRenameModal(topic.topic_id) }}>
                                                      <BiSolidEdit /> Rename
                                                    </button>
                                                    <button id="dash-topic-delete" onClick={async (e) => {e.stopPropagation(); await archiveTopic(topic.topic_id) }}>
                                                       <MdDelete /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div id="dash-createnew-wrapper">
                            <button id="dash-createnew" onClick={()=>{setShowTopicModal(true)}}>
                                <MdOutlineAddCircle /> Create new
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )   
}

export default DashboardPage