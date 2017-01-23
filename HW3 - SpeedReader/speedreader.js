/*
	Luke Schaack
	Section AL
	Functionality for speed-reading website--animates given text to display
	words individually at a user-selected WPM.
*/

// Encapsulates the entire program functionality.
(function() {
	"use strict";

	var input;
	var timer;
	var frameIndex;
	var frameDelay;

	// Sets variables and event listeners to initial values.
	window.onload = function() {
		document.getElementById("start").onclick = start;
		var stopButton = document.getElementById("stop");
		stopButton.onclick = stop;
		stopButton.disabled = true;
		stopButton.className = "disabled";
		document.getElementById("wpm").onclick = ensureWpm;
		// set all radio button behavior
		document.getElementById("medium").onclick = ensureFontSize;
		document.getElementById("big").onclick = ensureFontSize;
		document.getElementById("bigger").onclick = ensureFontSize;
		frameIndex = 0;
	};

	// Starts the animation from the beginning of the input text.
	function start() {
		var inputSpace = document.getElementById("input");
		input = inputSpace.value.split(/[ \t\n]+/);
		ensureWpm();
		ensureFontSize();
		switchEnabled();
		// ensure timer doesn't create multiple instances
		if (timer) {
			clearInterval(timer);
		}
		timer = setInterval(animate, frameDelay);
	}

	// Plays an individual frame of the animation each time this method
	// is called, stopping when there are no more words to display.
	function animate() {
		var output = document.getElementById("display");
		// ensure no attempted animation past the final index of input
		if (input[frameIndex] !== undefined) {
			var outputString = input[frameIndex];
			// if the string contains punctuation...
			if (outputString.search(/[.,!?;:]/) !== -1) {
				// get rid of the punctuation at the end
				var outputString = outputString.replace(/[.,!?;:]/, "");
				// insert second frame into array to double time displayed
				input.splice(frameIndex + 1, 0, outputString);
			}
			output.innerHTML = outputString;
			frameIndex++;
		} else {
			stop();
		}
	}

	// Stops the animation at the current frame and resets state.
	function stop() {
		clearInterval(timer);
		document.getElementById("display").innerHTML = "";
		// go back to beginning so it doesn't function as a pause button
		frameIndex = 0;
		switchEnabled();
	}

	// Ensures that the animation is displaying at the correct speed, based
	// on the chosen words per minute option.
	function ensureWpm() {
		var wpmSelect = document.getElementById("wpm");
		var wpm = wpmSelect.options[wpmSelect.selectedIndex].value;
		// test if it isn't already set correctly
		if (wpm !== frameDelay) {
			frameDelay = wpm;
			// restart if already going
			if (timer && !document.getElementById("stop").disabled) {
				clearInterval(timer);
				timer = setInterval(animate, frameDelay);
			}
		}
	}

	// Ensures that the displayed font is the correct size whenever a font
	// radio button is pushed.
	function ensureFontSize() {
		var medium = document.getElementById("medium");
		var big = document.getElementById("big");
		var output = document.getElementById("display");

		if (medium.checked) {
			output.className = "medium";
		} else if (big.checked) {
			output.className = "big";
		} else {
			output.className = "bigger";
		}
	}

	// Switches the start and stop buttons between enabled/disabled state,
	// which is always done simultaneously in this program.
	function switchEnabled() {
		var startButton = document.getElementById("start");
		var stopButton = document.getElementById("stop");
		// switch classes
		if (startButton.disabled) {
			startButton.className = "";
			stopButton.className = "disabled";
		} else {
			startButton.className = "disabled";
			stopButton.className = "";
		}
		// switch disabled property
		startButton.disabled = !startButton.disabled;
		stopButton.disabled = !stopButton.disabled;
	}
}());