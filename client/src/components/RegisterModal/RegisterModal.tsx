import { useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import "./RegisterModal.css";

export default function RegisterModal() {

    const modalRef = useRef<HTMLDivElement>(null);
    const[passwordState, setPasswordState] = useState("password");

    const handlePasswordState = () => {
        passwordState === "password" ? setPasswordState("text") : setPasswordState("password");
    }

    return (
        <>
            <div ref={modalRef} className="register-modal">
                <div className="inner-register-modal-wrapper">
                    <div className="register-modal-title-wrapper">
                        <h3>Register</h3>
                    </div>
                    <div className="register-modal-input-wrapper">
                        <form className="register-modal-form">
                            <input type="email" placeholder="Email" required />
                            <div className="password-input-wrapper">
                                <input type={passwordState} placeholder="Password" required/>
                                <div className="icon-wrapper" onClick={handlePasswordState}>
                                    {
                                    passwordState === "password" ?
                                    <FaRegEye /> :
                                    <FaRegEyeSlash />
                                    }
                                </div>
                            </div>
                            <button type="submit" className="register-button">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}