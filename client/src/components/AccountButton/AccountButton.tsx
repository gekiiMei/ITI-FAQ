import { useNavigate } from "react-router-dom";
import UserLogo from "../../assets/user.svg"
import "./AccountButton.css"

function AccountButton() {
    const nav = useNavigate()
    return (
        <>
        <div className="comp-loginbutton-container"
            onClick={()=>{nav("/login")}}>
            <img src={UserLogo} />
            <p>Author Login or Signup</p>
        </div>
        </>
    )
}

export default AccountButton;