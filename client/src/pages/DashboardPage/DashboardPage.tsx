import { useNavigate } from "react-router-dom";
import CategoryModal from "../../components/CategoryModal/CategoryModal";
import CreateTopicModal from "../../components/CreateTopicModal/CreateTopicModal";
import "./DashboardPage.css"
import axios from "axios";
import { useEffect, useState } from "react";
import ThumbnailUploadModal from "../../components/ThumbnailUploadModal/ThumbnailUploadModal";
import { CiLogout } from "react-icons/ci";

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
    const [topicList, setTopicList] = useState<Topic[]>([])
    
    const [showThumbModal, setShowThumbModal] = useState<boolean>(false)
    const [selectedTopicForThumb, setSelectedTopicForThumb] = useState<number|null>(null)
    const [selectedTopicPath, setSelectedTopicPath] = useState<string|null>(null)
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

    const openThumbModal = (id:number, path:string) => {
        setSelectedTopicForThumb(id)
        setSelectedTopicPath(path)

        setShowThumbModal(true)
    }

    const closeModal = () => {
        setSelectedTopicForThumb(null)
        setSelectedTopicPath(null)

        setShowThumbModal(false)

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
        
            <div className="dash-main">
                <div id="dash-header">
                    <div id="author-label">
                        <h1>Welcome, {current_user}!</h1>
                    </div>
                    <div id="logout">
                        <button id="logout-button" onClick={() => { handleLogout() }}>
                            <CiLogout /> Logout
                        </button>
                    </div>
                </div>
                <div id="dash-content">
                    <div id="dash-content-container">
                        <div id="dash-content-labels">
                            <h1 id="your-topics"> Your topics:</h1>
                            <div id="dash-categbutton-wrapper">
                                <button id="categ-button" onClick={()=>{setShowCategModal(true)}}>Manage Categories</button>
                            </div>
                        </div>
                        <div id="dash-content-list">
                            {
                                topicList.map((topic, i) => {
                                    return (
                                        <div className="dash-topic-item" key={i} onClick={()=>{ navigate("/editor?topic_id=" + topic.topic_id) }}>
                                            <button className="thumbbutton" onClick={() => {openThumbModal(topic.topic_id, topic.thumbnail_path)}}>edit thumbnail</button>
                                            <div className="dash-topicitem-left" >
                                                <img className="dash-topic-thumbnail" src={topic.thumbnail_path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+topic.thumbnail_path} alt="thumbnail" />
                                                <div className="dash-topicitem-title-wrapper">
                                                    <p>{topic.title}</p>
                                                </div>
                                            </div>
                                            <div className="dash-topicitem-right">
                                                <div className="dash-topicitem-ratings">
                                                    <p>{((topic.total_rating/topic.rating_count)==0 || topic.rating_count == 0) ? "0.0" : (topic.total_rating/topic.rating_count).toFixed(1)}</p>
                                                    <p>({topic.rating_count})</p>
                                                </div>
                                                <div className="dash-topicitem-deletewrapper">
                                                    <button id="dash-topic-delete" onClick={async () => { await archiveTopic(topic.topic_id) }}>
                                                        delete
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
                                Create new
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )   
}

export default DashboardPage