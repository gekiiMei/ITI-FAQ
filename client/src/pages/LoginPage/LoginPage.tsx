import { useState } from "react"
import "./LoginPage.css"

function LoginPage() {
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitting form")
    }

    return (
        <>
        <div className="login-main">
            <form onSubmit={ handleLogin } id="login-form">
                <h1>Login</h1>
                <div id="login-fields-buttons">
                    <div id="login-fields">
                        <div id="login-user-field-wrapper">
                            <input type="text" id="login-user-field" />
                        </div>
                        <div id="login-pass-field-wrapper">
                            <input type={showPass ? "text" : "password"} />
                        </div>
                    </div>
                    <div id="login-buttons">
                        <button id="login-button">
                            Log in
                        </button>
                        <p>Don't have an account? <span onClick={() => {console.log("Register clicked")}}>Register</span></p>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default LoginPage;