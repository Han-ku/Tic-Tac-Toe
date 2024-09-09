import React from 'react'
import Square from './Square'

const Board = ({xIsNext, squares, onPlay, size, playerXSign, playerOSign}) => {

  function handleClick(i) {
    if(squares[i] || calculateWinner(squares, size)) {
      return
    }
    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? playerXSign : playerOSign;
    onPlay(nextSquares)
  }

  function calculateWinner(squares, size) {
    const lines = []

    for(let i = 0; i < size; i++) {
      const row = []
      const col = [];
      for(let j = 0; j < size; j++) {
        row.push(i * size + j)
        col.push(j * size + i)
      }
      lines.push(row)
      lines.push(col)
    }

    const mainDiagonal = []
    const antiDiagonal = []
    for(let i = 0; i < size; i++) {
      mainDiagonal.push(i * size + i)
      antiDiagonal.push(i * size + (size - i - 1))

    }
    lines.push(mainDiagonal)
    lines.push(antiDiagonal)

    for(let i = 0; i < lines.length; i++) {
      const [a, ...rest] = lines[i]
      if(squares[a] && rest.every(index => squares[index] === squares[a])) {
        return squares[a]
      }
    }

    return null
  }

  const winner = calculateWinner(squares, size)
  let status
  if(winner) {
    status = "Winner: " + winner
  } else if (!squares.includes(null)) {
    status = "It's a draw!"
  } else {
    status = "Next player: " + (xIsNext ? playerXSign : playerOSign)
  }

  const renderSquare = (i) => (
    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
  )

  const renderBoard = () => {
      let board = [];
      for (let i = 0; i < size; i++) {
          let row = [];
          for (let j = 0; j < size; j++) {
              row.push(renderSquare(i * size + j));
          }
          board.push(<div className="board-row" key={i}>{row}</div>);
      }
      return board;
  }

  return (
    <>
      <div className="status">{status}</div>
      { renderBoard() }
    </>
  )
}

export default Board