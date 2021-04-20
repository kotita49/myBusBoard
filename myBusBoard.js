var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;``
var readlineSync = require('readline-sync');

var postcode;
const postcodeExpr = /^([A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])\ [0-9][ABD-HJLNP-UW-Z]{2}|(GIR\ 0AA)|(SAN\ TA1)|(BFPO\ (C\/O\ )?[0-9]{1,4})|((ASCN|BBND|[BFS]IQQ|PCRN|STHL|TDCU|TKCA)\ 1ZZ))$/i;
try {
    postcode = readlineSync.question('Please enter a postcode ');

    // also do a get request to check validity
    if (!postcodeExpr.test(postcode)) {
        throw 'Invalid postcode format';
    } else {
        checkPostcodeValid(postcode);
    }      
}
catch (err)
{
    postcode = null;
    console.log("Invalid postcode. Please try again. Postcodes must have a space in them.");
    throw err;
}

function checkPostcodeValid(postcode) {
    var validRequest = new XMLHttpRequest();
    var validUrl = `http://api.postcodes.io/postcodes/${postcode}/validate`;
    validRequest.open('GET', validUrl, true);
    validRequest.onload = function () {
        var response = JSON.parse(validRequest.responseText);
        var result = response.result;
        
        if (!result) {
            throw 'Invalid postcode';
        } 
    }
    validRequest.send();
}

function extractLatLong(x){
return {
    "latitude": x.result.latitude,
    "longitude": x.result.longitude
}
}

function printDepartures(atcocode){
    var departureBoard = [];
    var request = new XMLHttpRequest();
    var url = `http://transportapi.com/v3/uk/bus/stop/${atcocode}/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;
request.open('GET',url, true)
request.onload = function () {
    var response = JSON.parse(request.responseText);
    
    for(let busInfo in response.departures){
        departureBoard = departureBoard.concat(Object.values(response.departures[busInfo]));
        departureBoard.sort(function (a, b) {
            var keyA = a.expected_departure_time;
            var keyB = b.expected_departure_time;
            if(keyA<keyB) return -1;
            if(keyB<keyA) return 1;
            return 0;
            
        })
        
        console.log('\n');
        console.log(response.name);
        if (departureBoard.length ==0) {
            console.log('No upcoming departures');
        } else {
            let i = 0;
            while (i < departureBoard.length && i < 5) {
                console.log(departureBoard[i].line, departureBoard[i].direction, departureBoard[i].expected_departure_time);
                i++;
            }
        }

}
}
request.send()
}

function findNearestStops(location){

var stopRequest = new XMLHttpRequest();
var postcodeurl = `http://transportapi.com/v3/uk/places.json?lat=${location.latitude}&lon=${location.longitude}&type=bus_stop&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;
stopRequest.open('GET',postcodeurl, true)
stopRequest.onload = function () {
    var stopResponse = JSON.parse(stopRequest.responseText);
    const busStop1 = stopResponse.member[0].atcocode;
    const busStop2 = stopResponse.member[1].atcocode;
printDepartures(busStop1);
printDepartures(busStop2);
    
}
stopRequest.send();

}
           
var postcodeRequest = new XMLHttpRequest();
postcodeRequest.open('GET', 'http://api.postcodes.io/postcodes/'+postcode, true)
postcodeRequest.onload = function () {
     const postcodeResponse = JSON.parse(postcodeRequest.responseText);
     const location = extractLatLong(postcodeResponse);
     findNearestStops(location);                             
     }
     
postcodeRequest.send();


