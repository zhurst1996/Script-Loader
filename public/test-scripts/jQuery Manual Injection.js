function injection(scriptSrc, callback) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = false;

    script.onload = callback;
    script.src = scriptSrc;

    document.getElementsByTagName('head')[0].appendChild(script);
}

injection('/Scripts/jquery-3.3.1.js', function () {
    alert('jQuery has been injected.')
})