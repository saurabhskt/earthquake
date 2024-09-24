(function () {
    var myConnector = tableau.makeConnector();
    var columnNames = [];
function getColumns() {
        return [
            { id: "plan1yearRangeId", dataType: tableau.dataTypeEnum.int },
            { id: "plan1yearRangeName", dataType: tableau.dataTypeEnum.string },
            { id: "season01", dataType: tableau.dataTypeEnum.string },
            { id: "season02", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth01", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth02", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth03", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth04", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth05", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth06", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth07", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth08", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth09", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth10", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth11", dataType: tableau.dataTypeEnum.string },
            { id: "yearMonth12", dataType: tableau.dataTypeEnum.string },
            { id: "plan1yearGrouping", dataType: tableau.dataTypeEnum.string },
            { id: "gpsTypology", dataType: tableau.dataTypeEnum.string },
            { id: "countryCode", dataType: tableau.dataTypeEnum.string },
            { id: "currencyCode", dataType: tableau.dataTypeEnum.string },
            { id: "countryCurrency", dataType: tableau.dataTypeEnum.string },
            { id: "supplierCode", dataType: tableau.dataTypeEnum.string },
            { id: "supplierName", dataType: tableau.dataTypeEnum.string },
            { id: "season01SupplierAllocQtyUnit", dataType: tableau.dataTypeEnum.float },
            { id: "season01SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "season02SupplierAllocQtyUnit", dataType: tableau.dataTypeEnum.float },
            { id: "season02SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month01SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month02SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month03SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month04SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month05SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month06SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month07SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month08SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month09SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month10SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month11SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float },
            { id: "month12SupplierAllocQtyPcs", dataType: tableau.dataTypeEnum.float }
        ];
    }
  myConnector.getSchema = function (schemaCallback) {
        var cols = getColumns();
        var tableSchema = {
            id: "kiaibiAPIData",
            alias: "Kiabi API Data",
            columns: cols
        };
        schemaCallback([tableSchema]);
    };

  

 myConnector.getData = function(table, doneCallback) {
        var connectionData = JSON.parse(tableau.connectionData);
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

        $.ajax({
            url: apiUrl,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + apiToken
            },
            success: function(resp) {
                var feat = resp.result,
                    tableData = [];

                for (var i = 0, len = feat.length; i < len; i++) {
                    var row = {};
                    getColumns().forEach(function(col) {
                        row[col.id] = feat[i][col.id];
                    });
                    tableData.push(row);
                }

                table.appendRows(tableData);
                doneCallback();
            },
            error: function (xhr, status, error) {
                tableau.abortWithError("Error while fetching data: " + error);
            }
        });
    };

    tableau.registerConnector(myConnector);

    // Ensure we're running in the Tableau WDC environment before initializing
    if (tableau.phase === tableau.phaseEnum.interactivePhase || tableau.phase === tableau.phaseEnum.authPhase) {
        tableau.initCallback();
    }

    // Use jQuery's document ready function to set up the submit button click handler
    $(document).ready(function () {
        $("#submitButton").click(function () {
            var connectionData = {
                oneYearId: $("#oneYearId").val(),
                groupings: $("#groupings").val(),
                typologies: $("#typologies").val(),
                cellName: $("#cellName").val()
            };
            tableau.connectionData = JSON.stringify(connectionData);
            tableau.password = $("#apiToken").val();
            tableau.connectionName = "Kiabi API Data";
            tableau.submit();
        });
    });
})();
