$(function() {
    $('<div>').appendTo('body').text(window.location).dialog({
        width: 1000,
        title: 'You are on this page.',
        buttons: {
            "Close": function() {
                $(this).dialog().remove();
            }
        }
    });
});