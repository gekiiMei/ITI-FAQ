import { useEffect, useState } from "react"
import "./EditorList.css"

interface BlockObject {
    [key:string]: any
}
interface props {
    content: BlockObject
    setActivePageContent: React.Dispatch<React.SetStateAction<BlockObject[]>>,
    blockIndex: number
}

function EditorList({ content, setActivePageContent, blockIndex }:props) {
    const [label, setLabel] = useState<string>(content.label);
    const [listType, setListType] = useState<string>(content.listType)
    const [entries, setEntries] = useState<string[]>(content.entries);
    
    const deleteEntry = (index:number) => {
        setEntries(prev=>prev.filter((entry, i) => {return i!==index}))
    }

    useEffect(()=>{
        setActivePageContent(prev => prev.map((cont, i) => i===blockIndex?{...cont,...{label:label, listType:listType, entries:entries}}:cont))
    }, [label, listType, entries])

    return (
        <>
        <div id="editorparagraph-main">
            <p>Label: </p>
            <input type="text" placeholder="Label:" value={label} onChange={(e)=>{setLabel(e.target.value)}}/>
            <select value={listType} onChange={(e)=>{setListType(e.target.value)}}>
                <option value={"numbered"}>numbered</option>
                <option value={"bullet"}>bullet</option>
            </select>
            <div id="editorlist-entries">
                {
                    entries.map((entry, index) => {
                        return(
                            <div className="entry" key={index}>
                                <input type="text" value={entry} onChange={(e) => {setEntries(entries.map((entry, i) => i===index ? e.target.value : entry))}} />
                                <button className="entry-del" onClick={()=>{deleteEntry(index)}}>
                                    del
                                </button>
                            </div>
                        )
                    })
                }
                <button id="entry-add" onClick={() => {setEntries(prev => [...prev, ""])}}>add</button>
            </div>
        </div>
        </>
    )
}

export default EditorList