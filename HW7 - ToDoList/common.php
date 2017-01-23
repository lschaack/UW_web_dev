<?php
#	Luke Schaack
#	CSE 154, Homework 7 (Remember The Cow) 
#	Section AL
#	Jonathan Shilling
#	Common functionality for all pages that form the Remember The Cow website

session_start();

# Returns a formatted file name provided a user's username
function todoFilename($name) {
	return 'todo_' . $name . '.txt';
}

# Ensures that there is an existing session with the current user, otherwise redirects
# to the login page
function ensureLoggedIn() {
	if (!isset($_SESSION['name']) || !isset($_SESSION['password'])) {
		header('Location: start.php');
	}
}

# Ensures that there is no existing session with the current user, otherwise redirects
# to the main website.
function ensureLoggedOut() {
	if (isset($_SESSION['name']) || isset($_SESSION['password'])) {
		header('Location: todolist.php');
	}
}
?>