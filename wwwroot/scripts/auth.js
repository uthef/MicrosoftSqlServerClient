window.addEventListener("load", function () {
    let form = document.querySelector("form#auth-form");
    let submitButton = document.querySelector("#submitButton");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        hideNotification();

        let preloader = document.createElement("div");
        preloader.classList.add("preloader");

        form.querySelectorAll("input").forEach(function (el) {
            el.disabled = true;
        });

        let content = submitButton.innerHTML;
        submitButton.innerHTML = "";
        submitButton.appendChild(preloader);
        submitButton.classList.add("suspended")
        submitButton.disabled = true;

        let body = "";
        let fields = form.querySelectorAll("form input[name]");

        for (let i = 0; i < fields.length; i++) {
            body += fields[i].getAttribute("name") + "=" + fields[i].value;
            if (i !== fields.length - 1) body += "&";
            fields[i].disabled = true;
        }

        let request = new XMLHttpRequest();
        request.open("post", "/Connect");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(body);

        request.addEventListener("loadend", function () {

            for (let i = 0; i < fields.length; i++) {
                fields[i].disabled = false;
            }

            submitButton.focus();
            if (request.status === 200) {
                window.location.replace("/Database");
            }
            else if (request.status === 400) {
                showNotification("Fill out the required fields", 3000);
            }
            else {
                showNotification("Connection with the SQL Server Database could not be stablished. ", 5000);
            }
            submitButton.removeChild(preloader);
            submitButton.innerHTML = content
            submitButton.classList.remove("suspended")
            submitButton.disabled = false;
        });
    });
});