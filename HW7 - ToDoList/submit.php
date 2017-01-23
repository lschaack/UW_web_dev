<?php
#	Luke Schaack
#	CSE 154, Homework 7 (Remember The Cow) 
#	Section AL
#	Jonathan Shilling
#	Intermediary page which updates a todo list stored as an array within a unique
#	text file for every user. Capable of adding and deleting items from provided
#	indeces in the array.

include('common.php');
ensureLoggedIn();

$action;
$item;
$index;
# know from above that user is logged in
$filename = todoFilename($_SESSION['name']);

if (!file_exists($filename)) {
	fopen($filename, 'w');
}
$todo = file($filename);

if (isset($_POST['action'])) {
	$action = $_POST['action'];
} else {
	die('Invalid input: variable "action" not set.');
}

if ($action == 'add') {
	if (isset($_POST['item'])) {
		$item = $_POST['item'];
	} else {
		die('Invalid input: variable "item" not set.');
	}

	array_push($todo, $item . "\n");
} else if ($action == 'delete') {
	if (isset($_POST['index'])
		# check that index is an integer
		&& preg_match('/^[0-9]+$/', $_POST['index'])
		&& $_POST['index'] < count($todo)) {
		$index = $_POST['index'];
	} else {
		die('Invalid input: index not set or set improperly: index = ' . $_POST['index']);
	}
	# deletes at index
	array_splice($todo, $index, 1);
} else {
	die('Invalid input: variable "action" not set to valid value.');
}

# save file
file_put_contents($filename, $todo);
header('Location: todolist.php');
?>