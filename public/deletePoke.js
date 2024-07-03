function deletePoke(id){
    //Used to set delete poke route
    $.ajax({
        url: '/pokes/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
