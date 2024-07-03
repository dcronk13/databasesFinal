function filterPokes() {
    //used by pokes to filter by type
    var type_id = document.getElementById('types_filter').value
    //if ID is 1, NULL type selected so filter is undone (return to /pokes)
    if (type_id == 1){
        window.location = '/pokes'
    }
    else{
        window.location = '/pokes/filter/' + parseInt(type_id)
    }
}
