import { useState } from "react"
import "./NamePrompt.css"

interface props {
    setShowNamePrompt: React.Dispatch<React.SetStateAction<boolean>>,
    label: string,
    someAction: (name:string) => Promise<void>
}

function NamePrompt( {setShowNamePrompt, label, someAction}:props ) {
    const handleNameInput = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await someAction(name)
        setShowNamePrompt(false)
    }
    const [name, setName] = useState('');
    return (
        <>
        <div className="nameprompt-main">
            <form id="nameprompt-form"
            onSubmit={(e) => {handleNameInput(e)}}>
                <p>Enter {label} name: </p>
                <input type="text" id="nameprompt-input" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                <button>Ok</button>
            </form>
        </div>
        </>
    )
}

export default NamePrompt;