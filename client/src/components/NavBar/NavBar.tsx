import AccountButton from "../AccountButton/AccountButton";
import "./NavBar.css"

function NavBar() {
    return (
        <div className="navbar-main">
            <form id="searchbar">
                <input type="text" placeholder="Search..."/>
            </form>
            <div id="accountbutt-wrapper">
                <AccountButton />
            </div>
        </div>
    )
}

export default NavBar;