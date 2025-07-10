import "./ViewerParagraph.css"
interface props {
    text: string,
}

function ViewerParagraph({ text }:props) {
    return (
        <>
        <div className="viewerparagraph-main">
            <p style={{textAlign: 'justify'}}>{text}</p>
        </div>
        </>
    )
}

export default ViewerParagraph;