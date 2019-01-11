$(document).ready(function(){
    $('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
    // alert(1);
    var confirmation = confirm('Are you sure?');

    if (confirmation){
        // alert(1);
        $.ajax({
            //type: 'DELETE',
            type: 'delete',
            url: '/users/delete/' + $(this).data('id')
        }).done(function(response){
            window.location.replace('/'); //this wasn't running...
        });
        window.location.replace('/');
    } else {
        return false;
    }
}