function initializeTreeView(treeView, itemClickFunction) {
    let liElements = treeView.querySelectorAll("li");

    for (let i = 0; i < liElements.length; i++) {
        let next = liElements[i].nextElementSibling;
        liElements[i].addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                this.click();
            }
        });
        let subLis;
        if (next) subLis = next.childNodes;
        if (liElements[i].classList.contains("foldable")) {
            liElements[i].addEventListener("click", function () {
                if (!liElements[i].classList.contains("open")) {
                    liElements[i].classList.add("open");
                    liElements[i].setAttribute("tabindex", 0);
                    if (next) {
                        for (let j = 0; j < subLis.length; j++) {
                            if (subLis[j].nodeName.toLowerCase() === "li") {
                                subLis[j].setAttribute("tabindex", 0);
                            }
                        }
                    }
                    next.classList.add("open");
                }
                else {
                    liElements[i].classList.remove("open");
                    if (next) {
                        for (let j = 0; j < subLis.length; j++) {
                            subLis[j].removeAttribute("tabindex");
                        }
                    }
                    next.classList.remove("open");
                    next.removeAttribute("style");
                }
            });
        }
        else if (liElements[i].classList.contains("item")) {
            liElements[i].addEventListener("click", function () {
                let selected = document.querySelector("li.item.selected");
                if (selected) selected.classList.remove("selected");
                this.classList.add("selected");
                if (itemClickFunction) itemClickFunction(this);
            });
        }
    }
}