function filterMovesPokes() {
    //used by pokeMoves to filter based off moveID
    var move_id = document.getElementById('moves_filter').value
    //if ID is 0 (default select) undo filter and display all with /pokeMoves route
        if (move_id == 0){
            window.location = '/pokeMoves'
        }
        else {
            window.location = '/pokeMoves/filter/moves/' + parseInt(move_id)
        }
}
