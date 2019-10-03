function injectScript(scriptSrc, callback) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = false;

  script.onload = callback;
  script.src = scriptSrc;

    document.getElementsByTagName('head')[0].appendChild(script);
}

injectScript('https://code.jquery.com/jquery-3.3.1.min.js', inputText);

function inputText(){
    var $textInputs = $('input, textarea')
    .not('[type="button"]')
    .not('[type="hidden"]')
    .not('[type="image"]')
    .not('.hasDatepicker')

    var inputText = prompt('What would you like to enter to every box on the page?', 'Different Values')

    if (!inputText){
        $textInputs.val() == null
    } else if (inputText === 'Different Values') {
        var fieldValue = 0;
//         var secondFieldValue = 100;

        $textInputs.each(function () {
            var $thisInput = $(this);

            if (!$thisInput.val()) {
                                                                fieldValue += 1;
                $thisInput.val(fieldValue + ', ' + fieldValue);         //This is a request from Heather for the sellers property disclosure.
            }
        });
    } else {
        $textInputs.val(inputText)
    }
    var inputList = []
    $('input, textarea').each(function(index){
        inputList[index] = $(this).val()
    })
}





function validateSavedValues(){
    var $textInputs = $('input, textarea')
                    .not('[type="button"]')
                    .not('[type="hidden"]')
                    .not('[type="image"]')
                    .not('.hasDatepicker')
    
    var fieldsWithErrors = [];
    
    $textInputs.each(function(){
        var $this = $(this),
            fieldValue = $this.val();
                        
        var fieldParts = fieldValue.split(',')
        
        if(fieldParts.length != 2){
            fieldsWithErrors.push($this);                                      
            return;
        }
        if(fieldParts[0] != fieldParts[1]){
            fieldsWithErrors.push($this);                                      
            return;
        }                                                                              
    });
    
    if(fieldsWithErrors.length > 0){
        // show dialog
        var errorLinks = [];
        
        $.each(fieldsWithErrors, function(index, $field){
            var linkId = 'errorNumber' + index;
            errorLinks.push(linkId);
            $(this).css('border', 'solid, 2px, red')
            
            $field.prepend('<a href="#' +linkId+ '"></a>')
                                        
        });
    } 
}
