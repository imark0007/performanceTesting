/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.961590909090909, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/national-university/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/national-university/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/national-university/-2"], "isController": false}, {"data": [0.87, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/national-university/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.bdniyog.com/"], "isController": false}, {"data": [0.99, 500, 1500, "https://www.bdniyog.com/category/job-exam-result/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/gk-updates/"], "isController": false}, {"data": [0.99, 500, 1500, "https://www.bdniyog.com/category/featured/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/featured/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/featured/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/featured/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/featured/-2"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.99, 500, 1500, "https://www.bdniyog.com/category/featured/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/job-exam-result/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/job-exam-result/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/job-exam-result/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/national-university/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/job-exam-result/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/job-exam-result/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/gk-updates/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/gk-updates/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/gk-updates/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/admission/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/admission/-0"], "isController": false}, {"data": [0.98, 500, 1500, "https://www.bdniyog.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/admission/-3"], "isController": false}, {"data": [0.99, 500, 1500, "https://www.bdniyog.com/professors-current-affairs-february/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/admission/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/national-university/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/admission/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/admission/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/gk-updates/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.bdniyog.com/category/gk-updates/-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2150, 0, 0.0, 154.21302325581416, 19, 1017, 91.0, 276.0, 418.4499999999998, 634.8999999999978, 84.353421217828, 3082.5313321465005, 99.16201374176083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.bdniyog.com/category/national-university/-0", 50, 0, 0.0, 177.85999999999996, 150, 355, 159.0, 263.09999999999997, 268.25, 355.0, 3.4782608695652177, 277.5626358695652, 2.1535326086956523], "isController": false}, {"data": ["https://www.bdniyog.com/category/national-university/-1", 50, 0, 0.0, 89.5, 85, 101, 89.0, 94.0, 99.0, 101.0, 3.4950370473927026, 2.7504303264364602, 2.5939728086117713], "isController": false}, {"data": ["https://www.bdniyog.com/category/national-university/-2", 50, 0, 0.0, 89.72, 85, 104, 89.0, 94.69999999999999, 97.44999999999999, 104.0, 3.492351749668227, 2.7525461426974926, 2.602211313473493], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/", 50, 0, 0.0, 462.7, 399, 845, 422.5, 540.0, 614.5999999999998, 845.0, 3.905639743790033, 584.8601689433292, 16.549385594047806], "isController": false}, {"data": ["https://www.bdniyog.com/category/national-university/-3", 50, 0, 0.0, 90.16, 85, 102, 89.0, 94.0, 98.79999999999998, 102.0, 3.4947927587894037, 2.754333543020899, 2.5562497815754526], "isController": false}, {"data": ["https://www.bdniyog.com/", 50, 0, 0.0, 641.3199999999997, 570, 1017, 597.5, 724.8, 825.9999999999994, 1017.0, 4.356159609688099, 680.429408433525, 13.829955948335947], "isController": false}, {"data": ["https://www.bdniyog.com/category/job-exam-result/", 50, 0, 0.0, 273.82000000000005, 245, 577, 253.0, 365.6, 377.4, 577.0, 3.661126162407556, 369.6850745039174, 13.08924109431061], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/-2", 50, 0, 0.0, 119.92000000000002, 85, 258, 90.0, 251.9, 255.0, 258.0, 4.043998705920414, 3.184017106114526, 3.0132529420090584], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/-3", 50, 0, 0.0, 119.31999999999998, 86, 265, 90.0, 254.8, 258.79999999999995, 265.0, 4.045634760093859, 3.1913104822396634, 2.959160581357715], "isController": false}, {"data": ["https://www.bdniyog.com/category/gk-updates/", 50, 0, 0.0, 265.4600000000001, 243, 364, 253.0, 343.69999999999993, 360.0, 364.0, 3.828777088597902, 388.37364915958347, 13.669930699134698], "isController": false}, {"data": ["https://www.bdniyog.com/category/featured/", 50, 0, 0.0, 272.85999999999996, 243, 614, 254.0, 338.09999999999997, 359.9, 614.0, 3.701236212895107, 351.78247776945, 13.20734093937375], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/-4", 50, 0, 0.0, 126.2, 81, 252, 84.0, 250.7, 251.45, 252.0, 4.046289552480376, 7.886155114509995, 2.635620245609776], "isController": false}, {"data": ["https://www.bdniyog.com/category/featured/-3", 50, 0, 0.0, 90.38, 85, 113, 89.0, 93.9, 98.14999999999998, 113.0, 3.749531308586427, 2.9555387607799024, 2.7425770997375327], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/-5", 50, 0, 0.0, 26.439999999999998, 20, 44, 25.0, 33.9, 39.24999999999998, 44.0, 4.06603236561763, 0.5559028624867853, 3.0137876616247863], "isController": false}, {"data": ["https://www.bdniyog.com/category/featured/-4", 50, 0, 0.0, 24.919999999999998, 21, 37, 24.0, 28.9, 32.449999999999996, 37.0, 3.768181475619866, 0.5151810611199036, 2.7930173242143344], "isController": false}, {"data": ["https://www.bdniyog.com/category/featured/-1", 50, 0, 0.0, 89.62000000000003, 86, 99, 89.0, 92.0, 96.0, 99.0, 3.748969033515783, 2.9490913436305015, 2.7824379545624955], "isController": false}, {"data": ["https://www.bdniyog.com/category/featured/-2", 50, 0, 0.0, 91.06, 85, 111, 90.0, 98.8, 102.24999999999997, 111.0, 3.748969033515783, 2.953338222613781, 2.7934212622778736], "isController": false}, {"data": ["Test", 50, 0, 0.0, 2467.1400000000003, 2246, 2896, 2429.0, 2754.2999999999997, 2844.35, 2896.0, 4.147312541473125, 3258.4422110878404, 104.82089441979099], "isController": true}, {"data": ["https://www.bdniyog.com/category/featured/-0", 50, 0, 0.0, 178.30000000000007, 153, 512, 160.0, 243.29999999999995, 266.25, 512.0, 3.7268932617769828, 344.9061376108751, 2.2674360371943947], "isController": false}, {"data": ["https://www.bdniyog.com/category/job-exam-result/-3", 50, 0, 0.0, 90.05999999999999, 86, 123, 89.0, 93.9, 97.14999999999998, 123.0, 3.7058997924696118, 2.9194094185443222, 2.71066303179662], "isController": false}, {"data": ["https://www.bdniyog.com/category/job-exam-result/-2", 50, 0, 0.0, 90.84000000000002, 85, 115, 90.0, 94.0, 104.24999999999997, 115.0, 3.704526931910795, 2.9219456175446394, 2.7603066885233756], "isController": false}, {"data": ["https://www.bdniyog.com/category/job-exam-result/-4", 50, 0, 0.0, 25.839999999999993, 19, 59, 24.0, 34.599999999999994, 42.0, 59.0, 3.723840023832576, 0.5091187532583601, 2.760150955164966], "isController": false}, {"data": ["https://www.bdniyog.com/category/national-university/-4", 50, 0, 0.0, 26.339999999999993, 20, 68, 24.5, 32.699999999999996, 35.34999999999999, 68.0, 3.5097571248069634, 0.479849606907202, 2.6014703688754737], "isController": false}, {"data": ["https://www.bdniyog.com/category/job-exam-result/-1", 50, 0, 0.0, 90.53999999999998, 85, 109, 89.5, 94.0, 102.94999999999996, 109.0, 3.7056251389609427, 2.91325826354406, 2.750268657822575], "isController": false}, {"data": ["https://www.bdniyog.com/category/job-exam-result/-0", 50, 0, 0.0, 178.16, 153, 483, 160.0, 274.59999999999997, 283.49999999999994, 483.0, 3.6865000368650005, 363.03313126705007, 2.2680615461181155], "isController": false}, {"data": ["https://www.bdniyog.com/category/gk-updates/-4", 50, 0, 0.0, 24.640000000000008, 21, 35, 24.0, 28.9, 29.449999999999996, 35.0, 3.930199654142431, 0.5373319839647854, 2.913106970209087], "isController": false}, {"data": ["https://www.bdniyog.com/category/gk-updates/-2", 50, 0, 0.0, 89.12, 85, 95, 89.0, 92.0, 94.0, 95.0, 3.9099155458242105, 3.081349458476697, 2.913345274867063], "isController": false}, {"data": ["https://www.bdniyog.com/category/gk-updates/-3", 50, 0, 0.0, 91.30000000000001, 85, 114, 90.0, 95.9, 104.24999999999997, 114.0, 3.9105271390583454, 3.083511751134053, 2.8603367452682624], "isController": false}, {"data": ["https://www.bdniyog.com/-4", 50, 0, 0.0, 54.68000000000001, 45, 75, 54.0, 67.9, 69.79999999999998, 75.0, 4.752851711026616, 94.52326669439164, 3.151549132604563], "isController": false}, {"data": ["https://www.bdniyog.com/-3", 50, 0, 0.0, 184.79999999999998, 86, 297, 252.5, 262.0, 263.9, 297.0, 4.733503739467954, 71.04489876218877, 2.9907977728864905], "isController": false}, {"data": ["https://www.bdniyog.com/-2", 50, 0, 0.0, 221.40000000000003, 86, 284, 254.5, 267.8, 274.7, 284.0, 4.659398005777654, 56.94421390131395, 3.0076778142763954], "isController": false}, {"data": ["https://www.bdniyog.com/category/admission/-1", 50, 0, 0.0, 90.46000000000001, 87, 103, 90.0, 92.9, 98.14999999999998, 103.0, 3.961023528479759, 3.118377663788323, 2.9398221500435713], "isController": false}, {"data": ["https://www.bdniyog.com/-1", 50, 0, 0.0, 200.48000000000005, 87, 277, 252.5, 261.9, 264.9, 277.0, 4.661135452596253, 12.421197678754544, 2.9996955695907523], "isController": false}, {"data": ["https://www.bdniyog.com/category/admission/-0", 50, 0, 0.0, 183.20000000000002, 152, 277, 160.0, 266.0, 271.34999999999997, 277.0, 3.907776475185619, 380.90730632082847, 2.381301289566237], "isController": false}, {"data": ["https://www.bdniyog.com/-0", 50, 0, 0.0, 376.18000000000006, 315, 679, 332.5, 456.7, 542.0999999999992, 679.0, 4.45632798573975, 474.2269315396613, 2.632889093137255], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/-0", 50, 0, 0.0, 202.08000000000004, 156, 388, 166.0, 278.6, 335.79999999999995, 388.0, 3.9831116067872223, 578.7404374203377, 2.493334511670517], "isController": false}, {"data": ["https://www.bdniyog.com/category/admission/-3", 50, 0, 0.0, 90.48000000000002, 85, 117, 89.0, 94.9, 100.44999999999999, 117.0, 3.959768749505029, 3.1176991763681, 2.89635429040944], "isController": false}, {"data": ["https://www.bdniyog.com/professors-current-affairs-february/-1", 50, 0, 0.0, 159.3, 85, 557, 93.0, 260.8, 265.9, 557.0, 3.9932912706652823, 3.1433129841865664, 2.963770864946889], "isController": false}, {"data": ["https://www.bdniyog.com/category/admission/-2", 50, 0, 0.0, 92.26, 86, 145, 90.0, 98.8, 115.74999999999994, 145.0, 3.9619651347068148, 3.122369007527734, 2.9521283181458005], "isController": false}, {"data": ["https://www.bdniyog.com/category/national-university/", 50, 0, 0.0, 271.52, 242, 449, 253.5, 354.9, 363.04999999999995, 449.0, 3.45447008428907, 284.3001891322371, 12.363899276288517], "isController": false}, {"data": ["https://www.bdniyog.com/category/admission/-4", 50, 0, 0.0, 26.800000000000004, 20, 77, 25.0, 31.0, 34.449999999999996, 77.0, 3.9818427968463808, 0.5443925698813411, 2.9513854324281277], "isController": false}, {"data": ["https://www.bdniyog.com/category/admission/", 50, 0, 0.0, 279.46000000000004, 243, 392, 255.0, 361.8, 370.0, 392.0, 3.878675044604763, 387.7650831975797, 13.844294226592195], "isController": false}, {"data": ["https://www.bdniyog.com/category/gk-updates/-0", 50, 0, 0.0, 170.82000000000005, 150, 272, 159.0, 249.49999999999994, 266.34999999999997, 272.0, 3.8559420066322203, 381.4894298989743, 2.353480228657361], "isController": false}, {"data": ["https://www.bdniyog.com/category/gk-updates/-1", 50, 0, 0.0, 90.83999999999999, 85, 107, 89.5, 96.0, 101.59999999999997, 107.0, 3.9096098209398704, 3.0754579130502777, 2.90166353897881], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2150, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
