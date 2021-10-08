import React from 'react'

function UserInput({query}) {
    let from , to
    function move_input(){
        from = document.querySelector('#user-from').value
        document.querySelector('#user-from').value = ''
        to = document.querySelector('#user-to').value
        document.querySelector('#user-to').value = ''
        query(from,to)
    }

    return (
        <div className = 'user-input'>
            <input id = 'user-from'></input>
            <input id = 'user-to'></input>
            <button id = 'player-move-btn' onClick = {move_input}>Player input</button>
        </div>
    )
}

export default UserInput
