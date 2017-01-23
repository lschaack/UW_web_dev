/*
	Luke Schaack
	CSE 154, Homework 5 (Weather) 
	Section AL
	Functionality for a web application capable of displaying the seven-day temperature 
	and precipitation forecast for a given city.
*/

(function() {
	"use strict";
	// for instant access to oneday temp values
	var temps = [];

	// Sets the page to the proper initial state and loads suggested city names.
	window.onload = function() {
		// populate the datalist of cities
		document.getElementById("loadingnames").style.display = "inline";
		populateCities();
		document.getElementById("search").onclick = fetchWeather;
		document.getElementById("temp").onclick = toggleDisplay;
		document.getElementById("precip").onclick = toggleDisplay;
		// set up the slider
		document.getElementById("slider").onchange = changeTemp;
	};

	// Fetches weather data from external web service, then loads the data received.
	function fetchWeather() {
		var city = document.getElementById("citiesinput").value;
		reset();
		fetch("https://webster.cs.washington.edu/cse154/weather.php?mode=oneday&city=" + city, loadDay);
		fetch("https://webster.cs.washington.edu/cse154/weather.php?mode=week&city=" + city, loadWeek);
		// make sure temp is displayed by default
		document.getElementById("temp").click();
		document.getElementById("resultsarea").style.display = "block";
	}

	// Formats city, date, and temperature data for a single day and injects data into webpage.
	function loadDay() {
		if (this.status == 200) {
			var xmlDoc = this.responseXML;
			var location = document.getElementById("location");
			// put the provided city name in the correct location
			var newCity = document.getElementById("city");
			newCity.innerHTML = xmlDoc.querySelector("name").textContent;
			newCity.classList.add("title");
			// put the date in the correct place
			var newDate = document.getElementById("date");
			newDate.innerHTML = Date();
			// put the description in the correct place
			var newDesc = document.getElementById("desc");
			newDesc.innerHTML = xmlDoc.querySelector("symbol").getAttribute("description");
			// finished loading
			document.getElementById("loadinglocation").style.display = "none";
			// put the temperature/slider at the right default value and in the correct place
			document.getElementById("slider").value = 0;
			var newTemp = document.getElementById("tempDisp");
			// input the rounded temperature provided by the xmlDoc
			newTemp.innerHTML = Math.round(xmlDoc.querySelector("temperature").textContent) + "&#8457";
			// store all the temps in one allowable global variable for later use
			var docTemps = xmlDoc.querySelectorAll("temperature");

			for (var i = 0; i < docTemps.length; i++) {
				// pass the rounded temperature to the array
				temps.push(Math.round(docTemps[i].textContent));
			}

			var precipArray = xmlDoc.querySelectorAll("clouds");
			loadPrecip(precipArray);
		} else {
			displayError(this.status);
		}
	}

	// Formats temperature and precipitation forecast for a week and injects data into webpage
	function loadWeek() {
		if (this.status == 200) {
			// fetch data
			var data = JSON.parse(this.responseText);
			var weather = data.weather;
			var forecast = document.getElementById("forecast");
			var imgRow = document.createElement("tr");
			var tmpRow = document.createElement("tr");
			// populate rows

			for (var i = 0; i < weather.length; i++) {
				var imgEntry = document.createElement("td");
				var tmpEntry = document.createElement("td");
				var img = document.createElement("img");
				// use the provided object array to set the correct icons for each image
				var icon = weather[i].icon;
				img.setAttribute("src", "https://openweathermap.org/img/w/" + icon + ".png");
				imgEntry.appendChild(img);
				// use the provided object array to set the correct temperatures for each entry
				tmpEntry.innerHTML = Math.round(weather[i].temperature) + "&#176";
				imgRow.appendChild(imgEntry);
				tmpRow.appendChild(tmpEntry);
			}

			forecast.appendChild(imgRow);
			forecast.appendChild(tmpRow);
			// finished loading
			document.getElementById("loadingforecast").style.display = "none";
		} else {
			displayError(this.status);
		}
	}

	// Formats precipitation forecast for a week and injects data into webpage
	function loadPrecip(precips) {
		var graph = document.getElementById("graph");
		var precipRow = document.createElement("tr");

		// populate rows (using i < 7 for days of the week, else returns 9 values)
		for (var i = 0; i < 7; i++) {
			var precipEntry = document.createElement("td");
			var precipDiv = document.createElement("div");
			var chance = precips[i].getAttribute("chance");
			precipEntry.appendChild(precipDiv);
			precipDiv.innerHTML = chance + "%";
			precipDiv.style.height = chance + "px";
			precipRow.appendChild(precipEntry);
		}

		graph.appendChild(precipRow);
		// finished loading
		document.getElementById("loadinggraph").style.display = "none";
	}

	// Displays a specific message for a given html error status code
	function displayError(error) {
		setLoadingDisp("none");
		var errorSpace = document.getElementById("errors");

		if (error == 410) {
			document.getElementById("nodata").style.display = "block";
			// hide buttons and slider for aesthetics
			document.getElementById("buttons").style.display = "none";
			document.getElementById("slider").style.display = "none";
		} else {
			var errorMsg = "Error " + error + ": ";

			// construct the message
			if ((parseInt(error / 100)) == 3) { // error in the 300s
				errorMsg += "[redirect] Hold on a minute, then give up if not resolved.";
			} else if ((parseInt(error / 100)) == 4) { // error in the 400s
				errorMsg += "[client error] Something terrible happened, and it's probably your fault.";
			} else { // error most likely in the 500s
				errorMsg += "[server error] Something terrible happened, but at least you had nothing to do with it.";
			}

			// print the message
			errorSpace.innerHTML = errorMsg;
		}
	}

	// Displays temperature data if called by "temp" button, precipitation data if called by "precip"
	function toggleDisplay() {
		var thisDisplay;
		var thatDisplay;

		if (this.innerHTML == "Temperature") {
			thisDisplay = document.getElementById("temps");
			thatDisplay = document.getElementById("graph");
		} else {
			thisDisplay = document.getElementById("graph");
			thatDisplay = document.getElementById("temps");
		}

		thisDisplay.style.display = "block";
		thatDisplay.style.display = "none";
	}

	// Changes the displayed temperature to the appropriate value based on slider settings
	function changeTemp() {
		// can assume that the slider is there
		var tempDisplay = document.getElementById("tempDisp");
		// get the temperature at the appropriate index
		var newTemp = temps[this.value / 3];
		tempDisplay.innerHTML = newTemp + "&#8457";
	}

	// Fetches data to populate the list of city names, makes window.onload function more readable
	function populateCities() {
		fetch("https://webster.cs.washington.edu/cse154/weather.php?mode=cities", displayCities);
		document.getElementById("loadingnames").style.display = "none";
	}

	// Populates the list of suggested city names
	function displayCities() {
		var cities = document.getElementById("cities");
		var citiesArray = this.responseText.split(/[\n]/);

		for (var i = 0; i < citiesArray.length; i++) {
			var currOption = document.createElement("option");
			currOption.innerHTML = citiesArray[i];
			cities.appendChild(currOption);
		}
	}

	// Resets the state of the web page for correct formatting when the Submit button is clicked
	function reset() {
		setLoadingDisp("block");
		var resetQueries = ["#location p", "#tempDisp", "#graph", "#forecast", "#errors"];
		
		for (var i = 0; i < resetQueries.length; i++) {
			var queryResult = document.querySelectorAll(resetQueries[i]);
			for (var j = 0; j < queryResult.length; j++) {
				queryResult[j].innerHTML = "";
			}
		}

		document.getElementById("nodata").style.display = "none";
		document.getElementById("buttons").style.display = "block";
		document.getElementById("slider").style.display = "block";
	}

	// Helper Functions:

	// Fetches data from a given url and performs a given function on loading said data
	function fetch(url, onloadFunction) {
		var ajax = new XMLHttpRequest();
		ajax.onload = onloadFunction;
		ajax.open("GET", url, true);
		ajax.send();
	}

	// Sets display property for all loading gifs (except "loadingnames") to the given value 
	function setLoadingDisp(displayToSet) {
		var loadings = document.querySelectorAll(".loading");

		// reset all but the first loading gif (first only when loading cities)
		for (var i = 1; i < loadings.length; i++) {
			loadings[i].style.display = displayToSet;
		}
	}
})();