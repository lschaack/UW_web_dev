/*
	Luke Schaack
	Section AL
	Creates a functional fifteen puzzle which can be shuffled using the provided button, and
	which tells the user if they have won.
*/

(function() {
	"use strict";
	// initial values for empty square as it will always be in the lower right corner at first
	var emptyRow = 3;
	var emptyCol = 3;
	var NUM_ROWS_COLS = 4;
	var TILE_WIDTH = 100;
	// for testing if the user won
	var isShuffling = false;

	// Sets the page at the proper initial state, creates the puzzleboard
	window.onload = function() {
		var puzzleArea = document.getElementById("puzzlearea");
		document.getElementById("shufflebutton").onclick = shuffle;

		for (var i = 0; i < 15; i++) {
			var piece = document.createElement("DIV");
			piece.onclick = slide;
			piece.onmouseover = styleValid;
			piece.onmouseout = unStyle;
			// set the displayed number to one greater than the index
			piece.innerHTML = i + 1 + "";
			puzzleArea.appendChild(piece);
			/** function which provides rows and columns by repeating 0-3 through the use of the % operator,
				multiplied by the width of a single tile to provide the needed pixel value **/
			var colPx = (i / 4) % 1 * 4 * TILE_WIDTH;
			// function which increments once every 4th value of i
			var rowPx = Math.floor(i / 4) * TILE_WIDTH;
			piece.style.top = rowPx + "px";
			piece.style.left = colPx + "px";
			piece.style.backgroundPosition = "-" + colPx + "px -" + rowPx + "px";
			piece.id = constructId(rowPx / TILE_WIDTH, colPx / TILE_WIDTH);
		}

		// for displaying the winning message
		document.getElementById("output").classList.add("winner");
	};

	// Add the valid move style to the tile it is called on
	function styleValid() {
		if (bordersEmpty(getRow(this), getCol(this))) {
			this.classList.add("validMove");
		}
	}

	// Removes the valid move style from the tile it is called on
	function unStyle() {
		this.classList.remove("validMove");
	}

	// Slides a single tile into the empty space if the tile borders that space
	function slide() {
		// grab the old tile row/col values to update position of the empty square
		var tileRow = parseInt(getComputedStyle(this).top) / TILE_WIDTH;
		var tileCol = parseInt(getComputedStyle(this).left) / TILE_WIDTH;
		
		if (bordersEmpty(tileRow, tileCol)) {
			// move the tile to its new position
			this.style.top = emptyRow * TILE_WIDTH + "px";
			this.style.left = emptyCol * TILE_WIDTH + "px";
			// update tile id to match location
			this.id = constructId(emptyRow, emptyCol);
			// update position of the empty square
			emptyRow = tileRow;
			emptyCol = tileCol;
			// if the user won, set the correct div value
			if (!isShuffling) {
				setWin();
			}
		}
	}

	// Returns whether a tile of a given row/col borders the empty space
	function bordersEmpty(row, col) {
		// if the tile is within 1 row to either side of empty
		if (Math.abs(row - emptyRow) === 1 && col === emptyCol) {
			return true;
		// else if the tile is within 1 column to either side of empty
		// could use || operator in single if statement, but the resultant line is super long
		} else if (Math.abs(col - emptyCol) === 1 && row === emptyRow) {
			return true;
		} else {
			return false;
		}
	}

	// Shuffles the playing board into a random (but solvable) state
	function shuffle() {
		isShuffling = true;
		/* ensure that the winning message is correctly not displayed in case the user
		   won immediately before shuffling */
		document.getElementById("output").innerHTML = "";
		for (var i = 0; i < 1000; i++) {
			var neighbors = [];
			// need -1 then 1 to check columns and rows next to empty square
			for (var j = -1; j < 2; j += 2) {
				// get the tiles at the rows and columns directly next to empty
				var rowNeighbor = getTileAt(emptyRow + j, emptyCol);
				var colNeighbor = getTileAt(emptyRow, emptyCol + j);
				// if each neighbor exists, include it in the array of possible switches
				if (rowNeighbor) {
					neighbors.push(rowNeighbor);
				}
				if (colNeighbor) {
					neighbors.push(colNeighbor);
				}
			}
			var nbrIndex = parseInt(Math.random() * neighbors.length);
			neighbors[nbrIndex].click();
		}
		isShuffling = false;
	}

	// Tests for winning conditions, returns true if the board is solved, false otherwise
	function isWon() {
		// assume true, test puzzle for out of place tile
		for (var i = 0; i < 15; i++) {
			// grab where tiles should be if puzzle is solved
			var row = Math.floor(i / 4);
			var col = (i / 4) % 1 * 4;
			var piece = getTileAt(row, col);
			// if the tile is empty or the number does not match what it should be, no win
			if (piece === null || (parseInt(piece.innerHTML)) !== (i + 1)) {
				return false;
			}
		}
		return true;
	}

	// Displays a winning message in the event of a win
	function setWin() {
		var winningMsg = document.getElementById("output");
		if (isWon()) {
			winningMsg.innerHTML = "Congratulations winner you won!";
		} else {
			winningMsg.innerHTML = "";
		}
	}

	// HELPER FUNCTIONS

	// fetches the tile at a given row/column
	function getTileAt(row, col) {
		return document.getElementById(constructId(row, col));
	}

	// returns the row of a given tile by dividing its pixel value by the width of one tile
	function getRow(tile) {
		return parseInt(getComputedStyle(tile).top) / TILE_WIDTH;
	}

	// returns the column of a given tile by dividing its pixel value by the width of one tile
	function getCol(tile) {
		return parseInt(getComputedStyle(tile).left) / TILE_WIDTH;
	}

	// constructs common id pattern square_row_col
	function constructId(row, col) {
		return ("square_" + row + "_" + col);
	}
})();