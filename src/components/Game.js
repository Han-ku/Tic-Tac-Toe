import React from 'react'
import Board from './Board'
import { useState, useEffect } from 'react'


const Game = () => {
     const [countSquares, setCountSquares] = useState(parseInt(localStorage.getItem('countSquares')) || 3);
     const [history, setHistory] = useState(() => {
         const savedHistory = JSON.parse(localStorage.getItem('history'));
         return savedHistory || [Array(countSquares * countSquares).fill(null)];
     });
     const [currentMove, setCurrentMove] = useState(parseInt(localStorage.getItem('currentMove')) || 0);
     const [moveFirst, setMoveFirst] = useState(parseInt(localStorage.getItem('moveFirst')) || 1); // 1 - X, 2 - O
     const xIsNext = (currentMove % 2 === 0 && moveFirst === 1) || (currentMove % 2 !== 0 && moveFirst === 2);
     const currentSquares = history[currentMove];
 
     const [showAllMoves, setShowAllMoves] = useState(false);

     const [playerXSign, setPlayerXSign] = useState(localStorage.getItem('playerXSign') || 'X');
     const [playerOSign, setPlayerOSign] = useState(localStorage.getItem('playerOSign') || 'O');

    const signs = [
        { label: "X", value: "X" },
        { label: "O", value: "O" },
        { label: "🐱", value: "🐱" }, 
        { label: "🐶", value: "🐶" }, 
        { label: "🌟", value: "🌟" },
        { label: "🐘", value: "🐘" },
        { label: "🚀", value: "🚀" },
        { label: "🍕", value: "🍕" },
        { label: "🦄", value: "🦄" }
    ]

    useEffect(() => {
        localStorage.setItem('countSquares', countSquares)
        localStorage.setItem('history', JSON.stringify(history))
        localStorage.setItem('currentMove', currentMove)
        localStorage.setItem('moveFirst', moveFirst)
        localStorage.setItem('playerXSign', playerXSign)
        localStorage.setItem('playerOSign', playerOSign)
    }, [countSquares, history, currentMove, moveFirst, playerXSign, playerOSign])


    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove) {
        
        setCurrentMove(nextMove)

        if(nextMove === 0) {
            setHistory([Array(countSquares * countSquares).fill(null)])
        } else {
            setHistory(history.slice(0, nextMove + 1))
        }
    }
 

    const moves = history.map((squares, move) => {
        let description
        if(move > 0) {
            description = "Go to move #" + move
        } else {
            description = "Start new game"
        }

        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })

    function handleBoardSizeChange(e) {
        const newSize = parseInt(e.target.value)
        setCountSquares(newSize)
        setHistory([Array(newSize * newSize).fill(null)])
        setCurrentMove(0)
    }

    function handleFirstMoveChange(e) {
        setMoveFirst(parseInt(e.target.value))
        setHistory([Array(countSquares*countSquares).fill(null)])
        setCurrentMove(0)
    }

    function handleRandomizerSettings() {
        const randomBoardSize = Math.floor(Math.random() * 3) + 3
        const randomFirstMove = Math.floor(Math.random() * 2) + 1

        setCountSquares(randomBoardSize)
        setMoveFirst(randomFirstMove)
        setHistory([Array(randomBoardSize * randomBoardSize).fill(null)])
        setCurrentMove(0)
    }

     function handlePlayerXSignChange(sign) {
        const allSquaresEmpty = currentSquares.every(square => square === null)
        
        if (sign !== "O" && allSquaresEmpty) {  
            setPlayerXSign(sign)
            if (playerOSign === sign) {
                setPlayerOSign("O")
            }
        }
    }

    function handlePlayerOSignChange(sign) {
        const allSquaresEmpty = currentSquares.every(square => square === null)
        
        if (sign !== "X" && allSquaresEmpty) {  
            setPlayerOSign(sign)
            if (playerXSign === sign) {
                setPlayerXSign("X")
            }
        }
    }

    const displayedMoves = showAllMoves ? moves : moves.slice(0, 7)


  return (
    <div className='wrapper'>
        <div className="settings">
            <div id='settings-1'>
                <div>
                    <label htmlFor="squareCount">Select amount of squares: </label>
                    <select id="squareCount" name="squareCount"  value={countSquares} onChange={handleBoardSizeChange}>
                        <option value="3">3x3</option>
                        <option value="4">4x4</option>
                        <option value="5">5x5</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="firstMove">Select who moves first: </label>
                    <select id="firstMove" name="firstMove"  value={moveFirst} onChange={handleFirstMoveChange}>
                        <option value="1">X</option>
                        <option value="2">O</option>
                    </select>
                </div>

                <button id='btn_random' onClick={handleRandomizerSettings}>Randomize settings</button>
            </div>
            <div id='settings-2'>
                <div>
                    <label>Player X sign: </label>
                    <div className="sign-gallery">
                        {signs.map((sign) => (
                            <button
                                key={sign.value}
                                className={`sign-button ${playerXSign === sign.value ? 'active' : ''}`}
                                onClick={() => handlePlayerXSignChange(sign.value)}
                                disabled={sign.value === playerOSign || sign.value === "O"} 
                            >
                                {sign.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Player O sign: </label>
                    <div className="sign-gallery">
                        {signs.map((sign) => (
                            <button
                                key={sign.value}
                                className={`sign-button ${playerOSign === sign.value ? 'active' : ''}`}
                                onClick={() => handlePlayerOSignChange(sign.value)}
                                disabled={sign.value === playerXSign || sign.value === "X"} 
                            >
                                {sign.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
    
        </div>  
        <div className="game">
            <div className="game-board">
                <Board 
                    xIsNext={xIsNext} 
                    squares={currentSquares} 
                    onPlay={handlePlay} 
                    size={countSquares} 
                    playerXSign={playerXSign}
                    playerOSign={playerOSign}
                />
            </div>
            <div className="game-info">
                <p className='p_history'>History: </p>
                <ol>{displayedMoves}</ol>
                {moves.length > 7 && (
                    <button id='history_more' onClick={() => setShowAllMoves(!showAllMoves)}>
                        {showAllMoves ? "Hide extra moves" : "Show all moves"}
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default Game