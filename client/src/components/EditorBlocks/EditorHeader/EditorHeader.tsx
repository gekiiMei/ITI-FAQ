import { useEffect, useState } from "react"
import "./EditorHeader.css"

interface BlockObject {
    [key:string]: any
}
interface props {
    content: BlockObject
    setActivePageContent: React.Dispatch<React.SetStateAction<BlockObject[]>>,
    blockIndex: number
}

function EditorHeader({ content, setActivePageContent, blockIndex }:props) {
    const [fontSize, setFontSize] = useState<number>(content.font);
    const [text, setText] = useState<string>(content.text);
    useEffect(()=>{
        setActivePageContent(prev => prev.map((cont, i) => i===blockIndex?{...cont,...{text:text, font:fontSize}}:cont))
    }, [text, fontSize])

    return (
        <>
        <div id="editorheader-main">
            <p>Text: </p>
            <input type="text" placeholder="Header text:" value={text} onChange={(e)=>{setText(e.target.value)}}/>
            <p>Font size: </p>
            <select value={fontSize} onChange={(e)=>{setFontSize(parseInt(e.target.value))}}>
                <option value={24}>24</option>
                <option value={30}>30</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
                <option value={60}>60</option>
                <option value={96}>96</option>
            </select>
        </div>
        </>
    )
}

export default EditorHeader