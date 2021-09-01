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
pos = 'c4'
ATTACK = [
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
    column = pos[0].charCodeAt(0) - 'a'.charCodeAt(0) + ATTACK[i][0]
    rank = parseInt(pos[1]) + parseInt(ATTACK[i][1])
    if( 0 <= column && column <= 7 && 1 <= rank && rank <= 8 ){
        temp_pos = '' + String.fromCharCode(column + 'a'.charCodeAt(0)) + rank
        //console.log(column,rank)
        console.log(temp_pos)
        number = column + (8 - rank) * 8
        console.log(number)
        console.log(number_to_coordinate(number))
    }
}
//console.log(coordinate_to_number('f3'))
//console.log(number_to_coordinate(45))