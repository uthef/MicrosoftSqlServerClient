window.addEventListener("load", function () {
    let tableList = [];
    let suspended = false;

    let request = new XMLHttpRequest();
    request.open("post", "Database/GetTableList");
    request.send();

    document.querySelector("#export-button").addEventListener("click", function (e) {
        e.preventDefault();
        if (document.querySelector("li.item.selected")) {
            exportCsv();
        }
        else {
            alert("No table selected");
        }
    });

    request.addEventListener("loadend", function () {
        if (request.responseText) {
            tableList = JSON.parse(request.responseText);
        }
        else {
            alert("Tablie list could not be loaded");
        }

        let baseUl = document.querySelector("#sidebar .treeView");
        let ul = baseUl.querySelector("ul.sub");
        let schemas = [];

        for (let i = 0; i < tableList.length; i++) {
            let schema = tableList[i]["table_schema"];

            if (!schemas.includes(schema)) {
                let li = document.createElement("li");
                let subUl = document.createElement("ul");
                subUl.classList.add("sub");
                subUl.classList.add(schema);

                li.classList.add("foldable");
                li.textContent = schema;
                schemas.push(schema);
                ul.appendChild(li);
                ul.appendChild(subUl);
            }

            let subLi = document.createElement("li");
            subLi.textContent = tableList[i]["table_name"];
            subLi.classList.add("item");
            ul.querySelector("." + schema).appendChild(subLi);
        }

        initializeTreeView(baseUl, GetTable);

        document.querySelector("#sidebar .preloader-container").style.display = "none";
        baseUl.style.display = "block";

    });
    const eGridDiv = document.querySelector('#dataGrid');
    const gridOptions = {
        pagination: true,
        animateRows: true,
        suppressDragLeaveHidesColumns: true,
        defaultColDef: {
            flex: 1,
            minWidth: 100,
            resizable: true
        },
        overlayLoadingTemplate: "<div class=\"sidebar-preloader preloader\"></div>",
        overlayNoRowsTemplate: "<span>No Table Selected</span>"
    };


    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.showNoRowsOverlay();

    function exportCsv() {
        let selected = document.querySelector("li.item.selected");
        let selectedParent = selected.parentNode;
        gridOptions.api.exportDataAsCsv();
    }

    function GetTable(item) {
        if (!suspended) {
            gridOptions.api.showLoadingOverlay();
            suspended = true;
            let request = new XMLHttpRequest();
            request.open("post", "/Database/GetTable");
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send("table=" + item.textContent + "&schema=" + item.parentNode.classList[1]);

            request.addEventListener("loadend", function () {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    gridOptions.api.setColumnDefs(response.columnDefs);
                    gridOptions.api.setRowData(response.rowData);
                    document.querySelector("#dataGrid").style.removeProperty("display");
                }
                else {
                    alert("Table could not be loaded");
                    gridOptions.api.setColumnDefs([]);
                    gridOptions.api.setRowData([]);
                }
                suspended = false;
            });
        }
    }

});