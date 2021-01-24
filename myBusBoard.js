var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var readlineSync = require('readline-sync');

var busStop = readlineSync.question('Please enter a busstop code ');

var request = new XMLHttpRequest();

var response;
let departureBoard = [];

request.open('GET', 'http://transportapi.com/v3/uk/bus/stop/'+busStop+'/live.json?group=route&api_key=4dd9efb24627c91d1bf92753b50742a9&app_id=f688f84f', true)
request.onload = function () {
     response = JSON.parse(request.responseText);
    
    for(let busInfo in response.departures){
        departureBoard = departureBoard.concat(Object.values(response.departures[busInfo]));
        departureBoard.sort(function (a, b) {
            var keyA = a.expected_departure_time;
            var keyB = b.expected_departure_time;
            if(keyA<keyB) return -1;
            if(keyB<keyA) return 1;
            return 0;
            
        })
        
    }
    console.log(departureBoard.length);
for(let i=0; i<5; i++){
    console.log(departureBoard[i].line, departureBoard[i].aimed_departure_time, "Expected:", departureBoard[i].expected_departure_time, departureBoard[i].direction)
}

    // function printDepartureInfo(departure) {
    //     let depaturesArray = [departure.line, departure.aimed_departure_time, "Expected:", departure.expected_departure_time, departure.direction];
    //     console.log(depaturesArray.join(' '));
    // }

           
}

request.send()