const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const PORT = 3000;
const options = {
  key: fs.readFileSync('/home/pi/privatekey.pem'),
  cert: fs.readFileSync('/home/pi/certificate.pem')
};

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('/home/pi/app_metro'));

const secureServer = https.createServer(options, app);

app.use((request, response, next) => {

  // Website you wish to allow to connect
  response.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  response.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});



secureServer.listen(PORT, () => {
	console.log("Server listening on HTTPS port: ", PORT);
});


app.get("/status", (request, response) => {
		const status = {
			"Status": "Running"
		};
		
		response.send(status);

});

app.get("/getNearestStationForAirport", (request, response) => {
  const lo = request.query.lo;
  const la = request.query.la;

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "metro_airport"
  });

  //ROUND(0.164, 2)

  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");  
    const sqlQuery = `SELECT Station.LineId, Station.Literal, AirportArrival.Time AS AirportNextArrivalTime, ROUND(SQRT(POW(69.1 * (Station.Latitude - ${la} ), 2) + POW(69.1 * (Station.Longitude - ${lo}) * COS(Station.Latitude / 57.3), 2)), 2) AS DistanceMiles, ROUND(SQRT(POW(69.1 * (Station.Latitude - ${la} ), 2) + POW(69.1 * (Station.Longitude - ${lo}) * COS(Station.Latitude / 57.3), 2)) * 1.609344, 2) AS DistanceKm, SUBTIME(AirportArrival.Time, CURRENT_TIME) AS TimeLeft FROM Station INNER JOIN AirportArrival ON Station.Id = AirportArrival.StationId WHERE AirportArrival.Destination = 0 AND Time > CURRENT_TIME GROUP BY Latitude, Longitude ORDER BY DistanceKm LIMIT 1`;
    con.query(sqlQuery, (err, result) => {
      if (err) throw err;
      console.log(result);
      response.send(result);

  });
  
});
});

app.get("/getNearestStation", (request, response) => {
  const lo = request.query.lo;
  const la = request.query.la;

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "metro_airport"
  });

  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");  
    const sqlQuery = `SELECT LineId, Latitude, Longitude, Literal, Id, ROUND(SQRT(POW(69.1 * (Latitude - ${la} ), 2) + POW(69.1 * (Longitude - ${lo}) * COS(Latitude / 57.3), 2)) * 1.609344, 2) AS DistanceKm FROM Station GROUP BY Latitude, Longitude ORDER BY DistanceKm LIMIT 1`;
    con.query(sqlQuery, (err, result) => {
      if (err) throw err;
      console.log(result);
      response.send(result);

  });
  
});
});

app.get("/getFirstAirportArrivalOfNearestStation", (request, response) => {
  const lo = request.query.lo;
  const la = request.query.la;

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "metro_airport"
  });

  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");  
    const sqlQuery1 = `SELECT Station.LineId, Station.Latitude, Station.Longitude, Station.Literal, SQRT( POW(69.1 * (Station.Latitude - ${la} ), 2) + POW(69.1 * (Station.Longitude - ${lo}) * COS(Station.Latitude / 57.3), 2)) * 1.609344 AS DistanceKm FROM Station INNER JOIN AirportArrival ON Station.Id = AirportArrival.StationId GROUP BY Station.Latitude, Station.Longitude ORDER BY DistanceKm LIMIT 1`;
    con.query(sqlQuery1, (err1, result1) => {
      if (err1) throw err1;
      const sqlQuery2 = `SELECT AirportArrival.Time As AirportFirstArrivalTime, Station.Literal, Station.LineId FROM AirportArrival INNER JOIN Station ON AirportArrival.StationId = Station.Id WHERE Station.Literal = '${result1[0].Literal}' AND AirportArrival.Destination = 0 ORDER BY AirportArrival.AA ASC LIMIT 1`;
      con.query(sqlQuery2, (err2, result2) => {
        if (err2) throw err2;
        response.send(result2);
      }); 
  });
  
});
});

