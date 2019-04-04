var democrats = []
var republicans = []
var independents = []

var statistics = [{
    "Number of Democrats": 0,
    "Number of Republicans": 0,
    "Number of Independents": 0
},
{
    "Democrats voted with Party": 0,
    "Republicans voted with Party": 0,
    "Independents voted with Party": 0
},
{
    "Number of members": 0,
    "Total loyalty": 0


}];

if (location.pathname == "/senate-attendance.html") {
    var secondColumnData = "missed_votes_pct";
    var thirdColumnData = "missed_votes";
    var positionOfBottomTenPercentTable = 2;
    var positionOfTopTenPercentTable = 1;
    startSenate()
}
if (location.pathname == "/senate-loyalty.html") {
    var secondColumnData = "votes_with_party_pct";
    var thirdColumnData = "total_votes";
    var positionOfBottomTenPercentTable = 1;
    var positionOfTopTenPercentTable = 2;
    startSenate()

}
if (location.pathname == "/house-loyalty.html") {
    var secondColumnData = "votes_with_party_pct";
    var thirdColumnData = "total_votes";
    var positionOfBottomTenPercentTable = 1;
    var positionOfTopTenPercentTable = 2;
    startHouse()

}
if (location.pathname == "/house-attendance.html") {
    var secondColumnData = "missed_votes_pct";
    var thirdColumnData = "missed_votes";
    var positionOfBottomTenPercentTable = 2;
    var positionOfTopTenPercentTable = 1;
    startHouse()
}

function startSenate() {
    showLoader();

    var fetchConfig =
        fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
            method: "GET",
            headers: new Headers({
                "X-API-Key": 'sI9B6ALwc0XSrvRyQTgopNYNHhlOLReSMmcJkRW7'
            })
        })
        .then(onDataFetched)
        .catch(onDataFetchFailed);
}

function startHouse() {

    showLoader();
    var fetchConfig =
        fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
            method: "GET",
            headers: new Headers({
                "X-API-Key": 'sI9B6ALwc0XSrvRyQTgopNYNHhlOLReSMmcJkRW7'
            })

        })
        .then(onDataFetched)
        .catch(onDataFetchFailed);


}

function onConversionToJsonSuccessful(json) {

    console.log("success!", json);

    data = json;

    showPage()

    var members = data.results[0].members
    bottomTenPercent(members)
    topTenPercent(members)
    numberOfReps()
    partyLoyaltyDem()
    partyLoyaltyRep()
    partyLoyaltyInd()
    atGlanceTotals()
    senateOrHouseAtGlance()
    createTable(statistics.bottom_ten_percent, positionOfBottomTenPercentTable)
    createTable(statistics.top_ten_percent, positionOfTopTenPercentTable)
    
}

function onDataFetched(response) {
    response.json()
        .then(onConversionToJsonSuccessful)
        .catch(onConversionToJsonFailed);
}

function onDataFetchFailed(error) {
    console.log("I'm done whit this.'", error);
}
/********************************* CALCULATION FOR TOTAL NUMBER OF MEMBERS IN EACH PARTY ********************************/
function numberOfReps() {
    var members = data.results[0].members
    for (i = 0; i < members.length; i++) {
        if (members[i].party == "D") {
            democrats.push(members[i])
        } else if (members[i].party == "R") {
            republicans.push(members[i])
        } else {
            independents.push(members[i])
        }
    }
    statistics[0]["Number of Democrats"] = democrats.length
    statistics[0]["Number of Republicans"] = republicans.length
    statistics[0]["Number of Independents"] = independents.length
}
/********************************* CALCULATION FOR LOYALTY (AVARAGE) ********************************/
function partyLoyaltyDem() {
    var totalPercentage = 0
    for (i = 0; i < democrats.length; i++) {
        totalPercentage += democrats[i].votes_with_party_pct
    }
    var loyaltyDem = totalPercentage / democrats.length;
    statistics[1]["Democrats voted with Party"] = loyaltyDem
}

function partyLoyaltyRep() {
    var totalPercentage = 0
    for (i = 0; i < republicans.length; i++) {
        totalPercentage += republicans[i].votes_with_party_pct
    }
    var loyaltyRep = totalPercentage / republicans.length;
    statistics[1]["Republicans voted with Party"] = loyaltyRep
}

