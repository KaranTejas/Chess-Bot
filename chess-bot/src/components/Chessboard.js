import React from 'react'
import './Chess.css';
import black_pawn from './Pieces/black_pawn.png';
import black_knight from './Pieces/black_knight.png';
import black_bishop from './Pieces/black_bishop.png';
import black_rook from './Pieces/black_rook.png';
import black_queen from './Pieces/black_queen.png';
import black_king from './Pieces/black_king.png';
import white_pawn from './Pieces/white_pawn.png';
import white_knight from './Pieces/white_knight.png';
import white_bishop from './Pieces/white_bishop.png';
import white_rook from './Pieces/white_rook.png';
import white_queen from './Pieces/white_queen.png';
import white_king from './Pieces/white_king.png';

let piece_symbol = {
    p: black_pawn,
    n: black_knight,
    b: black_bishop,
    r: black_rook,
    q: black_queen,
    k: black_king,
    P: white_pawn,
    N: white_knight,
    B: white_bishop,
    R: white_rook,
    Q: white_queen,
    K: white_king
}

function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function generate_board(fen){
    const board = new Array(64)
    let list = fen.split(/\s+/)
    let j = 0;
    let i = 0;
    let state = list[0]
    while(i < 64){
        if(state[j] === '/'){
            j++
            continue
        }
        else if( isCharNumber(state[j]) ){
            i += parseInt(state[j],10)
            j++
        }
        else{
            board[i] = {
                piece : state[j].toLowerCase(),
                color : state[j] < 'a' ? 'w' : 'b'
            }
            i++
            j++
        }
    }
    return board;
}
function print_board(board){
    const rows = []
    let i = 0,piece
    let column = ''
    while(i < 64){
        if(!board[i])
            piece = '-'
        else
            piece = ( board[i].color === 'w' ? board[i].piece.toUpperCase() : board[i].piece )
        
        column = column + ' ' + piece
        i++
        if(i % 8 === 0){
            rows.push(column);
            column = ''
        }
    }
    return rows
}

let board_layout = [[],[],[],[],[],[],[],[]]
for(let i = 0 ; i < 8 ; i++){
    for(let j = 0 ; j < 8 ; j++){
        if((i + j)% 2 === 0){
            board_layout[i].push(<div class="white"></div>)
        }
        else{
            board_layout[i].push(<div class="black"></div>)
        }
    }
}


function Chessboard({fen}) {
    let board = print_board(generate_board(fen))
    for(let i = 0 ; i < 8 ; i++){
        for(let j = 0 ; j < 8 ; j++){
            if((/[a-zA-Z]/).test(board[i][2*j + 1])){
                if((i + j)% 2 === 0){
                    board_layout[i][j] = <div class="white"><img src = {piece_symbol[board[i][2*j + 1]]} /></div>
                }
                else{
                    board_layout[i][j] = <div class="black"><img src = {piece_symbol[board[i][2*j + 1]]} /></div>
                }
            }
            else{
                if((i + j)% 2 === 0){
                    board_layout[i][j] = <div class="white"></div>
                }
                else{
                    board_layout[i][j] = <div class="black"></div>
                }
            }
        }
    }
    console.log(board_layout)
    let temp = []
    for(let i = 0 ; i < 8 ; i++){
        for(let j = 0 ; j < 8 ; j++){
            temp.push(board_layout[i][j])
        }
    }
    console.log(temp)
    temp = React.createElement(
        "div",
        [],
        [...temp]
    );
    console.log(temp)
    return (
        <div className = 'chessboard'>
            {temp}
        </div>
    )
}

export default Chessboard
