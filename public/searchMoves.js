function searchMoveName() {
    //used by move page to get value of name search string. sets the url so JS script can read and perform functions
    var moveName  = document.getElementById('move_name_search_string').value
    if (moveName != ''){
        window.location = '/moves/search/' + encodeURI(moveName)
    }
    //if value found is empty, return user to main page with all values (used to undo search)
    else {
        window.location = '/moves'
    }
}
