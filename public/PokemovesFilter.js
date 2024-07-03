function filterPokesMoves() {
    //used by pokeMoves page to get type to filter by
    var poke_id = document.getElementById('pokes_filter').value
        //default value for this select is set to 0. If 0 is the value, default value selected and program should redirect to undo search
        if (poke_id == 0) {
            window.location = '/pokeMoves'
        }
        else{
            window.location = '/pokeMoves/filter/pokes/' + parseInt(poke_id)
        }
}
