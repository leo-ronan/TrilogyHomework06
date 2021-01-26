$(document).ready(function() {
    var searchHistory = [];
    function buildSearchHistory(){
        var sList = $('ul')
        sList.html("");
        $.each(searchHistory, function(i){
            var li = $('<li/>')
            .addClass('list-group-item')
            .appendTo(sList)
            .text(searchHistory[i])
            .appendTo(li);
        });
    }

    //When enter key is inputted, save query under var userSearch and run getWeather(userSearch)
    var userSearch;
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            userSearch = $(".form-control").val();
            console.log("userSearch:" + userSearch);
            getWeather(userSearch);
            getForecast(userSearch);
        }
    
    //Hover animation for search history, written before I knew of :hover in css
    $("li").hover(function(){
        $(this).css("background-color", "lightgray");
    }, function(){
        $(this).css("background-color", "white");
    });

    //When a search history item is clicked, run getWeather(cityClicked)
    $("li").click(function() {
        var cityClicked = $(this).html();
        cityClicked = cityClicked.substr(0, 5);
        console.log("cityClicked:" + cityClicked);
        getWeather(cityClicked);
        $("input").val(cityClicked);
        getForecast(cityClicked);
    });
    });

    var city = "";
    var temp = "";
    var humidity = "";
    var windSpeed = "";
    var windDir = "";
    var type = "";
    var icon;
    var typeDesc;
    var zip;
    var ignoreLoop = true;

    //API
    function getWeather(input) {
        getForecast(input);
        console.log("HistoryJSONExists: " + historyJSONexists);
        var needNewData = true;
        if (historyJSONexists == true) {
            for (let i = 0; i < searchHistoryJSON.length; i++) {
                if (searchHistoryJSON[i].zip == input) {
                    console.log("Duplicate API call detected! Loading data from previous call.")
                    needNewData = false;
                    loadData(searchHistoryJSON[i].data);
                }
            }
        }
        if (needNewData == true) {
            console.log("Function getWeather() ran with parameter: " + input);
            zip = input;
            city = "";
            temp = "";
            humidity = "";
            windSpeed = "";
            windDir = "";
            type = "";
            icon = "";
    
            var key = "1ab6655ec3d37c2024615c814840b246";
            var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&appid=" + key;
            $.ajax({
                datatype: "json",
                url: queryURL,
                method: "GET"
            })
                .then(function(response) {
                    saveJSON(response);
                    loadData(response);
                }).then(function() {
                    userSearch = zip + " (" + city + ")";
                    var isDuplicate = false;
                    if (ignoreLoop == false) {
                        for (let i = 0; i < searchHistory.length; i++) {
                            if (searchHistory[i] === userSearch) {
                                console.log("Duplicate search history");
                                isDuplicate = true;
                                zip = "";
                            }
                            else {
                                isDuplicate = false;
                            }
                        }
                    }
                    if (isDuplicate == false) {
                        ignoreLoop = false;
                        searchHistory.push(userSearch);
                        buildSearchHistory();
                        zip = "";
                    }
                    else if (isDuplicate == true) {
                        console.log("Shouldn't have saved");
                    }
                });
        }
        
    }

    function loadData(response) {
        console.log(response);
        city = response.name;
        temp = ((response.main.temp - 273.15) * (9/5)) + 32;
        humidity = response.main.humidity;
        windSpeed = response.wind.speed;
        windDir = response.wind.deg;
        windDir = "rotate(" + windDir + ")"
        type = response.weather[0].main;
        icon = response.weather[0].icon;
        typeDesc = response.weather[0].description;
        const iconLink = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        $(".forecastCity").html(city);
        $("#icon").attr("src", iconLink);
        $("#icon").attr("title", typeDesc);
        $("#type").html(type);
        $("#temp").html(temp.toFixed(1) + "&#176F");
        $("#humidity").html("Humidity: " + humidity + "%");
        $("#windSpeed").html("Wind speed: " + windSpeed);
    }

    //Waste not your API calls, saves JSON data in array SearchHistoryJSON and sets historyJSONexists to true
    var searchHistoryJSON = [];
    var historyJSONexists = false;
    function saveJSON(response){
        console.log("SaveJSON begin");
        console.log(historyJSONexists);
        const city = {
            zip: zip,
            data: response
        }
        console.log(city);
        if (historyJSONexists == false) {
            searchHistoryJSON.push(city);
            historyJSONexists = true;
            console.log('false check');
        }
        else if (historyJSONexists == true){
            console.log('true check');
            var saveData = true;
            for (let i = 0; i < searchHistoryJSON.length; i++){
                console.log('loop intro check');
                console.log(city.zip);
                console.log("must match " + searchHistoryJSON[i].zip)
                if (city.zip == searchHistoryJSON[i].zip) {
                    console.log('zip match check');
                    console.log("This data has already been saved.");
                    saveData = false;
                }
            }
            if (saveData == true) {
                searchHistoryJSON.push(city);
                console.log("JSON: " + searchHistoryJSON);
                console.log("above is json");
            }
        }
    }

    function getForecast(input) {
        var key = "1ab6655ec3d37c2024615c814840b246";
        var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?zip=" + input + "&appid=" + key + "&units=imperial";
        $.ajax({
            datatype: "json",
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                var forecast = {
                    day0: {
                        temp: "",
                        humidity: "",
                        windSpeed: "",
                        windDir: "",
                        type: "",
                        icon: ""
                    },
                    day1: {
                        temp: "",
                        humidity: "",
                        windSpeed: "",
                        windDir: "",
                        type: "",
                        icon: ""
                    },
                    day2: {
                        temp: "",
                        humidity: "",
                        windSpeed: "",
                        windDir: "",
                        type: "",
                        icon: ""  
                    },
                    day3: {
                        temp: "",
                        humidity: "",
                        windSpeed: "",
                        windDir: "",
                        type: "",
                        icon: ""  
                    },
                    day4: {
                        temp: "",
                        humidity: "",
                        windSpeed: "",
                        windDir: "",
                        type: "",
                        icon: ""
                    },
                };
                var dateTrack = [];
                console.log(response);
                for (i = 0; i < response.list.length; i++) {
                    var time = response.list[i].dt_txt;
                    if (time.charAt(12) === "2") {
                        var thisDate = response.list[i].dt_txt.charAt(9);
                        var dateTrackInfo = {
                            date: thisDate,
                            temp: response.list[i].main.temp,
                            humidity: response.list[i].main.humidity,
                            windSpeed: response.list[i].wind.speed,
                            windDir: response.list[i].wind.deg,
                            type: response.list[i].weather[0].description,
                            icon: response.list[i].weather[0].icon
                        };
                        dateTrack.push(dateTrackInfo);
                    }
                }
                loadForecast(dateTrack);
                console.log(dateTrack);

            });
    }

    function loadForecast(data) {
        $(".forecastDiv").empty();
        for (let i = 0; i < data.length; i++) {
            console.log(data);
            var node = document.createElement("div");
            node.setAttribute("class", "forecastDiv");
            var nodeChild = document.createElement("p");
            var nodeChild1 = document.createElement("p");
            var temp = document.createTextNode("Temperature: " + data[i].temp + " F");
            console.log(temp);
            var type = document.createTextNode("Condition: " + data[i].type);
            nodeChild.appendChild(temp);
            nodeChild1.appendChild(type);
            node.appendChild(nodeChild);
            node.appendChild(nodeChild1);
            document.getElementById("day" + i).appendChild(node);
        }
    }
//END
});