import { useNavigate } from "react-router-dom";
import CategoryModal from "../../components/CategoryModal/CategoryModal";
import "./DashboardPage.css"
import axios from "axios";
import { useState } from "react";

function DashboardPage() {
    const navigate = useNavigate()
    const base_url = import.meta.env.VITE_backend_base_url;
    const current_user = localStorage.getItem("current_user")
    const [showCategModal, setShowCategModal] = useState(false);
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
    return (
        <>
            {showCategModal && <CategoryModal setShowCategModal={setShowCategModal}/>}
            <div className="dash-main">
                <div id="dash-navbar">
                    <div id="author-label">
                        <h1>Welcome, {current_user}!</h1>
                    </div>
                    <div id="logout">
                        <button id="logout-button" onClick={() => { handleLogout() }}>
                            logout
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
                            asd
                        </div>
                        <div id="dash-createnew-wrapper">
                            <button id="dash-createnew">
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