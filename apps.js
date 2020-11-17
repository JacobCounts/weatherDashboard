// 5 day forcast//
//"https://api.openweathermap.org/data/2.5/forecast?q=portland&APPID=a45c2483a3fc4fe6b57abb8e9140f64b"

var today = new Date();
var date =
  today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();

const apikey = "a45c2483a3fc4fe6b57abb8e9140f64b";

getWeatherDetails("Phoenix");

function getWeatherDetails(city) {
  const query =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
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
    createButton(city);
  });
}
function createButton(city) {
  // var listItem = document.createElement("li")
  var listItem = $("<li>")
    .addClass("list-group-item list-group-item-action")
    .text(city);
  $("#buttons-view").append(listItem);
}

function kelvinToF(k) {
  return ((k - 273.15) * 1.8 + 32).toFixed(2);
}

var getUVindex = function (lat, lon) {
  const query2 =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    apikey +
    "&lat=" +
    lat +
    "&lon=" +
    lon;
  // "&appid=" +
  // apikey;

  fetch(query2)
    .then((res) => res.json())
    .then((uvindex) => {
      console.log(uvindex);
      var btnUV = $("<span>").text(uvindex);
      $(".uv-index").text("UV Index: ");
      $(".uv-index").append(btnUV);
    });
};

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
        var currentDate = date;
        if ("15:00:00" == option && dateValue != currentDate) {
          iconArray.push(data.list[i].weather[0].icon);
          console.log(iconArray);
          tempArray
            .push((data.list[i].main.temp - 273.15) * 1.8 + 32)
            .toFixed(2);
          humidityArray.push(data.list[i].main.humidity);
        }
      }

      //$(".uv-index").text("UV Index: ");

      for (let i = 0; i < dateArray.length; i++) {
        var newDate = $("<h4>").text(dateArray[i]);
        $(".forecast" + [i]).append(newDate);

        var newImg = $("<img>");
        newImg.attr(
          "src",
          "https://api.openweathermap.org/img/wn/" + iconArray[i] + "@2x.png"
        );
        $(".forecast" + [i]).append(newImg);

        var newTemp = $("<p>").html("Temp: " + tempArray[i] + "&#176;F");
        $(".forecast" + [i]).append(newTemp);

        var newHumidity = $("<p>").html("Humidity: " + humidityArray[i] + "%");
        $(".forecast" + [i]).append(newHumidity);
      }
    });
}

// search button click 
$("#add-city").on("click", function(e) {
  e.preventDefault();

  var cityInput = $("#city-input").val().trim();
  var query = "https://api.openweathermap.org/data/2.5/weather?q=" +
  cityInput + "&appid=" + apikey;

  $.ajax({
    url: query,
    method: "GET",
  }).then(function (data) {
    //localCities.push(cityInput);
    //city = cityInput;
    $("#city-input, textarea").val(" ");
    getWeatherDetails();
  })
})






// $.ajax({
//   url: query2,
//   method: "GET",
// }).then(function(uvindex) {
//   //$(".uv-index").text("UV Index: " + weather.main.uvi);
//   console.log(uvindex);
// })

//get five day forcast and apply to page

// function getForcast(city) {
//   var queryURLFive = "https://api.openweathermap.org/data/2.5/forecast?q=" +
//   city +
//   "&appid=" +
//   APIKey;

//   $.ajax({
//     url: queryURLFive,
//     method: "GET"
//   }).then(function(weather) {
//     $(".forcast").text("City: " + weather.name);
// });

// console.log(weather);
