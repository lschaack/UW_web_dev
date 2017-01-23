<?php
#	Luke Schaack
#	CSE 154, Homework 7 (Remember The Cow) 
#	Section AL
#	Jonathan Shilling
#	Intermediary page which logs the user in if provided existing account info,
#	returns the user to the starting page if provided a known username and
#	incorrect password, or creates a new account for the user if provided entirely
#	new information.

include('common.php');
ensureLoggedOut();

session_start();
$name;
$password;

if (isset($_POST['name']) && isset($_POST['password'])) {
	$name = $_POST['name'];
	$password = $_POST['password'];
}

if (isset($_SESSION['name'])) {
	header('Location: todolist.php');
	# check if empty string is "false-y"
} else if ($name && $password) {
	$accounts = file('users.txt');
	checkProperInput($name, $password);
	$accountFound = false;
	foreach ($accounts as $account) {
		$accountInfo = explode(":", $account);
		list($accountName, $accountPass) = $accountInfo;
		$accountName = trim($accountName);
		$accountPass = trim($accountPass);
		
		if ($name == $accountName && $password == $accountPass) {
			$accountFound = true;
		} else if ($name == $accountName && $password != $accountPass) { // incorrect password
			header('Location: start.php');
			die();
		}
	}
	/*
	at this point, we know that the submitted username and password are well-formed
	but neither is in the file, so can automatically create a new user/password combo
	*/
	if (!$accountFound) {
		file_put_contents('users.txt', $name . ':' . $password . "\n", FILE_APPEND);
	}
	# create session
	$_SESSION['name'] = $name;
	$_SESSION['password'] = $password;
	setDate();
	header('Location: todolist.php');
} else {
	die('Invalid input - username or password not set:
		$name = ' . $name . ', $password = ' . $password);
}

# Kills the page if provided improper input, else gives detailed description of what went wrong
function checkProperInput($name, $password) {
	# check if username is alphanumeric, lowercase, and 3-8 characters long
	if (preg_match('/^[a-z0-9]{3,8}$/', $name) == 0 ||
		# check if password begins with number, ends with special char, and is 6-12 chars long
		preg_match('/^[0-9].{4,10}[^a-z0-9]$/i', $password) == 0) {
		die('Invalid input - username or password does not match specifications. You entered: "'
			. $name . ':' . $password . '" What we got from that was: "'
			. preg_match('/^[a-z0-9]{3,8}$/', $name) . ':'
			. preg_match('/^[0-9].{4,10}[^a-z0-9]$/i', $password)
			. '" (1:1 would have passed)');
	}
}

# Sets a cookie to store the exact time of a succesful login
function setDate() {
	date_default_timezone_set('America/Los_Angeles');
	$date = date("D y M d, g:i:s a");
	# set expire time to one week
	$expireTime = time() + 60*60*24*7;
	setcookie('date', $date, $expireTime);
}
?>