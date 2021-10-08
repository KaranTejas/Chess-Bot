import React, { useState, useEffect } from 'react'
import Chessboard from './Chessboard'
import UserInput from './UserInput';


function Chess() {
    const [game_fen, setGame_fen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    function changestate(){
        if(game_fen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')
            setGame_fen('k7/5p2/3n4/3PP3/N1N2PPK/p5r1/2pQ2q1/7b')
        else
            setGame_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')
    }
    function print_move(from,to){
        console.log(from,to)
    }

    return (
        <div>
            <Chessboard fen = {game_fen} ></Chessboard>
            <UserInput query = {print_move}></UserInput>
            <button className = 'bot-move' onClick = {changestate}> Move </button>
        </div>
    )
}

export default Chess
