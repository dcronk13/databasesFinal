function searchPokeName() {
    //used by pokes page to get value of name search string. sets the url so JS script can read and perform functions
    var poke_name_search_string  = document.getElementById('poke_name_search_string').value
    if (poke_name_search_string != ''){
        window.location = '/pokes/search/' + encodeURI(poke_name_search_string)
    }
    //if value found is empty, return user to main page with all values (used to undo search)
    else {
        window.location = '/pokes'
    }
}
