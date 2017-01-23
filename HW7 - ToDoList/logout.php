<?php
#	Luke Schaack
#	CSE 154, Homework 7 (Remember The Cow) 
#	Section AL
#	Jonathan Shilling
#	Intermediary page exclusively used to destroy the login session of a user

include('common.php');
ensureLoggedIn();
session_destroy();
session_regenerate_id(TRUE);
header('Location: start.php');
?>