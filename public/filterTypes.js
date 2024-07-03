function filterTypes() {
    //used by types to filter based off type name
    var type_id = document.getElementById('types_filter').value
    //if ID is 1, NULL type selected so filter is undone (return to /types)
    if (type_id == 1){
        window.location = '/types'
    }
    else{
        window.location = '/types/filter/' + parseInt(type_id)
    }
}
