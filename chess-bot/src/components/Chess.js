import React, { useState, useEffect } from 'react'
import Chessboard from './Chessboard'
import UserInput from './UserInput'

let flag = true

let PIECE_WEIGHT = {
    p: -10,
    n: -30,
    b: -30,
    r: -50,
    q: -90,
    k: -900,
    P: 10,
    N: 30,
    B: 30,
    R: 50,
    Q: 90,
    K: 900 
}

function coordinate_to_number(square){
    let column = square[0].charCodeAt(0) - 'a'.charCodeAt(0)
    let rank = parseInt(square[1])
    return column + 8 * (8 - rank)
}

function number_to_coordinate(number){
    let rank = ''
    rank += (8 - (number - number % 8) / 8)
    let column = ''
    column += String.fromCharCode(number % 8 + 'a'.charCodeAt(0))
    return column + rank
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

function generate_fen(board){
    let i = 0,num = 0
    var fen = ''
    while(i < 64){
        if(!board[i]){
            num++
            i++
        }
        else{
            fen += (num === 0) ? '' : num
            num = 0
            fen += ( board[i].color === 'w' ? board[i].piece.toUpperCase() : board[i].piece )
            i++
        }
        if(!(i === 0) && (i % 8 === 0)){
            fen += (num === 0) ? '' : num
            num = 0
            if(i !== 64)
                fen += '/'
        }
    }
    return fen
}

function print_board(board){
    const rows = []
    let i = 0, piece
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

function board_value(fen){
    let value = 0
    for(let i = 0 ; i < fen.length ; i++){
        if((/[a-zA-Z]/).test(fen[i])){
            value += PIECE_WEIGHT[fen[i]]
        }
    }
    return value
}

function move_direction(fen,pos,direction){
    const possible_moves_givenDirection = []
    const board = generate_board(fen)
    let pos_num = coordinate_to_number(pos)
    let column = pos[0].charCodeAt(0) - 'a'.charCodeAt(0)
    let row = 8 - parseInt(pos[1])
    let vertical , horizontal, temp1
    if(direction === 7 || direction === 0 || direction === 1 )
        vertical = -1
    else if(direction === 6 || direction === 2)
        vertical = 0
    else
        vertical = 1
    if(direction === 5 || direction === 6 || direction === 7 )
        horizontal = -1
    else if(direction === 0 || direction === 4)
        horizontal = 0
    else
        horizontal = 1
    let increement = 1
    column += increement * horizontal
    row += increement * vertical
    while( 0 <= column && column <= 7 && 0 <= row && row <= 7 ){
        if(!board[column + row * 8]){
            board[column + row * 8] = board[pos_num]
            board[pos_num] = null
            possible_moves_givenDirection.push(generate_fen(board))
            board[pos_num] = board[column + row * 8]
            board[column + row * 8] = null
        }
        else if(board[column + row * 8].color !== board[pos_num].color){
            temp1 = board[column + row * 8]
            board[column + row * 8] = board[pos_num]
            board[pos_num] = null
            possible_moves_givenDirection.push(generate_fen(board))
            board[pos_num] = board[column + row * 8]
            board[column + row * 8] = temp1
            break
        }
        else
            break
        column += increement * horizontal
        row += increement * vertical
    }
    return possible_moves_givenDirection
}

function pawn_last_position(board, pos_num,color){
    const change_piece = ['q' , 'r' , 'b' , 'n']
    let pawn_change = []
    for(let i = 0 ; i < 4 ; i++){
        board[pos_num] = {
            piece : change_piece[i],
            color : color
        }
        pawn_change.push(generate_fen(board))
    }
    return pawn_change
}

function generate_possible_moves(fen,pos){
    const board = generate_board(fen)
    let pos_num = coordinate_to_number(pos)
    let piece = board[pos_num].piece
    let color =  board[pos_num].color
    let straight_move, rank, column, number, temp1, temp_pos
    const possible_moves = []
    if(piece === 'p'){
        straight_move = color === 'w' ? -8 : 8
        if(!board[pos_num + straight_move]){
            rank = parseInt(pos[1]) - (straight_move / 8)
            if(rank === 8 && color === 'w' || rank === 1 && color === 'b' ){
                board[pos_num] = null
                possible_moves.push(...pawn_last_position(board,pos_num + straight_move,color))
            }
            else{
                board[pos_num + straight_move] = board[pos_num]
                board[pos_num] = null
                possible_moves.push(generate_fen(board))
            }
            board[pos_num] = {
                piece : piece,
                color : color
            }
            board[pos_num + straight_move] = null
            rank = parseInt(pos[1])
            if( ( (rank === 2 && color ==='w') || (rank === 7 && color ==='b')) && !board[pos_num + 2 * straight_move]){
                board[pos_num + 2 * straight_move] = board[pos_num]
                board[pos_num] = null
                possible_moves.push(generate_fen(board))
                board[pos_num] = board[pos_num + 2 * straight_move]
                board[pos_num + 2 * straight_move] = null
            }
        }
        column = pos[0].charCodeAt(0) - 'a'.charCodeAt(0)
        rank = parseInt(pos[1])
        if(column > 0 && board[pos_num + straight_move - 1] && board[pos_num + straight_move - 1].color !== color){
            temp1 = board[pos_num + straight_move - 1]
            board[pos_num + straight_move - 1] = board[pos_num]
            board[pos_num] = null
            let next_pos_rank = rank - (straight_move / 8)
            if(next_pos_rank === 8 && color === 'w' || next_pos_rank === 1 && color === 'b' ){
                possible_moves.push(...pawn_last_position(board,pos_num + straight_move - 1,color))
            }
            else
                possible_moves.push(generate_fen(board))
            board[pos_num] = board[pos_num + straight_move - 1]
            board[pos_num + straight_move - 1] = temp1
        }
        if(column < 7 && board[pos_num + straight_move + 1] && board[pos_num + straight_move + 1].color !== color){
            temp1 = board[pos_num + straight_move + 1]
            board[pos_num + straight_move + 1] = board[pos_num]
            board[pos_num] = null
            let next_pos_rank = rank - (straight_move / 8)
            if(next_pos_rank === 8 && color === 'w' || next_pos_rank === 1 && color === 'b' ){
                possible_moves.push(...pawn_last_position(board,pos_num + straight_move + 1,color))
            }
            else
                possible_moves.push(generate_fen(board))
            board[pos_num] = board[pos_num + straight_move + 1]
            board[pos_num + straight_move + 1] = temp1
        }
    }
    if(piece === 'n'){
        var KNIGHT_MOVES = [
            [1,2],
            [-1,2],
            [1,-2],
            [-1,-2],
            [2,1],
            [-2,1],
            [2,-1],
            [-2,-1]
        ]
        for(let i = 0 ; i < 8 ; i++){
            column = pos[0].charCodeAt(0) - 'a'.charCodeAt(0) + KNIGHT_MOVES[i][0]
            rank = parseInt(pos[1]) + parseInt(KNIGHT_MOVES[i][1])
            if( 0 <= column && column <= 7 && 1 <= rank && rank <= 8 ){
                temp_pos = '' + String.fromCharCode(column + 'a'.charCodeAt(0)) + rank
                number = column + (8 - rank) * 8
                if(!board[number] || board[pos_num].color !== board[number].color){
                    temp1 = board[number]
                    board[number] = board[pos_num]
                    board[pos_num] = null 
                    possible_moves.push(generate_fen(board))
                    board[pos_num] = board[number]
                    board[number] = temp1
                }
            }
            
        }
    }
    if(piece === 'b'){
        for(let i = 1 ; i < 8 ; i += 2)
            possible_moves.push(...move_direction(fen,pos,i))
    }
    if(piece ==='r'){
        for(let i = 0 ; i < 8 ; i += 2)
            possible_moves.push(...move_direction(fen,pos,i))
    }
    if(piece ==='q'){
        for(let i = 0 ; i < 8 ; i++)
            possible_moves.push(...move_direction(fen,pos,i))
    }
    if(piece === 'k'){
        const KING_MOVES = [
            [-1,-1],
            [-1,0],
            [-1,1],
            [0,-1],
            [0,1],
            [1,-1],
            [1,0],
            [1,1]
        ]
        let king_column = pos_num % 8
        let king_row = (pos_num - pos_num % 8) / 8
        let new_column , new_row
        for(let i = 0 ; i < 8 ; i++){
            new_column = king_column + KING_MOVES[i][0]
            new_row = king_row + KING_MOVES[i][1]
            if(0 <= new_row && new_row <= 7  &&  0 <= new_column && new_column <= 7 ){
                if(!board[new_column + new_row * 8] || board[new_column + new_row * 8].color !== color ){
                    temp1 = board[new_column + new_row * 8]
                    board[new_column + new_row * 8] = board[pos_num]
                    board[pos_num] = null
                    possible_moves.push(generate_fen(board))
                    board[pos_num] = board[new_column + new_row * 8]
                    board[new_column + new_row * 8] = temp1
                }
            }
        }
    }
    return possible_moves 
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--){

      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;

    }

}

function generate_moves_each_step(fen,n,color){
    let pos, board
    let moves_each_step = []
    let moves_all_step = [[fen]], temp_moves

    for(let i = 0 ; i < n ; i++){

        temp_moves = moves_all_step
        moves_all_step = []

        for(let j = 0 ; j < temp_moves.length ; j++){

            moves_each_step = []

            for(let l = 0 ; l < 63 ; l++){

                pos = number_to_coordinate(l)
                board = generate_board(temp_moves[j][i])

                if(board[l] && ((i % 2 === 0 && board[l].color === color) || (i % 2 === 1 && board[l].color !== color))){
                    moves_each_step.push(...generate_possible_moves(temp_moves[j][i],pos))
                }

            }

            shuffleArray(moves_each_step);

            for(let move_step = 0 ; move_step < moves_each_step.length ; move_step++){
                moves_all_step.push([...temp_moves[j],moves_each_step[move_step]])
            }

        }

    }

    return moves_all_step
}

function move_piece(fen,from,to,color){
    let board = generate_board(fen)

    if(!board[coordinate_to_number(from)] || board[coordinate_to_number(from)].color !== color)
        return null

    board[coordinate_to_number(to)] = board[coordinate_to_number(from)]
    board[coordinate_to_number(from)] = null
    let temp_fen = generate_fen(board)
    let valid_states = generate_possible_moves(fen,from)

    for(let i = 0 ; i < valid_states.length ; i++){

        if(temp_fen === valid_states[i])
            return temp_fen
    }

    return null
}

function next_move(possible_moves,start,end,level,cur_level,color){

    if(start === end){
        return [[],board_value(possible_moves[start][level])]
    }
    let temp_start = start
    let new_start,new_end
    let value = -10000, temp_value, _

    for(let i = start ; i < end ; i++){

        if(i === end - 1 || possible_moves[i][cur_level] !== possible_moves[temp_start][cur_level]){
            [_ , temp_value] = next_move(possible_moves,temp_start,i - 1,level,cur_level + 1, color === 'w' ? 'b' : 'w')

            if(value === -10000){
                new_start = temp_start
                new_end = i - 1
                value = temp_value
                temp_start = i
                continue
            }

            if(color === 'w'){

                if(temp_value > value){
                    new_start = temp_start
                    new_end = i - 1
                    value = temp_value
                }

            }
            else {

                if(temp_value < value){
                    new_start = temp_start
                    new_end = i - 1
                    value = temp_value
                }

            }

            temp_start = i

        }

    }

    if(cur_level === 1){
        return [possible_moves.slice(new_start,new_end + 1),value]
    }

    return [[],value]
}

function check(fen, color){
    let possible_moves = generate_moves_each_step(fen,1,color === 'w' ? 'b' : 'w')
    let temp, flag

    for(let i = 0 ; i < possible_moves.length ; i++){
        temp = generate_board(possible_moves[i][1])
        flag = false

        for(let j = 0 ; j < 63 ; j++){
            if(temp[j] && temp[j].color === color && temp[j].piece === 'k'){
                flag = true
                break
            } 
        }

        if(flag === false)
            return true
    }

    return false
}

let player_color = ['w','b'];
let difficulty_level
let bot, player
let turn

function Chess() {
    const [game_fen, setGame_fen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const [game_board, setGame_board] = useState();

    function initialize_game(){

        setGame_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')
        setGame_board(generate_board(game_fen))
        turn = 0
        bot = 1
        player = 0
        difficulty_level = 2

    }

    function bot_move(){

        if(turn === player)
            return

        let possible_moves
        let temp, check_temp

        //-----------------------------------------
        let count = 0
        //-----------------------------------------

        check_temp = generate_moves_each_step(game_fen , 1 , player_color[bot])
        
        do{
            possible_moves = generate_moves_each_step(game_fen , difficulty_level , player_color[bot])
            temp = next_move(possible_moves , 0 , possible_moves.length - 1 , difficulty_level , 1 , player_color[bot])
            count++

            if(count > check_temp.length)
                return

        }while(check(temp[0][0][1] , player_color[bot]))

        setGame_fen(temp[0][0][1])
        setGame_board(generate_board(game_fen))
        //turn = player
    }
    
    function player_move(from , to, player){

        if(turn === bot)
            return

        let temp = move_piece(game_fen , from , to , player_color[player])

        if(check(temp, player_color[player])){
            return
        }

        if(temp){
            setGame_fen(temp)
            setGame_board(generate_board(game_fen))
            turn = bot
        }

    }

    if(flag){
        initialize_game()
        flag = false
    }

    function print_move(from,to){
        if(from && to){
            player_move(from, to, 0)
        }    
    }

    return (
        <div className = 'game-display'>
            <UserInput query = {print_move}></UserInput>
            <Chessboard fen = {game_fen} ></Chessboard>
            <div className = 'bot-move'>
                <button id = 'bot-move-btn' onClick = {bot_move}>Bot move</button>
            </div>
        </div>
    )
}

export default Chess