app.get("/getLastAirportArrivalOfNearestStation", (request, response) => {
  const lo = request.query.lo;
  const la = request.query.la;

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "metro_airport"
  });

  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");  
    const sqlQuery1 = `SELECT Station.LineId, Station.Latitude, Station.Longitude, Station.Literal, SQRT( POW(69.1 * (Station.Latitude - ${la} ), 2) + POW(69.1 * (Station.Longitude - ${lo}) * COS(Station.Latitude / 57.3), 2)) * 1.609344 AS DistanceKm FROM Station INNER JOIN AirportArrival ON Station.Id = AirportArrival.StationId GROUP BY Station.Latitude, Station.Longitude ORDER BY DistanceKm LIMIT 1`;
    con.query(sqlQuery1, (err1, result1) => {
      if (err1) throw err1;
      const sqlQuery2 = `SELECT AirportArrival.Time As AirportFirstArrivalTime, Station.Literal, Station.LineId FROM AirportArrival INNER JOIN Station ON AirportArrival.StationId = Station.Id WHERE Station.Literal = '${result1[0].Literal}' AND AirportArrival.Destination = 0 ORDER BY AirportArrival.AA DESC LIMIT 1`;
      con.query(sqlQuery2, (err2, result2) => {
        if (err2) throw err2;
        response.send(result2);
      }); 
  });
  
});
});

app.get("/getLocalArrivalsOfNearestStation", (request, response) => {
  const lo = request.query.lo;
  const la = request.query.la;

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "metro_airport"
  });

  con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");  
    const sqlQuery1 = `SELECT Station.LineId, Station.Literal, Station.Id, Station.Destination1, Station.Destination2, SQRT( POW(69.1 * (Station.Latitude - ${la} ), 2) + POW(69.1 * (Station.Longitude - ${lo}) * COS(Station.Latitude / 57.3), 2)) * 1.609344 AS DistanceKm FROM Station GROUP BY Station.Latitude, Station.Longitude ORDER BY DistanceKm LIMIT 1`;
    con.query(sqlQuery1, (err1, result1) => {
      if (err1) throw err1;

      const destination1 = result1[0].Destination1;
      const destination2 = result1[0].Destination2;
      const stationId = result1[0].Id;
      const lineId = result1[0].LineId;
      const stationLiteral = result1[0].Literal;
      let typ = 0;

      const now = new Date();
      const day = now.getDay(); // returns a number representing the day of the week, starting with 0 for Sunday

      switch(lineId){
        case 1:
          switch(day){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              typ = 0;
              break;
            
            case 0:
            case 6:
              typ = 1;
              break;
          }
          break;

          case 2:
            switch(day){
              case 1:
              case 2:
              case 3:
              case 4:
                typ = 2;
                break;

              case 5:
                typ = 3;
                break;
              
              case 6:
                typ = 4;
                break;

              case 0:
                typ = 5;
                break;              
            }
            break;

            case 3:
            switch(day){
              case 1:
              case 2:
              case 3:
              case 4:
                typ = 6;
                break;

              case 5:
                typ = 7;
                break;
              
              case 6:
                typ = 8;
                break;

              case 0:
                typ = 9;
                break;              
            }
            break;
      }

      const sqlQuery2 = `SELECT * FROM Timetable WHERE StationId = ${stationId} And Type = ${typ} AND Destination = ${destination1} AND Time >= CURRENT_TIME ORDER BY Time LIMIT 3`;
      con.query(sqlQuery2, (err2, result2) => {
        if (err2) throw err2;
        const destination1Times = [];
        destination1Times.push(result2[0].Time);
        destination1Times.push(result2[1].Time);
        destination1Times.push(result2[2].Time);
      
        const sqlQuery4 = `SELECT * FROM Timetable WHERE StationId = ${stationId} And Type = ${typ} AND Destination = ${destination2} AND Time >= CURRENT_TIME ORDER BY Time LIMIT 3`;
        con.query(sqlQuery4, (err4, result4) => {
          if (err4) throw err4;
          const destination2Times = [];
          destination2Times.push(result4[0].Time);
          destination2Times.push(result4[1].Time);
          destination2Times.push(result4[2].Time);

          
        const sqlQuery3 = `SELECT Literal FROM Station WHERE Id IN (${destination1}, ${destination2}) ORDER BY Id`;
        
        con.query(sqlQuery3, (err3, result3) => {
          if (err3) throw err3;
          const destination1Lit = result3[0].Literal;
          const destination2Lit = result3[1].Literal;

          const resultSet = {};
          resultSet.stationName = stationLiteral;
          resultSet.line = lineId;
          resultSet.destination1 = destination1Lit;
          resultSet.destination2 = destination2Lit;
          resultSet.times1 = [];
          resultSet.times1 = destination1Times;
          resultSet.times2 = [];
          resultSet.times2 = destination2Times;
          response.send(resultSet);

        });

        });



      }); 
  });
  
});
});









