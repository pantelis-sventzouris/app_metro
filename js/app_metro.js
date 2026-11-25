
function goToGoogleMaps() {
    const lo = document.getElementById("longitude").value;
    const la = document.getElementById("latitude").value;
    window.location.href = `https://www.google.com/maps/?ll=${la},${lo}`;
    return;
  }

  function success(pos) {
    const crd = pos.coords;

    document.getElementById("latitude").value = crd.latitude;
    document.getElementById("longitude").value = crd.longitude;

    //console.log("Your current position is:");
    //console.log(`Latitude : ${crd.latitude}`);
    //console.log(`Longitude: ${crd.longitude}`);
    //console.log(`More or less ${crd.accuracy} meters.`);
  }

  function error(err) {
    alert(`ERROR(${err.code}): ${err.message}`);
  }    

  function getMyLocation() {

    const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);

}

function getNearestStationForAirport() {
    let long = document.getElementById("longitude").value;
    let lat = document.getElementById("latitude").value;

    if (long === "" || lat === "") {
      alert("Πατήστε πρώτα το πλήκτρο Χρήση τρέχουσας τοποθεσίας");
      return;
    }

        document.getElementById("result").innerHTML = "";		
      $.ajax({
          url:"https://localhost:3000/getNearestStationForAirport", 
          type: "get",    //request type,
          data: {lo: long, la: lat},
          success: function(result) {
            //console.log(result);
            //document.getElementById("result").innerHTML =
            //`Σταθμός: ${result[0].Literal} <br/> 
            //Γραμμή: ${result[0].LineId} <br/>
            //Επόμενο δρομολόγιο προς Αεροδρόμιο: ${result[0].AirportNextArrivalTime} <br/>
            //Απομένουν: ${result[0].TimeLeft} <br/>
            //Απόσταση σταθμού από την τρέχουσα τοποθεσία σας (σε χλμ.): ${result[0].DistanceKm} <br/> `;
            document.getElementById("station").innerHTML = result[0].Literal;
            document.getElementById("line").innerHTML = result[0].LineId;
            document.getElementById("nextArrival").innerHTML = result[0].AirportNextArrivalTime;
            document.getElementById("timeLeft").innerHTML = result[0].TimeLeft;
            document.getElementById("distanceKm").innerHTML = result[0].DistanceKm;
              
            //document.getElementById("result").style.color = "white";
              
            if (result[0].LineId === 3) {
              $("body").css("background-color", "blue");
              $("button").removeClass("green-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("blue-btn");
              $(".modal.fade").css("color", "blue");                
              return;
            }
          },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
      });
  }

  function getNearestStation() {
    let long = document.getElementById("longitude").value;
    let lat = document.getElementById("latitude").value;

    if (long === "" || lat === "") {
      alert("Πατήστε πρώτα το πλήκτρο Χρήση τρέχουσας τοποθεσίας");
      return;
    }

        document.getElementById("result").innerHTML = "";		
      $.ajax({
          url:"https://localhost:3000/getNearestStation",
          type: "get",    //request type,
          data: {lo: long, la: lat},
          success: function(result) {
            //console.log(result);
            //document.getElementById("result").innerHTML =
            //`Σταθμός: ${result[0].Literal} <br/> 
            // Γραμμή: ${result[0].LineId} <br/>
            //Απόσταση σταθμού από την τρέχουσα τοποθεσία σας (σε χλμ.): ${result[0].DistanceKm} <br/> `;
             document.getElementById("station2").innerHTML = result[0].Literal;
             document.getElementById("line2").innerHTML = result[0].LineId;
             document.getElementById("distanceKm2").innerHTML = result[0].DistanceKm;



             //document.getElementById("result").style.color = "white";
              
             if (result[0].LineId === 3) {
              $("body").css("background-color", "blue");  
              $("button").removeClass("green-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("blue-btn"); 
              $(".modal.fade").css("color", "blue");              
              return;
            }
            if (result[0].LineId === 2) {
              $("body").css("background-color", "red"); 
              $("button").removeClass("green-btn"); 
              $("button").removeClass("blue-btn"); 
              $("button").addClass("red-btn");
              $(".modal.fade").css("color", "red"); 
              return;
            }
            if (result[0].LineId === 1) {
              $("body").css("background-color", "green"); 
              $("button").removeClass("blue-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("green-btn");
              $(".modal.fade").css("color", "green"); 
              return;
            }				
          },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
      });
  }

  function getFirstAirportArrivalOfNearestStation() {
    let long = document.getElementById("longitude").value;
    let lat = document.getElementById("latitude").value;

    if (long === "" || lat === "") {
      alert("Πατήστε πρώτα το πλήκτρο Χρήση τρέχουσας τοποθεσίας");
      return;
    }

        document.getElementById("result").innerHTML = "";		
      $.ajax({
          url:"https://localhost:3000/getFirstAirportArrivalOfNearestStation",
          type: "get",    //request type,
          data: {lo: long, la: lat},
          success: function(result) {
            //console.log(result);            
            document.getElementById("result").innerHTML =
            `Σταθμός: ${result[0].Literal} <br/> 
             Γραμμή: ${result[0].LineId} <br/>
             Πρώτο δρομολόγιο προς Αεροδρόμιο: ${result[0].AirportFirstArrivalTime} <br/> `;
              
             document.getElementById("result").style.color = "white";
              
            if (result[0].LineId === 3) {
              $("body").css("background-color", "blue");  
              $("button").removeClass("green-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("blue-btn");
              $(".modal.fade").css("color", "blue");               
              return;
            }
          },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
      });
  }

  function getLastAirportArrivalOfNearestStation() {
    let long = document.getElementById("longitude").value;
    let lat = document.getElementById("latitude").value;

    if (long === "" || lat === "") {
      alert("Πατήστε πρώτα το πλήκτρο Χρήση τρέχουσας τοποθεσίας");
      return;
    }

        document.getElementById("result").innerHTML = "";		
      $.ajax({
          url:"https://localhost:3000/getLastAirportArrivalOfNearestStation",
          type: "get",    //request type,
          data: {lo: long, la: lat},
          success: function(result) {
            console.log(result);
                    document.getElementById("result").innerHTML =
            `Σταθμός: ${result[0].Literal} <br/> 
             Γραμμή: ${result[0].LineId} <br/>
             Τελευταίο δρομολόγιο προς Αεροδρόμιο: ${result[0].AirportFirstArrivalTime} <br/> `;
              
             document.getElementById("result").style.color = "white";
              
            if (result[0].LineId === 3) {
              $("body").css("background-color", "blue");  
              $("button").removeClass("green-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("blue-btn"); 
              $(".modal.fade").css("color", "blue");              
              return;
            }
          },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
      });
  }

  function getLocalArrivalsOfNearestStation() {
    let long = document.getElementById("longitude").value;
    let lat = document.getElementById("latitude").value;

    if (long === "" || lat === "") {
      alert("Πατήστε πρώτα το πλήκτρο Χρήση τρέχουσας τοποθεσίας");
      return;
    }

        document.getElementById("result").innerHTML = "";		
      $.ajax({
          url:"https://localhost:3000/getLocalArrivalsOfNearestStation",
          type: "get",    //request type,
          data: {lo: long, la: lat},
          success: function(result) {
            console.log(result);
                    document.getElementById("result").innerHTML =
            `Σταθμός: ${result.stationName} <br /> 
             Γραμμή: ${result.line} <br />
             Προς: ${result.destination1} <br />
             ${result.times1[0]}, ${result.times1[1]}, ${result.times1[2]} <br />
             Προς: ${result.destination2} <br />
             ${result.times2[0]}, ${result.times2[1]}, ${result.times2[2]} <br />
             
             `;
              
             document.getElementById("result").style.color = "white";

             if (result.line === 1) {
              $("body").css("background-color", "green"); 
              $("button").removeClass("blue-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("green-btn");    
              $(".modal.fade").css("color", "green");            
              return;
            }

            if (result.line === 2) {
              $("body").css("background-color", "red"); 
              $("button").removeClass("blue-btn"); 
              $("button").removeClass("green-btn"); 
              $("button").addClass("red-btn");         
              $(".modal.fade").css("color", "red");       
              return;
            }
              
            if (result.line === 3) {
              $("body").css("background-color", "blue");   
              $("button").removeClass("green-btn"); 
              $("button").removeClass("red-btn"); 
              $("button").addClass("blue-btn");     
              $(".modal.fade").css("color", "blue");         
              return;
            }
          },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
      });
  }

