import { useState } from "react";
import axios from "axios";
import "./SignupModal.css"
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";

interface props {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

function SignupModal({ setShowModal }:props) {
    const base_url = import.meta.env.VITE_backend_base_url;    
    const [showPass, setShowPass] = useState(false);
    const [user_in, setUser_in] = useState('');
    const [pass_in, setPass_in] = useState('')

    const handleSignup = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user_in == "" || pass_in == "") {
            // err!!
            return;
        }
        console.log("submitting form")
        console.log(user_in + pass_in)
        axios.post(base_url+'/api/auth/signup', {
            user_in: user_in,
            pass_in: pass_in
        })
        .then((resp) => {
            console.log(resp.data)
            alert("created user successfully")
        })
        .catch((err) => {
            console.log(err.data)
        })
    }

    return (
        <>
            <div className="signupmodal-main">
                <form onSubmit={ handleSignup } id="signup-form">
                    <h1>Sign up</h1>
                    <div id="signup-fields-buttons">
                        <div id="signup-fields">
                            {/* <div id="signup-user-field-wrapper"> */}
                                <input type="text" id="signup-user-field"
                                    placeholder="Username"
                                    value={user_in}
                                    onChange={(e) => {setUser_in(e.target.value)}}
                                />
                            {/* </div> */}
                            <div id="signup-pass-field-wrapper">
                                <input type={showPass ? "text" : "password"} 
                                    placeholder="Password"
                                    value={pass_in}
                                    onChange={(e)=> {setPass_in(e.target.value)}}
                                />
                                {
                                    showPass ?
                                        <button type="button" onClick={() => {setShowPass(false)}}><FaEye size={24}/></button>
                                    :
                                        <button type="button" onClick={() => {setShowPass(true)}}><IoEyeOff size={24}/></button>
                                }
                            </div>
                        </div>
                        <div id="signup-buttons">
                            <button id="signup-button">
                                Sign up
                            </button>
                            <button id="cancel-button" onClick={() => {setShowModal(false)}}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignupModal;