function updateTypes(id){
    //Used for updating types
    //gets data from update page, serializes it so JS script can put it into database
    $.ajax({
        url: '/types/' + id,
        type: 'PUT',
        data: $('#update-types').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
