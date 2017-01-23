<!DOCTYPE html>
<?php
#	Luke Schaack
#	CSE 154, Homework 8 (Kevin Bacon) 
#	Section AL
#	Jonathan Shilling
#	Home page for a website which queries the IMDB database to provide a list of
#	either every movie in which an actor has performed, or a list of every movie
#	in which an actor has performed alongside Kevin Bacon.

include('common.php');
displayHeader();
openBody();
?>
	<div id="uppermain" class="descriptor">
		<h1>The One Degree of Kevin Bacon</h1>
		<p>Type in an actor's name to see if he/she was ever in a movie with Kevin Bacon!</p>
	</div>

	<p><img id="bacon" src="https://webster.cs.washington.edu/images/kevinbacon/kevin_bacon.jpg" alt="Kevin Bacon" /></p>
<?php
closeBody();
?>
