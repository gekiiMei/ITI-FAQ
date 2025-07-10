import "./ViewerHeader.css"
interface props {
    text: string,
    fontSize: number
}

function ViewerHeader({ text, fontSize }:props) {
    return (
        <>
        <div className="viewerheader-main">
            <h1 style={{fontSize:fontSize}}>{text}</h1>
        </div>
        </>
    )
}

export default ViewerHeader;