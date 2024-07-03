function searchConditions() {
    //used by evos page to get value of condition search string. sets the url so JS script can read and perform functions
    var condition_search_string  = document.getElementById('condition_search_string').value
    if (condition_search_string != ''){
        window.location = '/evolutions/search/condition/' + encodeURI(condition_search_string)
    }
    //if value found is empty, return user to main page with all values (used to undo search)
    else {
        window.location = '/evolutions'
    }
}
