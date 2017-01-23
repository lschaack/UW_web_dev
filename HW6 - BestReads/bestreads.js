/*
	Luke Schaack
	CSE 154, Homework 6 (Book Review) 
	Section AL
	Jonathan Shilling
	Functionality for a website displaying covers, ratings, and reviews for
	a small selection of books.
*/

(function() {
	'use strict';

	// Sets the page to the proper initial state
	window.onload = function() {
		displayBooks();
		document.getElementById("back").onclick = displayBooks;
	};

	// Displays covers and titles for all books in a grid pattern, clickable for further info 
	function displayBooks() {
		document.getElementById('singlebook').style.display = 'none';
		// ensure proper behavior when back button is pressed several times
		document.getElementById('allbooks').innerHTML = '';
		fetch(websterURL('bestreads.php?mode=books'), loadBooks);
	}

	// Loads cover and title information for each book output by the corresponding web service
	function loadBooks() {
		var booksXML = this.responseXML;
		var books = booksXML.querySelectorAll('book');
		var allBooks = document.getElementById('allbooks');

		for (var i = 0; i < books.length; i++) {
			var book = books[i];
			var singleBook = document.createElement('div');
			var cover = document.createElement('img');
			var title = document.createElement('p');
			var folder = book.querySelector('folder').innerHTML;
			cover.setAttribute('alt', 'cover');
			cover.setAttribute('src', 'books/' + folder + '/cover.jpg');
			singleBook.appendChild(cover);
			// title of the book is always in the first child of book element
			title.innerHTML = book.firstChild.innerHTML;
			singleBook.appendChild(title);
			// store the folder as value for ease of access in displaySingleBook function
			singleBook.setAttribute('value', folder);
			allBooks.appendChild(singleBook);
			singleBook.onclick = displaySingleBook;
		}
	}

	// Displays detailed information for a single title when that book is clicked on
	function displaySingleBook() {
		// make sure this is right
		var folder = this.getAttribute('value');
		document.getElementById('allbooks').innerHTML = '';
		document.getElementById('cover').src = websterURL('books/' + folder + '/cover.jpg');
		loadSingleBook(folder);
	}

	// Loads detailed information for a single book, provided the folder name of that book
	function loadSingleBook(folder) {
		fetch(websterURL('bestreads.php?mode=info&title=' + folder), loadInfo);
		fetch(websterURL('bestreads.php?mode=description&title='+ folder), loadDescription);
		fetch(websterURL('bestreads.php?mode=reviews&title='+ folder), loadReviews);
	}

	// Loads title, author, and rating information for a single book
	function loadInfo() {
		var info = JSON.parse(this.responseText);
		document.getElementById('title').innerHTML = info.title;
		document.getElementById('author').innerHTML = info.author;
		document.getElementById('stars').innerHTML = info.stars;
	}

	// Loads the description for a single book
	function loadDescription() {
		document.getElementById('description').innerHTML = this.responseText;
	}

	// Loads all reviews (with author and rating information) for a single book
	function loadReviews() {
		var reviewSpace = document.getElementById('reviews');
		reviewSpace.innerHTML = this.responseText;
		// this goes here as it is the last thing to load
		document.getElementById('singlebook').style.display = 'block';
	}

	// helper functions
	// Fetches data at the provided URL and runs the provided function when loaded
	function fetch(url, onloadFunction) {
		var ajax = new XMLHttpRequest();
		ajax.onload = onloadFunction;
		ajax.open("GET", url, true);
		ajax.send();
	}

	// Creates a specific URL from a common base URL
	function websterURL(toAdd) {
		var base = 'https://webster.cs.washington.edu/students/lschaack/hw6/';
		return base + toAdd;
	}
})();