var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest()
var readlineSync = require('readline-sync');

var atcocode = readlineSync.question("Please enter a busstop code ")
var url = `http://transportapi.com/v3/uk/bus/stop/${atcocode}/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;
var departureBoard = []
request.open('GET', url, true)

request.onload = function () {
    var data = JSON.parse(request.responseText);
     console.log(data.name);
     var array = Object.values(data.departures)
     for(let i = 0; i<6||i<array.length; i++){
         departureboard(array[i])
     }
     
}
function departureboard(item) {
        for (var key in item) {
        console.log(item[key].mode + " " + item[key].line + " direction: " +item[key].direction + " expected at: " + item[key].expected_departure_time)
    }
  }

request.send()
//var url = 'http://transportapi.com/v3/uk/places.json?query=euston&type=train_station&app_id=f688f84f&app_key=400ac2716fc65182bb9d9c8eb75dcea8';

