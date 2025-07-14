import { useState } from "react"
import "./ThumbnailUploadModal.css"
import axios from "axios"

interface props {
    userID: number
    topicID: number
    path: string
    closeModal:() => void
}

function ThumbnailUploadModal({ userID, topicID, path, closeModal }:props) {
    const base_url = import.meta.env.VITE_backend_base_url;
    const image_url = import.meta.env.VITE_image_base_path;
    const [previewPath, setPreviewPath] = useState<string>(path=="placeholder"?image_url+"/topic-thumbnails/placeholder.png":base_url+path)
    const [cacheBypass, setCacheBypass] = useState(new Date().getTime())
    
    const handleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log("calling backend")
            const formData = new FormData()
            formData.append("user_id", userID.toString())
            formData.append("topic_id", topicID.toString())
            formData.append("file", e.target.files[0])
            console.log(formData)
            await axios.post(base_url+"/api/authorupdate/update-thumbnail", formData, {
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            })
            .then((resp) => {
                setPreviewPath(base_url+resp.data.path)
            })
            .catch((err) => {
                
            })
        }
    }

    return (
        <>
        <div className="thumbmodal-main">
            <div id="thumbmodal-body">
                <img src={`${previewPath}`} alt="Preview" id="editorimage-preview" />
                <input type="file" onChange={async (e) => {await handleChange(e)}}/>
                <button onClick={()=>{closeModal()}}>ok</button>
            </div>
        </div>
        </>
    )
}

export default ThumbnailUploadModal;