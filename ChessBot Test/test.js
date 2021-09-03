var ATTACK_PIECE = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900 
}

function move_direction(fen,pos,direction){
    const possible_moves_givenDirection = []
    const board = generate_board(fen)
    let pos_num = coordinate_to_number(pos)
    let column = pos[0].charCodeAt(0) - 'a'.charCodeAt(0)
    let row = 8 - parseInt(pos[1])
    let vertical , horizontal
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
    console.log(horizontal,vertical,direction)
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
    pawn_change = []
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
    var pos_num = coordinate_to_number(pos)
    var piece = board[pos_num].piece
    var color =  board[pos_num].color
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
    i = 0,num = 0
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
    i = 0
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

function move_piece(fen,from,to,piece,color){
    board = generate_board(fen)
    board[coordinate_to_number(to)] = board[coordinate_to_number(from)]
    board[coordinate_to_number(from)] = null
    fen = generate_fen(board)
    //if(check(fen,from,to,piece,color))
        //return null;
    return fen;
}

fen = '5r2/PK3R2/P1Q1q3/8/5P2/BP5k/3P1bR1/1n3N2'
board = generate_board(fen)
console.log(print_board(board))

ans = generate_possible_moves(fen,'h3')
console.log(ans)

console.log(ans.length)
for (let i = 0 ; i < ans.length ; i++){
    console.log(print_board(generate_board(ans[i])))
}
