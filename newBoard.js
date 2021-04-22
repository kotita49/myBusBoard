var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
var readlineSync = require('readline-sync')

function enterpc() {
  var postcode = prompt('Please enter a postcode ')
  const postcodeExpr = /^([A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])\ [0-9][ABD-HJLNP-UW-Z]{2}|(GIR\ 0AA)|(SAN\ TA1)|(BFPO\ (C\/O\ )?[0-9]{1,4})|((ASCN|BBND|[BFS]IQQ|PCRN|STHL|TDCU|TKCA)\ 1ZZ))$/i
  if (postcode != null) {
    document.getElementById('g').innerHTML = 'You entered ' + postcode;
    if (!postcodeExpr.test(postcode)) {
    alert('Invalid postcode format.Please try again. Postcodes must have a space in them.')
    throw 'Invalid postcode format'
  }
  var validRequest = new XMLHttpRequest()
  var validUrl = `http://api.postcodes.io/postcodes/${postcode}/validate`
  validRequest.open('GET', validUrl, true)
  validRequest.onload = function () {
    var response = JSON.parse(validRequest.responseText)
    var result = response.result
    if (!result) {
      alert('Invalid postcode. Please try again')
      throw 'Invalid postcode'
    }
  }
  validRequest.send()
  return postcode
}
}

function getdata() {
  var request = new XMLHttpRequest()
  var postcode = enterpc()
  var urlPostcode = `http://api.postcodes.io/postcodes/${postcode}`
  request.open('GET', urlPostcode, true)
  request.onload = function () {
    var postcodeResponse = JSON.parse(request.responseText)
   const location = getLatLong(postcodeResponse)
    nearestBusstops(location)
  }
  request.send()
}

function getLatLong(data) {
  return {
    longitude: Object.values(data)[1].longitude,
    latitude: Object.values(data)[1].latitude,
  }
}

function nearestBusstops(location) {
  var requestBus = new XMLHttpRequest()
  var url = `http://transportapi.com/v3/uk/places.json?lat=${location.latitude}&lon=${location.longitude}&type=bus_stop&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`
  var departureBoard = []
  requestBus.open('GET', url, true)
  requestBus.onload = function () {
    var stopResponse = JSON.parse(requestBus.responseText)
    const busStop1 = stopResponse.member[0].atcocode
    const busStop2 = stopResponse.member[1].atcocode
    document.getElementById('r').innerHTML = stopResponse.member[0].name
    printDepartures(busStop1)

    printDepartures(busStop2)
  }

  requestBus.send()
}

function printDepartures(atcocode) {
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
    document.getElementById('p').innerHTML = item[key].mode
    document.getElementById('s').innerHTML = item[key].line
    document.getElementById('t').innerHTML =
      ' direction: ' + item[key].direction
    document.getElementById('u').innerHTML =
      'expected at: ' + item[key].expected_departure_time
  }
}
getdata()

