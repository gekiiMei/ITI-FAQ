import "./LandingPage.css"
import AccountButton from "../../components/AccountButton/AccountButton";
function LandingPage() {
    return (
        <>
        <div className="landing-main">
            <div id="top-bar">
                <AccountButton />
            </div>
            <div id="upper-container">
                <div id="logo">

                </div>
                <form id="search-form">
                    <input type="text" placeholder="What would you like to learn today?"/>
                    <button id="search-butt">
                        search
                    </button>
                </form>
            </div>
            <div id="lower-container">

            </div>
        </div>
        </>
    )
}

export default LandingPage;