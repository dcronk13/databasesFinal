function deleteType(id){
    //Used to set delete type route
    $.ajax({
        url: '/types/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
