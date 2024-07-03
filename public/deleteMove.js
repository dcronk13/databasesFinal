function deleteMove(id){
    //Used to set delete move route
    $.ajax({
        url: '/moves/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
