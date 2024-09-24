(function () {
    var myConnector = tableau.makeConnector();

    // Function to define columns
    function getColumns() {
        console.log("Defining columns");
        return [
            { id: "plan1yearRangeId", alias: "Plan 1 Year Range ID", dataType: tableau.dataTypeEnum.int },
            { id: "plan1yearRangeName", alias: "Plan 1 Year Range Name", dataType: tableau.dataTypeEnum.string },
            { id: "season01", alias: "Season 01", dataType: tableau.dataTypeEnum.string },
            { id: "season02", alias: "Season 02", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth01", alias: "Year Month 01", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth02", alias: "Year Month 02", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth03", alias: "Year Month 03", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth04", alias: "Year Month 04", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth05", alias: "Year Month 05", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth06", alias: "Year Month 06", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth07", alias: "Year Month 07", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth08", alias: "Year Month 08", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth09", alias: "Year Month 09", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth10", alias: "Year Month 10", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth11", alias: "Year Month 11", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth12", alias: "Year Month 12", dataType: tableau.dataTypeEnum.string },
            { id: "plan1yearGrouping", alias: "Plan 1 Year Grouping", dataType: tableau.dataTypeEnum.string },
            { id: "gpsTypology", alias: "GPS Typology", dataType: tableau.dataTypeEnum.string },
            { id: "countryCode", alias: "Country Code", dataType: tableau.dataTypeEnum.string },
            { id: "currencyCode", alias: "Currency Code", dataType: tableau.dataTypeEnum.string },
            { id: "countryCurrency", alias: "Country Currency", dataType: tableau.dataTypeEnum.string },
            { id: "supplierCode", alias: "Supplier Code", dataType: tableau.dataTypeEnum.string },
            { id: "supplierName", alias: "Supplier Name", dataType: tableau.dataTypeEnum.string },
            { id: "season01SupplierAllocQtyUnit", alias: "Season 01 Supplier Alloc Qty Unit", dataType: tableau.dataTypeEnum.float },
            { id: "season01SupplierAllocQtyPcs", alias: "Season 01 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "season02SupplierAllocQtyUnit", alias: "Season 02 Supplier Alloc Qty Unit", dataType: tableau.dataTypeEnum.float },
            { id: "season02SupplierAllocQtyPcs", alias: "Season 02 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month01SupplierAllocQtyPcs", alias: "Month 01 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month02SupplierAllocQtyPcs", alias: "Month 02 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month03SupplierAllocQtyPcs", alias: "Month 03 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month04SupplierAllocQtyPcs", alias: "Month 04 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month05SupplierAllocQtyPcs", alias: "Month 05 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month06SupplierAllocQtyPcs", alias: "Month 06 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month07SupplierAllocQtyPcs", alias: "Month 07 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month08SupplierAllocQtyPcs", alias: "Month 08 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month09SupplierAllocQtyPcs", alias: "Month 09 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month10SupplierAllocQtyPcs", alias: "Month 10 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month11SupplierAllocQtyPcs", alias: "Month 11 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float },
            { id: "month12SupplierAllocQtyPcs", alias: "Month 12 Supplier Alloc Qty Pcs", dataType: tableau.dataTypeEnum.float }
        ];
    }

    myConnector.getSchema = function (schemaCallback) {
        console.log("getSchema function called");
        var cols = getColumns();
        var tableSchema = {
            id: "kiaibiAPIData",
            alias: "Kiabi API Data",
            columns: cols
        };
        console.log("Schema defined:", tableSchema);
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        console.log("getData function called");
        var connectionData = JSON.parse(tableau.connectionData);
        console.log("Connection data:", connectionData);
        var apiToken = tableau.password;
        var oneYearId = connectionData.oneYearId;
        var groupings = connectionData.groupings;
        var typologies = connectionData.typologies;
        var cellName = connectionData.cellName;

        var apiUrl = "http://xkiss02.kiabi.fr:83/capacity-planning/rs/gps/oneYearPlan/allocationSummary/searchAllocatedStatistics" +
            "?oneYearId=" + encodeURIComponent(oneYearId) +
            "&groupings=" + encodeURIComponent(groupings) +
            "&typologies=" + encodeURIComponent(typologies) +
            "&cellName=" + encodeURIComponent(cellName);

        console.log("API URL:", apiUrl);

        $.ajax({
            url: apiUrl,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + apiToken
            },
            success: function(resp) {
                console.log("API call successful");
                console.log("Response:", resp);
                var feat = resp.result,
                    tableData = [];

                console.log("Number of records:", feat.length);

                for (var i = 0, len = feat.length; i < len; i++) {
                    var row = {};
                    getColumns().forEach(function(col) {
                        // Ensure each field has a value, use a default if not present
                        row[col.id] = feat[i][col.id] !== undefined ? feat[i][col.id] : null;
                        if (row[col.id] === null) {
                            console.warn("Missing data for column", col.id, "in record", i);
                        }
                    });
                    tableData.push(row);
                }

                console.log("Processed data:", tableData);

                table.appendRows(tableData);
                console.log("Data appended to table");
                doneCallback();
            },
            error: function (xhr, status, error) {
                console.error("API call failed");
                console.error("Status:", status);
                console.error("Error:", error);
                console.error("Response:", xhr.responseText);
                tableau.abortWithError("Error while fetching data: " + error);
            }
        });
    };

    tableau.registerConnector(myConnector);

    // Ensure we're running in the Tableau WDC environment before initializing
    if (tableau.phase === tableau.phaseEnum.interactivePhase || tableau.phase === tableau.phaseEnum.authPhase) {
        console.log("Initializing connector");
        tableau.initCallback();
    }

    // Use jQuery's document ready function to set up the submit button click handler
    $(document).ready(function () {
        console.log("Document ready");
        $("#submitButton").click(function () {
            console.log("Submit button clicked");
            var connectionData = {
                oneYearId: $("#oneYearId").val(),
                groupings: $("#groupings").val(),
                typologies: $("#typologies").val(),
                cellName: $("#cellName").val()
            };
            console.log("Connection data:", connectionData);
            tableau.connectionData = JSON.stringify(connectionData);
            tableau.password = $("#apiToken").val();
            tableau.connectionName = "Kiabi API Data";
            tableau.submit();
            console.log("Submitted to Tableau");
        });
    });
})();
