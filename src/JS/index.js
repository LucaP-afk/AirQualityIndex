"use strict";
import 'jquery';
import '../CSS/styles.css';

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector('.autocom-box');
const token = process.env.API_KEY;
function myFunction() {
    const searchCityElement = document.getElementById('searchCity');
    searchCityElement.onkeyup = (event) => {
        searchCity(searchCityElement.value);
    };
}

function localization() {
    if(navigator.geolocation) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      function success(position) {
        document.getElementById('loader').style.display = 'block';
        var lat  = position.coords.latitude;
        var lng = position.coords.longitude;
        let url = 'https://api.waqi.info/feed/geo:' + lat + ';' + lng + '/?token=' + token;
        fetch(url, {
          method: 'GET',
        })
        .then(response => response.json())
        .then(function (response) {
         print(response);
         document.getElementById('loader').style.display = 'none';
        }) 
        .catch(err => console.log('Request Failed', err))
        }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    }
      navigator.geolocation.getCurrentPosition(success, error, options);
}

function searchCityData() {
    document.getElementById('totalResults').style.display = 'none';
    let city = document.getElementById('searchCity').value;
    var url = 'https://api.waqi.info/feed/' + city + '/?token=' + token;
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(function (response) {
        document.getElementById('totalResults').style.display = 'block';
      print(response);
      }
    )
    .catch(err => console.log('Request Failed', err))
    if(inputBox.value.length > 1) {
    document.getElementById('judgement').style.fontSize = '45px';
    };
    document.getElementById('searchCity').value = '';
    document.querySelector('.autocom-box').style.display = 'none';
}

function searchCity() {
    var url = 'https://api.waqi.info/search/?token=' + token + '&keyword=' + document.getElementById('searchCity').value;
    fetch(url, {
      method: 'GET',
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw 'Error'
        }
    })
    .then((jsonData) => {
        const results = jsonData.data.map(element => element.station.name);
        renderResults(results);
        document.getElementById('errorMessage').innerHTML = '';
    })
    .catch((error) => {
        document.getElementById('errorMessage').innerHTML = error;
        renderResults([]);
    });
}

function renderResults(results) {
    const list = document.querySelector('.autocom-box');
    document.querySelector('.autocom-box').style.display = 'block';
    list.innerHTML = '';
    results.forEach(result => {
      const element = document.createElement('li');
      element.innerText = result;
      list.appendChild(element);
      let allList = suggBox.querySelectorAll('li');
      for (let i = 0; i < allList.length; i++) {
          allList[i].setAttribute('onclick', 'select(this)');
      }
    });
  }

function select(element) {
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
    document.querySelector('.autocom-box').style.display = 'none';
}

function print(response) {
    var name = response.data.city.name;
    var pm25 = response.data.aqi ? response.data.aqi : '-';
    var temp = response.data.iaqi.t ? parseInt(response.data.iaqi.t.v) : '-';
    var h = response.data.iaqi.h ? parseInt(response.data.iaqi.h.v) : '-';
    var wind = response.data.iaqi.w ? response.data.iaqi.w.v : '-';
    var updated = response.data.time ? response.data.time.s : '-';

    document.getElementById('stationName').innerHTML = name;
    document.getElementById('updatedOn').innerHTML = 'Updated on ' + updated;
    document.getElementById('pm25').innerHTML = pm25;
    document.getElementById('aqiResults').innerHTML = 'PM<sub>25</sub> = ' + pm25 + '<br>Temp. = ' + temp + '°' + '<br>Humidity = ' + h + '<br>Wind = ' + wind;

    if (pm25 < 51) {
      document.getElementById('pm25').style.backgroundColor = '#33cc33';
      document.getElementById('judgement').innerHTML = 'Good';
    } else if (50 < pm25 && pm25 < 101) {
      document.getElementById('pm25').style.backgroundColor = 'rgb(255, 230, 0)';
      document.getElementById('judgement').innerHTML = 'Moderate';
    } else if (100 < pm25 && pm25 < 151) {
      document.getElementById('pm25').style.backgroundColor = 'rgb(230, 138, 51)';
      document.getElementById('judgement').innerHTML = 'Unhealthy for<br>Sensitive Groups';
      document.getElementById('judgement').style.fontSize = '30px';
    } else if (150 < pm25 && pm25 < 201) {
      document.getElementById('pm25').style.backgroundColor = 'rgb(202, 17, 17)';
      document.getElementById('judgement').innerHTML = 'Unhealthy';
    } else if (200 < pm25 && pm25 < 301) {
      document.getElementById('pm25').style.backgroundColor = 'rgb(114, 32, 114)';
      document.getElementById('judgement').innerHTML = 'Very Unhealthy';
    } else {
      document.getElementById('pm25').style.backgroundColor = 'rgb(109, 23, 23)';
      document.getElementById('judgement').innerHTML = 'Hazardous';
    }
}