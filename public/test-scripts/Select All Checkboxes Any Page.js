if(!window.jQuery){
function injectScript(scriptSrc) {
	var script = document.createElement('script');

	script.type = 'text/javascript';
	script.async = false;

  script.onload = fillform;
  script.src = scriptSrc;

	document.getElementsByTagName('head')[0].appendChild(script);
}
injectScript('https://code.jquery.com/jquery-3.3.1.min.js');
} else {
  checkCheckboxes()
}

function checkCheckboxes(){
 $('input:checkbox').prop('checked', true)
}