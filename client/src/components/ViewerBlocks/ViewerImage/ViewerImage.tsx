import "./ViewerImage.css"
interface props {
    path:string
}

function ViewerImage({ path }:props) {
    return (
        <>
        <div className="viewerimage-main">
            <img src={path} alt="" style={{height:'25rem', width:'auto'}} />
        </div>
        </>
    )
}

export default ViewerImage;