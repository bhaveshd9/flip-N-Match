import { useEffect, useState } from "react"
import SingleCard from "../components/SingleCard"
import './Home.css'
import { useAuthContext } from "../hooks/useAuthContext";
import Swal from 'sweetalert2'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const cardImages = [
    { "src": "/images/bulbasaur.png", matched: false },
    { "src": "/images/pikachu.png", matched: false },
    { "src": "/images/mewtwo.png", matched: false },
    { "src": "/images/butterfree.png", matched: false },
    { "src": "/images/gengar.png", matched: false },
    { "src": "/images/charmander.png", matched: false },
    { "src": "/images/pidgeotto.png", matched: false },
    { "src": "/images/snorlax.png", matched: false },
    { "src": "/images/squirtle.png", matched: false },
    { "src": "/images/Psyduck.png", matched: false }
  ]

const Home = () => {
    const {user} = useAuthContext()
    const [scores,setScores] = useState([])
    const [cards,setCards] = useState([])
    const [turn,setTurn] = useState(0)
    const [choiceOne,setChoiceOne] = useState(null)
    const [choiceTwo,setChoiceTwo] = useState(null)
    const [disbaled,setDisbaled] = useState(false)
    const [win,setWin] = useState(0)
    const [secounds,setSecounds] = useState('00')
    const [minutes,setMinutes] = useState('00')
    const [time,setTime] = useState('00:00')
    var sec = 0
    var min = 0
    const [upTimer,setUpTimer] = useState(null)

    useEffect(() => {
        if(win === 10 ){            
            setUpTimer(clearInterval(upTimer))
            setUpTimer(null)
            gameWin()
        } 
        if(choiceOne && choiceTwo){   
            setDisbaled(true)         
            if(choiceOne.src === choiceTwo.src){
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if(card.src === choiceOne.src){
                            return {...card,matched:true}
                        }
                        else return card
                    })
                })
                resetTurn()
                setWin(prevWin => prevWin + 1)
            }
            else{
                setTimeout(() => {
                    resetTurn()
                }, 500);
          
            }
        }
    },[choiceOne,choiceTwo,win,upTimer])
    
    useEffect(() => {        
        fetchAllTimeScores()
    },[])

    const shuffleCards = () => {
        const shffledCards = [...cardImages,...cardImages]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card,id:Math.random() }))
        setChoiceOne(null)
        setChoiceTwo(null)
        setCards(shffledCards)
        setTurn(0)
        setUpTimer(
            setInterval(() => {
                if(sec === 59){
                    sec = 0
                    min++
                }
                sec++;
                if(sec < 10) setSecounds('0'+sec)
                else setSecounds(sec)
                if(min<10) setMinutes('0'+min)
                else setMinutes(min)
                setTime() 
            }, 1000)
        )  
    }

    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }

    const resetTurn = () => {
        setChoiceOne(null)
        setChoiceTwo(null)
        setTurn(prevTurn => prevTurn + 1)
        setDisbaled(false)
    }

    const gameWin = () => {   
        setTime(document.getElementById('time').innerHTML)
        if(turn && time){            
            sec = 0
            min = 0
            setWin(null)
            Swal.fire({
                title: 'You Win !',
                text: 'Turns : '+turn + '\n' + 'Time : '+time,
                icon: 'success',
                confirmButtonText: 'Continue'
            })
            addScore(parseInt(turn),time+"")
        }        
    }

    const fetchAllTimeScores = async () => {
        const response = await fetch('/api/score',{
            headers : {
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        
        if(response.ok) {
            setScores(json);
        }   
    }

    const addScore = async (turn,time) => {
        const response = await fetch('/api/score',{
            method : 'POST',
            headers :{
                'Content-Type' : 'application/json', 
                'Authorization' : `Bearer ${user.token}`
            },
            body : JSON.stringify({turn,time})
        })
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error);
        }
        if(response.ok) {
            console.log(json.action)
            if(json.action === "create" || json.action === "update") fetchAllTimeScores();
        } 

    }

    return (
        <>
            <div className="all-content">
                <div className="game-row">
                    <h4>A card memory game</h4>
                    <button onClick={shuffleCards}>New game</button>
                    <div className="turn-time">
                        <span className="turn">Turns : {turn}</span>
                        <span className="time">Time : <span id="time">{minutes}:{secounds}</span></span>    
                    </div>                    
                    <div className="card-grid">
                        {cards.map(card => (
                            <SingleCard
                            key={card.id}
                            card={card}
                            handleChoice={handleChoice}
                            filpped={card === choiceOne || card === choiceTwo || card.matched}
                            disbaled={disbaled}
                            />
                        ))}
                    </div>
                </div>
                <div className="score-row">
                    <h3>All time Scroes</h3>
                    <button onClick={fetchAllTimeScores}>Refresh</button>
                    <div className="turn-time">
                        <br />
                        <br />
                    </div>
                    <div className="">
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Time</th>
                                    <th>Turns</th>
                                    <th></th>
                                </tr>    
                            </thead>
                            <tbody>
                                {scores && scores.map((score) => (
                                    <tr key={score._id}>
                                        <td>{score.user.username}</td>
                                        <td>{score.time}</td>
                                        <td>{score.turn}</td>
                                        <td>{formatDistanceToNow(new Date(score.updatedAt),{addSuffix:true})}</td>
                                    </tr> 
                                    )
                                )} 
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>            
        </>
      
    )
}

export default Home;