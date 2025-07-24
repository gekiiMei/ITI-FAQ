import { useState } from "react"
import "./RenamePrompt.css"

interface props {
    setShowRenamePrompt: React.Dispatch<React.SetStateAction<boolean>>,
    closeModal: () => void
    label: string,
    someAction: (id:number, name:string) => Promise<void>
    id: number
}

function RenamePrompt( {setShowRenamePrompt, label, someAction, id}:props ) {
    const handleRenameInput = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //do nothing on empty input -Harley
        if (name == '') {
            setShowRenamePrompt(false)
            return;
        }
        await someAction(id, name)
        setShowRenamePrompt(false)
    }
    const [name, setRename] = useState('');
    return (
        <>
        <div className="renameprompt-main">
            <form id="renameprompt-form"
            onSubmit={(e) => {handleRenameInput(e)}}>
                <p>Enter {label} name: </p>
                <input type="text" id="renameprompt-input" value={name} onChange={(e)=>{setRename(e.target.value)}}/>
                <button>Ok</button>
            </form>
        </div>
        </>
    )
}

export default RenamePrompt;