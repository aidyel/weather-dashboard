var cityInputEl = document.getElementById("city");
var APIKey = "82109c1a55b9585d216158ebdbf7c5de"
var cityFormEl = document.getElementById("city-search-form");
var weatherContainerEl = document.getElementById("current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var date = moment().format("MMM D, YYYY")

var userInput;
var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid=" + APIKey
var lat;
var long;

var cities = []

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
}

var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var cityFormElSubmit = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    saveSearch()
}

// pastSearchButtonEl(city);




var getCityWeather = function (userInput) {
    var APIKey = "82109c1a55b9585d216158ebdbf7c5de"
    var apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&appid=" + APIKey
    fetch(apiURL)
    .then(function (response) {
        // console.log(apiUrl)
        return response.json();
      })
    
      //nest the onecall in a .then to isolate
      .then(function (data) {
        var lat = data[0].lat
        var long = data[0].lon
        var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly&units=imperial&appid=" + APIKey
          fetch(oneCallUrl)
          .then(function (response){
              return response.json()
          })
          //left off want to display the data of the onecallurl 
          .then(function(data){
            console.log(data)
            //call display function here to display five day forecast and current weather dom elements?
    
          displayCurrentWeather(userInput, data)
    
          })
          //insert lat and long variables in the onecall functiom
        // console.log(data)
      });
    }

var displayCurrentWeather = function (searchCity, weather) {

    // clear old content
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    // create date element

    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + date + ") ";
    citySearchInputEl.appendChild(currentDate);

    //create an image element
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    //create a span element to hold temperature data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.current.temp + " °F";
    temperatureEl.classList = "list-group-item"

    //create a span element to hold Humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.current.humidity + " %";
    humidityEl.classList = "list-group-item"

    //create a span element to hold Wind data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.current.wind_speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    var uviEl = document.createElement("span");
    uviEl.textContent = "Uvi:" + weather.current.uvi;
   uviEl.classList = "list-group-item"
    //append to container
    weatherContainerEl.appendChild(temperatureEl);

    //append to container
    weatherContainerEl.appendChild(humidityEl);

    //append to container
    weatherContainerEl.appendChild(windSpeedEl);

    weatherContainerEl.appendChild(uviEl);

    // var lat = weather.coord.lat;
    // var lon = weather.coord.lon;
    // getUvIndex(lat, lon)

}

var getUvIndex = function(lat,lon){
    var APIKey = "82109c1a55b9585d216158ebdbf7c5de"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
           // console.log(data)
        });
    });
    //console.log(lat);
    //console.log(lon);
}

var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //append index to current weather
    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function (city) {
    var APIKey = "82109c1a55b9585d216158ebdbf7c5de"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                display5Day(data);
                console.log(data)
            });
        });
};

var forecastContainerEl = document.querySelector("#five-day-container");


var display5Day = function(weather){
    var forecastEl = document.getElementById("forecast");

    forecastContainerEl.textContent = ""
    forecastEl.textContent = "5-Day Forecast:";

    var forecast = weather.list;
     for(var i=5; i < forecast.length; i=i+8){ 
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumEl);

        // console.log(forecastEl);
       //append to five day container
        forecastContainerEl.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){
 
    // console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
    pastSearchButtonEl.addEventListener("click", pastSearchHandler);
}

// pastSearch();

cityFormEl.addEventListener("submit", cityFormElSubmit);

