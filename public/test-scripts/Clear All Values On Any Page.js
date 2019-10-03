if(confirm('This will clear all checkboxes, radio buttons and text boxes. Are you sure?')){
    $(function(){
        $(':input')
        .not(':hidden')
        .not(':button')
        .not('[type="submit"]')
        .not('select')
        .val('');
        $('input:checkbox').prop('checked', false);
        $('input:radio').prop('checked', false);
    })
} else {
    console.log('User Cancelled.')
}