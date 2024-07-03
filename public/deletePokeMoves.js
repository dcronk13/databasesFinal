function deletePokeMoves(pid,mid){
    //Used to set delete pokeMoves route
    $.ajax({
        url: '/pokeMoves/' + pid + '/' + mid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
