function updateEvos(id){
    //Used for updating evolutions
    //gets data from update page, serializes it so JS script can put it into database
    $.ajax({
        url: '/evolutions/' + id,
        type: 'PUT',
        data: $('#update-evos').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
