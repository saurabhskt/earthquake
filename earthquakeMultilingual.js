(function () {
    var myConnector = tableau.makeConnector();
    var columnNames = [];

    myConnector.getSchema = function (schemaCallback) {
        var cols = columnNames.map(function(colName) {
            return {
                id: colName,
                dataType: inferDataType(colName)
            };
        });

        var tableSchema = {
            id: "kiaibiAPIData",
            alias: "Kiabi API Data",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    function inferDataType(colName) {
        if (colName.includes("Id") || colName.endsWith("Pcs") || colName.endsWith("Unit")) {
            return tableau.dataTypeEnum.float;
        } else if (colName.startsWith("year") || colName.startsWith("month") || colName.includes("Name") || colName.includes("Code")) {
            return tableau.dataTypeEnum.string;
        } else {
            return tableau.dataTypeEnum.string; // Default to string for unknown types
        }
    }

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

                // If columnNames is empty, populate it with the keys from the first result
                if (columnNames.length === 0 && feat.length > 0) {
                    columnNames = Object.keys(feat[0]);
                }

                for (var i = 0, len = feat.length; i < len; i++) {
                    var row = {};
                    columnNames.forEach(function(colName) {
                        row[colName] = feat[i][colName];
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
