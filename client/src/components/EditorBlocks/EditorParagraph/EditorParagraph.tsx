import { useEffect, useState } from "react"
import "./EditorParagraph.css"

interface BlockObject {
    [key:string]: any
}
interface props {
    content: BlockObject
    setActivePageContent: React.Dispatch<React.SetStateAction<BlockObject[]>>,
    blockIndex: number
}

function EditorParagraph({ content, setActivePageContent, blockIndex }:props) {
    const [text, setText] = useState<string>(content.text);
    useEffect(()=>{
        setActivePageContent(prev => prev.map((cont, i) => i===blockIndex?{...cont,...{text:text}}:cont))
    }, [text])

    return (
        <>
        <div id="editorparagraph-main">
            <p>Text: </p>
            <input type="text" placeholder="Header text:" value={text} onChange={(e)=>{setText(e.target.value)}}/>
        </div>
        </>
    )
}

export default EditorParagraph