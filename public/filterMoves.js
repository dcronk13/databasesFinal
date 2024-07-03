function filterMovesByType() {
    //used by moves to filter based off type
    var type_id = document.getElementById('types_filter').value
    //if null type selected, undo filtering and display all table with /moves route
    if (type_id == 1){
        window.location = '/moves'
    }
    else{
        window.location = '/moves/filter/types/' + parseInt(type_id)
    }
}
