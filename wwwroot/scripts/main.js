let _currentTimeout;

function showNotification(text, timeout) {
    let notification = document.querySelector("div.notification");

    if (notification) {
        notification.querySelector("span").textContent = text;
        notification.classList.add("activated");
        _currentTimeout = setTimeout(function () {
            notification.classList.remove("activated");
        }, timeout);
    }
}

function hideNotification() {
    let notification = document.querySelector("div.notification");

    if (notification) {
        clearTimeout(_currentTimeout);
        notification.classList.remove("activated");
    }
}