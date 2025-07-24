import { useState } from "react"
import NavBar from "../../components/NavBar/NavBar"
import "./SupportFormPage.css"

function SupportFormPage() {
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [concern, setConcern] = useState<string>("")

    const submitConcern = async() => {

    }

    return (
        <>
        <div className="supportpage-main">  
            <NavBar />
            <div id="supportpage-body">
                <form action="" id="support-form">
                    <div id="supportform-header">
                        <h2>Support Form</h2>
                        <hr/>
                    </div>
                    <div id="supportform-body">
                        <div id="supportform-namedeets">
                            <div id="firstname-container">
                                <label htmlFor="firstname=field">First name<span>*</span></label>
                                <input type="text" id="firstname-field" />
                            </div>
                            <div id="lastname-container">
                                <label htmlFor="lastname-field">Last Name<span>*</span></label>
                                <input type="text"  id="lastname-field"/>
                            </div>
                        </div>
                        <div id="supportform-email">
                            <label htmlFor="email-field">Email<span>*</span></label>
                            <input type="email" id="email-field" />
                        </div>
                        <div id="supportform-concern">
                            <label htmlFor="concern-field">Concern<span>*</span></label>
                            <textarea name="" id="concern-field"></textarea>
                        </div>
                    </div>
                    <div id="supportform-button">
                        <button>Submit</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default SupportFormPage