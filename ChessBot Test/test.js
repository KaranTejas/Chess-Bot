var ATTACK_PIECE = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900 
}

function move_direction(fen,pos,direction){

    return []
}

function generate_possible_moves(fen,pos){
    possible_moves = []
    if(piece == 'p'){
        
    }
    if(piece == 'n'){
        KNIGHT_MOVES = [
            [1,2],
            [-1,2],
            [1,-2],
            [-1,-2],
            [2,1],
            [-2,1],
            [2,-1],
            [-2,-1]
        ]
        for(i = 0 ; i < 8 ; i++){
            board = generate_board(fen)
            column = pos[0].charCodeAt(0) - 'a'.charCodeAt(0) + KNIGHT_MOVES[i][0]
            rank = parseInt(pos[1]) + parseInt(KNIGHT_MOVES[i][1])
            if( 0 <= column && column <= 7 && 1 <= rank && rank <= 8 ){
                temp_pos = '' + String.fromCharCode(column + 'a'.charCodeAt(0)) + rank
                //console.log(column,rank)
                //console.log(temp_pos)
                number = column + (8 - rank) * 8
                pos_num = coordinate_to_number(pos)
                if(board[number] === null || board[pos_num].color !== board[number].color){
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
    if(piece == 'b'){
        for(i = 1 ; i < 8 ; i += 2)
            possible_moves += move_direction(fen,pos,i)
    }
    if(piece == 'r'){
        for(i = 0 ; i < 8 ; i += 2)
            possible_moves += move_direction(fen,pos,i)
    }
    if(piece == 'q'){
        for(i = 0 ; i < 8 ; i++)
            possible_moves += move_direction(fen,pos,i)
    }
    if(piece == 'k'){
        
    }
    return possible_moves 
}

function coordinate_to_number(square){
    column = square[0].charCodeAt(0) - 'a'.charCodeAt(0)
    rank = parseInt(square[1])
    return column + 8 * (8 - rank)
}

function number_to_coordinate(number){
    rank = ''
    rank += (8 - (number - number % 8) / 8)
    column = ''
    column += String.fromCharCode(number % 8 + 'a'.charCodeAt(0))
    return column + rank
}

function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function generate_board(fen){
    const board = new Array(64)
    let list = fen.split(/\s+/)
    j = i = 0
    state = list[0]
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
    fen = ''
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

fen = '4q3/K2k4/4p3/P2Pr1p1/pp2r3/5p2/3n2P1/1N2Q3'
board = generate_board(fen)
console.log(print_board(board))
move_piece(fen,'e1','h1','Q','w')
console.log(print_board(board))
move_piece(fen,'b1','a3','Q','w')
console.log(print_board(board))