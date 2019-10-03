if (!window.jQuery) {
  function injectScript(scriptSrc) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = false;

    script.onload = appendingDatepicker;
    script.src = scriptSrc;

    document.getElementsByTagName('head')[0].appendChild(script);
  }
  injectScript('https://code.jquery.com/jquery-3.3.1.min.js');
} else {
  appendingDatepicker();
}

function appendingDatepicker() {      //appending date picker to the top of the page
  var $newDatepicker = $('<div style="color: blue; font-size: 20px; text-align: center; margin: 5px 5px 0px 5px;">Set all Dates:<input id="QADatepicker" style="color: blue;"></input></div>');

  $('body').prepend($newDatepicker);
  
  $('#QADatepicker')        //once a date has been picked this will fill in all .hasDatepicker's on the page to have the same date
      .datepicker({
          onClose: $.noop
      })
      .on('change', function(){
          fillForm();
      });
}

function fillForm() {
  //appendingDatepicker();
  var $dateInputs = {
    dates: $('input.input_box.hasDatepicker')
  }
  var $newDatepickerValue = $('input#QADatepicker').val();
  $dateInputs.dates.val($newDatepickerValue);
}