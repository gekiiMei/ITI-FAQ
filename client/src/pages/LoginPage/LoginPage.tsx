import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./LoginPage.css"
import SignupModal from "../../components/SignupModal/SignupModal";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";

function LoginPage() {
    const base_url = import.meta.env.VITE_backend_base_url;
    const [showPass, setShowPass] = useState(false);
    const [user_in, setUser_in] = useState('');
    const [pass_in, setPass_in] = useState('')
    
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate()
    console.log("login page mounted")

    const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitting form")
        console.log(user_in + pass_in)
        if (user_in == null || pass_in == null) {
            // err!!
            return;
        }
        axios.post(base_url+'/api/auth/login', {
            user_in: user_in,
            pass_in: pass_in
        })
        .then((resp) => {
            console.log(resp.data)
            localStorage.setItem("current_user", user_in)
            localStorage.setItem("current_user_id", resp.data.user_id)
            localStorage.setItem("JWT_accesstoken", resp.data.access_token)
            navigate("/dashboard")
        })
        .catch((err) => {
            console.log(err.response.data)
        })
    }

    useEffect(() => {
        const webtoken = localStorage.getItem("JWT_accesstoken")
        if (webtoken) {
            navigate("/dashboard")
        }
    }, [])

    return (
        <>
        {showModal && <SignupModal setShowModal={setShowModal} />}
        <div className="login-main">
            <form onSubmit={ handleLogin } id="login-form">
                <h1>Login</h1>
                <div id="login-fields-buttons">
                    <div id="login-fields">
                        {/* <div id="login-user-field-wrapper"> */}
                            <input type="text" id="login-user-field"
                                placeholder="Username"
                                value={user_in}
                                onChange={(e) => {setUser_in(e.target.value)}}
                            />
                        {/* </div> */}
                        <div id="login-pass-field-wrapper">
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
                    <div id="login-buttons">
                        <button id="login-button">
                            Log in
                        </button>
                        <p>Don't have an account? <span onClick={() => {setShowModal(true)}}>Register</span></p>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default LoginPage;