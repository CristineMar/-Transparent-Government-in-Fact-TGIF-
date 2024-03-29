let data; // represents the data from the ajax api

Vue.component("navbar", {
    props: ["active"],
    methods: {
        activePage: function () {

            if (this.active === "home") {
                return "home";
            } else if (this.active === "data") {
                return "data";
            } else if (this.active === "attendance") {
                return "attendance";
            } else if (this.active === "loyalty") {
                return "loyalty";
            }
        }
    },
});

// vue instance
var main = new Vue({
    el: "#main",
    data: {
        members: [],
        allMembers: [],
        democrats: [],
        republicans: [],
        independents: [],
        d_average: 0,
        r_average: 0,
        i_average: 0,
        total_average: 0,
        statistics: {},
        Loader: true,
    },
    // function called when the page is loaded
    created() {
        this.findValidPage();
        this.loader();
    },
    // section to create functions
    methods: {
        /**
         * This function is to find the 
         * right url to load the json data
         */
        findValidPage() {
            switch (location.href.split("/").slice(-1).toString()) {
                case "senate-loyalty.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
                    break;
                case "senate-attendance.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/senate/members.json");
                    break;
                case "house-attendance.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/house/members.json");
                    break;
                case "house-loyalty.html":
                    this.startFetchingAsync("https://api.propublica.org/congress/v1/113/house/members.json");
                    break;
            }
        },
        /**
         * This function start the json-data fetching process
         * start of the parameter when url fetching starts of the json api
         */
        startFetchingAsync(url) {
            fetch(url, {
                method: "GET",
                headers: new Headers({
                    // Authorization key for the api
                    "X-API-Key": "sI9B6ALwc0XSrvRyQTgopNYNHhlOLReSMmcJkRW7"
                })
                // compare the reponse to json
            }).then(function (response) {
                return response.json();
            }).then(function (json) {

                data = json;
                main.members = data.results[0].members;
                main.allMembers = data.results[0].members;

                main.democrats = main.getSenatorsWithSameParty("D");
                main.republicans = main.getSenatorsWithSameParty("R");
                main.independents = main.getSenatorsWithSameParty("I");

                main.d_average = main.getAverageVotes(main.democrats);
                main.r_average = main.getAverageVotes(main.republicans);
                main.i_average = main.getAverageVotes(main.independents);

                if (main.independents.length === 0) {
                    main.total_average = Math.round(((main.d_average + main.r_average + main.i_average) / 2) * 100) / 100 + "%";
                } else {
                    main.total_average = Math.round(((main.d_average + main.r_average + main.i_average) / 3) * 100) / 100 + "%";
                }

                main.statistics = {
                    democrats_count: main.democrats.length,
                    republicans_count: main.republicans.length,
                    independents_count: main.independents.length,
                    democrats_average_votes_with_party: main.getAverageVotes(main.democrats),
                    republicans_average_votes_with_party: main.getAverageVotes(main.republicans),
                    independents_average_votes_with_party: main.getAverageVotes(main.independents),
                    least_loyal_members: main.getTenPercentOfVoters("lowest"),
                    most_loyal_members: main.getTenPercentOfVoters("highest"),
                    least_engaged_members: main.getTenPercentOfMissedVotes("top"),
                    most_engaged_members: main.getTenPercentOfMissedVotes("bottom"),
                    total_count: main.democrats.length + main.republicans.length + main.independents.length,
                    total_average_votes_with_party: main.total_average,

                }

            }).catch(function (error) {
                console.log(error);
            })
        },
        /**
         * function to create a page loader
         */
        loader() {
            setTimeout(this.showPage, 500);
        },
        /**
         * function to show the page content 
         * if the loader is complete
         */
        showPage() {
            this.$refs.loader.style.display = "none";
            this.$refs.myDiv.style.display = "block";
        },
        /**
         * function to get the averafe of the votes of a party
         * parameter for party array when url fetching process starts.
         */
        getAverageVotes(party) {
            var average = 0;

            for (i = 0; i < party.length; i++)
                average += party[i].votes_with_party_pct;

            if (party.length === 0) {
                return 0;
            } else {
                return Math.round(average / party.length * 100) / 100;
            }
        },
        /**
         * get an array with senators who have the same party
         */
        getSenatorsWithSameParty(party) {
            var senatorsWithSameParty = [];
            for (var i = 0; i < this.members.length; i++) {
                if (this.members[i].party === party)
                    senatorsWithSameParty.push(this.members[i]);
            }
            return senatorsWithSameParty;
        },
        /**
         * get ten percent of voters
         * a parameter to know what type to switch from, either between bottom, lowest and highest
         */
        getTenPercentOfVoters(type) {
            var votes = [];
            var tenPercent = [];

            switch (type) {
                case "bottom":
                    this.members.sort(function (a, b) {
                        return a.missed_votes_pct - b.missed_votes_pct;
                    });
                    return this.sortingContent(tenPercent, votes);
                case "lowest":
                    this.members.sort(function (a, b) {
                        return a.votes_with_party_pct - b.votes_with_party_pct;
                    });
                    return this.sortingContent(tenPercent, votes);
                case "highest":
                    this.members.sort(function (a, b) {
                        return b.votes_with_party_pct - a.votes_with_party_pct;
                    });
                    return this.sortingContent(tenPercent, votes);
            }
        },
        /**
         * get ten percent of missed votes
         * a parameter to know what type to switch from, either to switch between bottom and top
         */
        getTenPercentOfMissedVotes(type) {
            var votes = [];
            var responseArray = [];

            switch (type) {
                case "bottom":
                    this.members.sort(function (a, b) {
                        return a.missed_votes_pct - b.missed_votes_pct;
                    });
                    return this.sortingContent(responseArray, votes);

                case "top":
                    this.members.sort(function (a, b) {
                        return b.missed_votes_pct - a.missed_votes_pct;
                    });
                    return this.sortingContent(responseArray, votes);
            }
        },
        /**
         * function to sort the array
         * a parameter to sort the arrays
         * a parameter to sort the votes array.
         */
        sortingContent(array, votesArray) {
            for (var i = 0; i < this.members.length; i++)
                votesArray.push(this.members[i]);

            for (var i = 0; i < votesArray.length; i++) {
                if (i < ((votesArray.length) * 0.1))
                    array.push(votesArray[i]);
                else if (votesArray[i] === votesArray[i - 1])
                    array.push(votesArray[i]);
            }
            return array;
        },
    },
});