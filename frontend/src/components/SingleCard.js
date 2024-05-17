import './singleCard.css'

export default function SingleCard({card,handleChoice,filpped,disbaled}){

    const handleClick = () => {
        if(!disbaled) handleChoice(card)
    } 
    return (
        <div  className="card">
            <div className={filpped ? "flipped" : ""}>
                <img className="front" src={card.src} alt="carte front" />
                <img className="back"
                    src="/images/pokeball.png"
                    alt="carte back"
                    onClick={handleClick}
                 />
            </div>
        </div>
    )
}