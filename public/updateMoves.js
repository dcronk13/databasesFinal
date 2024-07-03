function updateMoves(id){
    //Used for updating moves
    //gets data from update page, serializes it so JS script can put it into database
    $.ajax({
        url: '/moves/' + id,
        type: 'PUT',
        data: $('#update-moves').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