function partyLoyaltyInd() {
    var totalPercentage = 0
    for (i = 0; i < independents.length; i++) {
        totalPercentage += independents[i].votes_with_party_pct
    }
    if (independents.length !== 0) {var loyaltyInd = totalPercentage / independents.length;
    statistics[1]["Independents voted with Party"] = loyaltyInd}else{statistics[1]["Independents voted with Party"] == 0}
}
/********************************* CALCULATION FOR GLANCE TOTAL AVARAGE ********************************/
function atGlanceTotals(){
 var totalMembers = democrats.length + republicans.length + independents.length
    statistics[2]["Number of members"] = totalMembers
var loyaltyAverage = ((democrats.length/totalMembers) * statistics[1]["Democrats voted with Party"]) + ((republicans.length/totalMembers) * statistics[1]["Republicans voted with Party"]) + ((independents.length/totalMembers) * statistics[1]["Independents voted with Party"])
           statistics[2]["Total loyalty"] = loyaltyAverage            
}

function senateOrHouseAtGlance() {
    var cells = document.getElementsByTagName("td");
    cells[1].innerHTML = statistics[0]["Number of Republicans"]
    cells[2].innerHTML = (statistics[1]["Republicans voted with Party"]).toFixed(2) + "%"
    cells[4].innerHTML = statistics[0]["Number of Democrats"]
    cells[5].innerHTML = (statistics[1]["Democrats voted with Party"]).toFixed(2) + "%"
    cells[7].innerHTML = statistics[0]["Number of Independents"]
    cells[8].innerHTML = (statistics[1]["Independents voted with Party"]).toFixed(2) + "%"
    cells[10].innerHTML = statistics[2]["Number of members"]
    cells[11].innerHTML = (statistics[2]["Total loyalty"]).toFixed(2) + "%"
}
/********************************* CALCULATION FOR BOTTOM 10% ********************************/
function bottomTenPercent(input) {
    var bottomTenPercent = []
    var members = input
    members.sort(function (a, b) {
        return a[secondColumnData] - b[secondColumnData]
    })
    var numberOfValues = Math.round((input.length) * 0.1)
    for (i = 0; i < input.length; i++) {
        if (i < numberOfValues) {
            bottomTenPercent.push(input[i])
        } else if (input[i][secondColumnData] == input[i - 1][secondColumnData]) {
            bottomTenPercent.push(input[i])
        } else break
    }
    statistics.bottom_ten_percent = bottomTenPercent
}
/********************************* CALCULATION FOR TOP 10% ********************************/
function topTenPercent(input) {
    var topTenPercent = []
    var members = input
    members.sort(function (a, b) {
        return b[secondColumnData] - a[secondColumnData]
    })
    var numberOfValues = Math.round((input.length) * 0.1)
    for (i = 0; i < input.length; i++) {
        if (i < numberOfValues) {
            topTenPercent.push(input[i])
        } else if (input[i][secondColumnData] == input[i - 1][secondColumnData]) {
            topTenPercent.push(input[i])
        } else break
    }
    statistics.top_ten_percent = topTenPercent
}
/********************************* TABLE FOR ATTENDANCE AND LOYALTY ********************************/
function createTable(inputData, tableNumber) {
    var tableBody = document.getElementsByClassName("tableBody")
    tableBody[tableNumber].innerHTML = ""
    if (inputData == "") {
        tableBody[tableNumber].innerHTML = "<tr><td colspan=5 class='table-danger'>No data to show</td></tr>"
    }
    for (j = 0; j < inputData.length; j++) {
        var tableRow = document.createElement("tr");
        tableBody[tableNumber].appendChild(tableRow)
        var tableCell = document.createElement("td")
        var nameString = ""
        nameString += inputData[j].first_name + " "
        if (inputData[j].middle_name !== null || "") {
            nameString += inputData[j].middle_name + " "
        }
        nameString += inputData[j].last_name + " "
        var nameLink = document.createElement("a")
        nameLink.setAttribute("href", inputData[j].url)
        nameLink.setAttribute("target", "_blank")
        var linkText = document.createTextNode(nameString)
        nameLink.appendChild(linkText)
        tableCell.appendChild(nameLink)
        tableRow.appendChild(tableCell)
        var tableCell = document.createElement("td")
        var party = document.createTextNode(inputData[j][thirdColumnData]);
        tableCell.appendChild(party)
        tableRow.appendChild(tableCell)
        var tableCell = document.createElement("td")
        var state = document.createTextNode(inputData[j][secondColumnData].toFixed(2) + "%");
        tableCell.appendChild(state)
        tableRow.appendChild(tableCell)
    }
}

function showPage() {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("main").style.display = "block";
}

function showLoader() {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("main").style.display = "none";
}
