var main = new Vue({
    el: '#main',
    data: {
        members: [],
        republicanChecked: true,
        democratChecked: true,
        independentChecked: true,
        selected: ["All States"],
        states: [],
        membersObject: {},
        showLoader: true,
        noDataInTable: false,
        buttonText: "Read More",
        buttonText1: "Read More",
    },
    created: function () {
        if (location.pathname == "/senate-starter-page.html") {
            var url = "https://api.propublica.org/congress/v1/113/senate/members.json"
            this.getDataObject(url)
        }
        if (location.pathname == "/house-starter-page.html") {
            var url = "https://api.propublica.org/congress/v1/113/house/members.json"
            this.getDataObject(url)
        }
    },
    methods: {
/**
 * WHAT HAPPENS WHEN FETCHING STARTS
 * @param {*} url for party and state filter
 */
        getDataObject: function (url) {
            var fetchConfig =
                fetch(url, {
                    method: "GET",
                    headers: new Headers({
                        "X-API-Key": 'sI9B6ALwc0XSrvRyQTgopNYNHhlOLReSMmcJkRW7'
                    })
                })
            .then(this.onDataFetched)
        },
        onDataFetched: function (response) {
            response.json()
                .then(main.onConversionToJsonSuccessful)
        },
        onConversionToJsonSuccessful: function (json) {
            main.showLoader = false
            main.membersObject = json;
            main.createStateSelector(main.membersObject)
            main.fillArrays(main.membersObject)
        },
/**
 * TO CREATE A STATE SELECTOR 
 * a function to list all states inside of the selector
 * @param {*} input
 * 
 */
        createStateSelector: function(input) {
            var membersData = input.results[0].members
            for (i = 0; i < membersData.length; i++) {
                if (!main.states.includes(membersData[i].state)) {
                    main.states.push(membersData[i].state)
                }
            }
            main.states.sort()
            main.states.splice(0,0, "All States")
        },
/**
 * a function to call another function (fillArray) when a filter (party/state) is clicked.
 */
        filterClicked: function () {
            main.fillArrays(main.membersObject)
        },
/**
 * FILTER
 * a function where it will call the JSON data and will filter it by party and or state.
 * @param {*} input to fill arrays depending which filter is selected
 */
        fillArrays: function (input) {
            main.members = []
            var membersData = input.results[0].members
            for (i = 0; i < membersData.length; i++) {
                if (membersData[i].state == main.selected || main.selected == "" || main.selected == "All States") {
                    if (membersData[i].party == "R" && main.republicanChecked == true) {
                        main.members.push(membersData[i])
                    }
                    if (membersData[i].party == "D" && main.democratChecked == true) {
                        main.members.push(membersData[i])
                    }
                    if (membersData[i].party == "I" && main.independentChecked == true) {
                        main.members.push(membersData[i])
                    }
                }
            }
            if (main.members.length == 0) {
                main.noDataInTable = true
            } else {
                main.noDataInTable = false
            }
        },
/**
 * function for home button
 * what happens when a button is clicked
 */
        changeButtonText: function () {
            if (main.buttonText == "Read Less") {
                main.buttonText = "Read More"
            } else {
                main.buttonText = "Read Less"
                main.buttonText == "Read More"
            }
        },
        changeButtonText1: function () {
            if (main.buttonText1 == "Read Less") {
                main.buttonText1 = "Read More"
            } else {
                main.buttonText1 = "Read Less"
                main.buttonText1 == "Read More"
            }
        }
    }
});
        
