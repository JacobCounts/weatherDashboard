// 5 day forcast//
//"https://api.openweathermap.org/data/2.5/forecast?q=portland&APPID=a45c2483a3fc4fe6b57abb8e9140f64b"

var today = new Date();
var date =
  today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();

const apikey = "a45c2483a3fc4fe6b57abb8e9140f64b";
createButton();
//getWeatherDetails("Phoenix");

function getWeatherDetails(city) {
  const query =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apikey;

  $.ajax({
    url: query,
    method: "GET",
  }).then(function (weather) {
    $(".city").text("City: " + weather.name + " (" + date + ") ");
    $(".temp").text("Temp: " + kelvinToF(weather.main.temp));
    $(".humidity").text("Humidity: " + weather.main.humidity);
    $(".wind").text("Wind: " + weather.wind.speed + "MPH");
    $(".weather-display").attr(
      "src",
      "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png"
    );
    //console.log(weather);
    getUVindex(weather.coord.lat, weather.coord.lon);
    fiveDay(city);
    setLocalStorage(city);
  });
}
function setLocalStorage(city) {
  var cities = JSON.parse(localStorage.getItem("city")) || []
  cities.push(city);
  var uniques = [...new Set(cities)]
  localStorage.setItem("city", JSON.stringify(uniques));
  createButton()
}
function createButton() {
  var cities = JSON.parse(localStorage.getItem("city")) || []
  $("#buttons-view").html("");
  for (let i = 0; i < cities.length; i++) {
    
    var listItem = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(cities[i])
      .click(()=>getWeatherDetails(cities[i]))
    $("#buttons-view").append(listItem);
    
  }
}


function kelvinToF(k) {
  return ((k - 273.15) * 1.8 + 32).toFixed(2);
}

// UV Index information 
var getUVindex = function (lat, lon) {
  const query2 =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    apikey +
    "&lat=" +
    lat +
    "&lon=" +
    lon;

  fetch(query2)
    .then((res) => res.json())
    .then((uvindex) => {
      console.log(uvindex);
      var btnUV = $("<span>").text(uvindex.value).addClass("btn btn-sm");
      if (uvindex.value < 3) {
        btnUV.addClass("btn-success")
        
      }else if (uvindex.value < 6) {
        btnUV.addClass("btn-warning")

        
      }else {
        btnUV.addClass("btn-danger")
      }

      $(".uv-index").text("UV Index: ");
      $(".uv-index").append(btnUV);
    });
};

// Five Day forcast 
function fiveDay(city) {
  const query3 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apikey;
  var dateArray = [];
  var iconArray = [];
  var tempArray = [];
  var humidityArray = [];

  fetch(query3)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      for (let i = 0; i < 40; i++) {
        var option = data.list[i].dt_txt.substring(11);
        var dateValue = data.list[i].dt_txt.substring(0, 10);
        var currentDate = date;//change to date from data
        if ("15:00:00" == option && dateValue != currentDate) {
          iconArray.push(data.list[i].weather[0].icon);
          dateArray.push(dateValue);
          console.log(iconArray);
          tempArray
            .push((data.list[i].main.temp - 273.15) * 1.8 + 32)
            .toFixed(2);
          humidityArray.push(data.list[i].main.humidity);
        }
      }


      for (let i = 0; i < dateArray.length; i++) {
        console.log("hello");
        var newDate = $("<h4>").text(dateArray[i]);
        $(`.forecast${i}`).append(newDate);

        var newImg = $("<img>");
        newImg.attr(
          "src",
          "https://api.openweathermap.org/img/w/" + iconArray[i] + ".png"
        );
        $(".forecast" + i).append(newImg);

        var newTemp = $("<p>").html("Temp: " + Math.round(tempArray[i]) + "&#176;F");
        $(".forecast" + i).append(newTemp);

        var newHumidity = $("<p>").html("Humidity: " + humidityArray[i] + "%");
        $(".forecast" + i).append(newHumidity);

        // var card= $(`.forecast${i}`)
        // card.append()
      }
    });
}

// search button click 
$("#add-city").on("click", function(e) {
  e.preventDefault();
  var cityInput = $("#city-input").val().trim();
  // var query = "https://api.openweathermap.org/data/2.5/weather?q=" +
  // cityInput + "&appid=" + apikey;
  $("#city-input, textarea").val(" ");
      getWeatherDetails(cityInput);
  // $.ajax({
  //   url: query,
  //   method: "GET",
  // }).then((city) => {
  //     //localCities.push(cityInput);
  //     //city = cityInput;
  //     $("#city-input, textarea").val(" ");
  //     getWeatherDetails(city);
  //     console.log(cityInput);
  //   })
})


