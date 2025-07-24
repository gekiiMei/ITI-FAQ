import "./ViewerList.css"
interface props {
    label: string,
    listType: string,
    entries: string[]
}

function ViewerList({ label, listType, entries }:props) {
    return (
        <>
        <div className="viewerlist-main">
            <p>{label}</p>
            {listType=="bullet"?
            <ul>
                {
                    entries.map((entry, i) => {
                        return(
                            <li key={i}>{entry}</li>
                        )
                    })
                }
            </ul>
            :
            <ol>
                {
                    entries.map((entry, i) => {
                        return(
                            <li key={i}>{entry}</li>
                        )
                    })
                }
            </ol>
            }
        </div>
        </>
    )
}

export default ViewerList;