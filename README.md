# Script-Loader
Automatically inject javascript into a web page with this application.
https://www.mediafire.com/file/2dxki9cc9ecjubz/Script_Injector-win32-x64.zip/file

# Quick Start
1. Paste this url into a bookmarklet javascript:var scriptUrl='http://localhost:8080/loader.js';(function injectScript(scriptSrc, callback) {var script = document.createElement('script');script.type = 'text/javascript';script.async = false;script.src = scriptSrc;document.getElementsByTagName('head')[0].appendChild(script);}(scriptUrl));

2. Run the executable to start your node server, leave the application running.

3. Add scripts to /test-scripts

4. To just see the loader, https://www.google.com will allow the script injector to show.


# Warning
Please be aware that do to cross site scripting policies, this may not work on your webpage. Please check your javascript console to be sure that your scripts are not being blocked.

Please also note that depending on the speed of your computer it may take time for the node server to come online.
