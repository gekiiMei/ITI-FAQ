import { useEffect, useState } from "react"
import "./EditorImage.css"
import axios from "axios"

interface BlockObject {
    [key:string]: any
}
interface props {
    content: BlockObject
    blockIndex: number
    setActivePageContent: React.Dispatch<React.SetStateAction<BlockObject[]>>
}

function EditorImage({ content, blockIndex, setActivePageContent }:props) {
    const base_url = import.meta.env.VITE_backend_base_url;
    

    const [userID, setUserID] = useState<number>(content.user_id)
    const [pageID, setPageID] = useState<number>(content.page_id)
    const [blockHash, setBlockHash] = useState<string>(content.block_hash) 
    const [previewPath, setPreviewPath] = useState<string>(content.path)
    const [cacheBypass, setCacheBypass] = useState(new Date().getTime())

    useEffect(()=>{
        setActivePageContent(prev => prev.map((cont, i) => i===blockIndex?{...cont,...{user_id: userID, page_id: pageID, block_hash: blockHash, path: previewPath}}:cont))
    }, [previewPath])
    
    const handleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log("calling backend")
            const formData = new FormData()
            formData.append("user_id", userID.toString())
            formData.append("page_id", pageID.toString())
            formData.append("block_hash", blockHash)
            formData.append("file", e.target.files[0])
            console.log(formData)
            await axios.post(base_url+"/api/authorupdate/save-image", formData, {
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            })
            .then((resp) => {
                console.log(base_url+"/uploads/"+userID.toString()+"/"+pageID.toString()+"/"+blockHash+".png")
                setCacheBypass(new Date().getTime())
                setPreviewPath(base_url+"/uploads/"+userID.toString()+"/"+pageID.toString()+"/"+blockHash+".png")
            })
            .catch((err) => {
                
            })
        }
    }

    return (
        <>
        <div id="editorimage-main">
            <img src={`${previewPath}?${cacheBypass}`} alt="Preview" id="editorimage-preview" />
            <input type="file" onChange={async (e) => {await handleChange(e)}}/>
        </div>
        </>
    )
}

export default EditorImage;