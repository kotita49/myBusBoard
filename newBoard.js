var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
var readlineSync = require('readline-sync')


function enterpc(){
    var postcode = prompt('Please enter a postcode ')
       if (postcode != null) {
            document.getElementById("g").innerHTML =
                "You entered " + postcode;
        }
        return postcode
    }
    //return postcode


function getdata(){
    var request = new XMLHttpRequest()
var postcode = enterpc()
var urlPostcode = `http://api.postcodes.io/postcodes/${postcode}`
request.open('GET', urlPostcode, true)
request.onload = function () {
  var postcodeResponse = JSON.parse(request.responseText)
 // console.log(Object.values(data)[1].longitude)
  const location = getLatLong(postcodeResponse)
  nearestBusstops(location)
}
request.send();
}

function getLatLong(data){
    return{
    "longitude": Object.values(data)[1].longitude,
    "latitude": Object.values(data)[1].latitude
    }
}
   
 function nearestBusstops(location){
var requestBus = new XMLHttpRequest()
var url = `http://transportapi.com/v3/uk/places.json?lat=${location.latitude}&lon=${location.longitude}&type=bus_stop&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`
var departureBoard = []
requestBus.open('GET', url, true)
requestBus.onload = function () {
  var stopResponse = JSON.parse(requestBus.responseText)
  const busStop1 = stopResponse.member[0].atcocode;
    const busStop2 = stopResponse.member[1].atcocode;
    document.getElementById("r").innerHTML = stopResponse.member[0].name
        printDepartures(busStop1)
        
    printDepartures(busStop2)
}
  
requestBus.send()
}

function printDepartures(atcocode){
    var requestDepartures = new XMLHttpRequest()
var urldep = `http://transportapi.com/v3/uk/bus/stop/${atcocode}/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`
var departureBoard = []
requestDepartures.open('GET', urldep, true)
requestDepartures.onload = function () {
  var depResponse = JSON.parse(requestDepartures.responseText)
  //console.log(depResponse);
 departureBoard = Object.values(depResponse.departures)
//   console.log(departureBoard)
    for (let i = 0; i < 6 || i < departureBoard.length; i++) {
      departureboard(departureBoard[i])
    }
  }
  requestDepartures.send()
}

function departureboard(item) {
  for (var key in item) {
    document.getElementById("p").innerHTML= item[key].mode 
    document.getElementById("s").innerHTML = item[key].line
    document.getElementById("t").innerHTML= ' direction: ' + item[key].direction
    document.getElementById("u").innerHTML= 'expected at: ' + item[key].expected_departure_time
    
  }
}
getdata();
//printDepartures("5710AWA11674")
//var url = 'http://transportapi.com/v3/uk/places.json?query=euston&type=train_station&app_id=f688f84f&app_key=400ac2716fc65182bb9d9c8eb75dcea8';
