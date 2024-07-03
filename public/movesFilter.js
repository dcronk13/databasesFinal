function filterMovesByMoveType() {
    //used by moves to filter by move type
    var moveType = document.getElementById('MoveType_filter').value
    //if physical selected, filter physical  
    if (moveType == "physical") {    
        window.location = '/moves/filter/physical'
    }
    //if special selected, filter special 
    else if (moveType == "special"){
        window.location = '/moves/filter/special'
    }
    //if status selected, filter status
    else if (moveType == "status") {
        window.location = '/moves/filter/status'
    }
    //if default selected, undo filter and show all data by redirecting to /moves
    else {
        window.location = '/moves'
    }
}
