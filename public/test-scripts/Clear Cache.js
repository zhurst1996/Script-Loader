function removeLocalStorage(item) {
    localStorage.removeItem(item);
}

function removeCookies(item) {
    var equalPosition = item.indexOf('=');
    var cookieName = equalPosition > -1 ? item.substr(0, equalPosition) : item;
    console.log(cookieName);

    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

var cookies = document.cookie.split(';');
var localItems = Object.keys(localStorage);

localItems.forEach(removeLocalStorage);
cookies.forEach(removeCookies);