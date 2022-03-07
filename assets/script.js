var cityEl = document.getElementById("enter-city");
var searchEl = document.getElementById("search-button");
var APIKey = "82109c1a55b9585d216158ebdbf7c5de"
var searchHistory = document.getElementById("history");
var searchHistoryResults = []
var forecastEl = document.getElementById("forecast")
var searchForm = document.getElementById("search-form")

// displaying a history in a string
var getSearchHistory = function () {
    searchHistory.innerHTML = '';
    for (var i = searchHistoryResults.lenght - 1; i >= 0; i--) {
        var button = document.createElement("button")
        button.setAttribute('type', 'button')
        button.classList.add('history-btn', 'btn-history')
        button.setAttribute('data-search', searchHistoryResults[i])
        button.textContent = searchHistoryResults[i]
        searchHistory.append(button)
    }
}

//  Updating history of localstorage
var updateHistory = function (search) {
    if (searchHistoryResults.indexOf(search) !== -1) {
        return
    }
    searchHistoryResults.push(search)
    localStorage.setItem('search-history', JSON.stringify(searchHistoryResults))
    getSearchHistory()
}

// getting search history from local storage
var getHistory = function () {
    var storageHistory = localStorage.getItem('search-history')
    if (storageHistory) {
        searchHistoryResults = JSON.parse(storageHistory)
    }
    getSearchHistory()
}

var displayCurrentWeather = function (city, weather, timezone) {
    var date = moment();
    // .tz("America/new_york").format('M/D/YYYY');
    console.log(date)
    currentDate = (`${date.toString()}`);
    console.log(currentDate)




    // var date = moment();
    //  .tz("America/New_York").format();
    // console.log(date)


    var temp = weather.temp
    var windMph = weather.wind_speed
    var humity = weather.humity
    var UV = weather.uv
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
    var iconDescription = weather.weather[0].description || weather[0].main


    var card = document.createElement('div')
    var cardBody = document.createElement('div')
    var heading = document.createElement('h2')
    var weatherIcon = document.createElement('img')
    var temperatureEl = document.getElementById("temperature");
    var humidityEl = document.getElementById("humidity");
    var windEl = document.getElementById("wind-speed");
    var uviEl = document.getElementById('UV-index');
    card.setAttribute('class', 'card')
    cardBody.setAttribute('class', "card-body");
    card.append(cardBody);
    heading.setAttribute('class', 'h3 card-title');
    temperatureEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text')
    humidityEl.setAttribute('class', 'card-text');
    heading.textContent = `${city} (${date})`
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    weatherIcon.setAttribute('class', 'weather-img')
    heading.append(weatherIcon);
    temperatureEl.textContent = `temp; ${temp}`
    windEl.textContent = `wind; ${windMph}MPH`
    humidityEl.textContent = `humidity ${humity}%`
    cardBody.append(heading, temperatureEl, windEl, humidityEl);
    uviEl.textContent = 'uv index;'

}

var displayDailyForecastCard = function (forecast, timezone) {
    var unixt = forecast.dt
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
    var iconDescription = weather.weather[0].description || weather[0].main
    var temp = forecast.temp.day
    var {humity} = forecast
    var windMPH = forecast.wind_speed
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTile = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTile, weatherIcon, tempEl, windEl, humidityEl);
    col.setAttribute("class", "col-md");
    col.classList.add("Five-day-card")
    card.setAttribute("class", "card bg-primary text-white");
    cardBody.setAttribute("class", "card-body p-2")
    cardTile.setAttribute("class", "card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");
    cardTile.textContent = moment.tz(timezone).format('M/D/YYYY');
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    temperatureEl.textContent = `temp; ${temp}`
    windEl.textContent = `wind; ${windMph}MPH`
    humidityEl.textContent = `humidity ${humity}%`
    forecastEl.append(col)
}

var displayFiveDayForcast = function (dailyForecast, timezone) {
//    var days = moment.weekdays(); days.push(days.shift()); moment.weekdays = days;
   var startDt = moment()
   var endDt = moment().add(5, 'days')
   while (endDt.isAfter(startDt)) {
       console.log(startDt.format('MM-DD-YYYY'))
       //increment by one day
      startDt = startDt.add(1, 'day')
   }
    var headingCol = document.createElement('div')
    var heading = document.createElement('h4')
    headingCol.setAttribute("class", "col-12")
    heading.textContent = 'five-day-forecast'
    headingCol.append(heading);
    forecastEl.innerHTML = "";
    forecastEl.append(headingCol);
    for (var i = 0; i < dailyForecast.length; i++){
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            displayDailyForecastCard(dailyForecast[i], timezone)
        }

    }
}

var renderItem = function(city, data) {
    displayCurrentWeather(city, data.current, data.timezone)
    displayFiveDayForcast(data.daily, data.timezone)
}

var fetchWeather = function(location) {
    var {lat} = location
    var {lon} = location 
    var city = location.name
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`
    fetch(apiUrl).then(function(response){
        console.log(response.json)
        return response.json()
      

    }).then(function(data){
        renderItem(city, data)
    })
    .catch(function(error){
        console.log(error)
    })
}

var fetchCords = function(search) {
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${APIKey}`
    fetch(apiUrl).then(function(response){
        return response.json()

    }).then(function(data){
        if (!data[0]) {
            alert("Location not found")
        }
        else {
            updateHistory(search) 
            fetchWeather(data[0])
        }
    })
    .catch(function(error){
        console.log(error)
    })
}

var searchFormSubmit = function(e) {
    if (!cityEl.value) {
        return
    } 
    e.preventDefault()
    var search = cityEl.value.trim();
    fetchCords(search)
    cityEl.value = '';
}

var handleSearchHistoryClick = function(e) {
    if (!e.target.matches(".btn-history")) {
        return
    }
    var btn = e.target
    var search = btn.getAttribute("data-search")
    fetchCords(search)
}
getHistory()

searchForm.addEventListener("submit", searchFormSubmit)
searchHistory.addEventListener("click", handleSearchHistoryClick)