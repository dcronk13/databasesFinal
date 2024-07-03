function updatePokes(id){
    //Used for updating pokes
    //gets data from update page, serializes it so JS script can put it into database
    $.ajax({
        url: '/pokes/' + id,
        type: 'PUT',
        data: $('#update-pokes').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
