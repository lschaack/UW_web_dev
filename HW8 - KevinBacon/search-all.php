<!DOCTYPE html>
<?php
#	Luke Schaack
#	CSE 154, Homework 8 (Kevin Bacon) 
#	Section AL
#	Jonathan Shilling
#	Display page for a list of every movie in which an actor has performed.

include('common.php');
displayHeader();
openBody();

$firstName;
$lastName;

if (isset($_GET['firstname']) && isset($_GET['lastname'])) {
	$firstName = $_GET['firstname'];
	$lastName = $_GET['lastname'];
} else {
	die('Invalid input: one or more variables not set');	
}

try {
	$db = new PDO('mysql:dbname=imdb;host=localhost;charset=utf8', 'lschaack', 'ro4OHhFI6c');
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$id = grabActorId($firstName, $lastName);
	# only execute the following if actor id was properly received
	if ($id) {
		$movies = $db->query("SELECT m.name, m.year
							FROM actors a
							JOIN roles r ON r.actor_id = a.id
							JOIN movies m ON m.id = r.movie_id 
							WHERE a.id = $id
							ORDER BY m.year DESC, m.name ASC;");
		$caption = "All films for $firstName $lastName";
		generateTable($movies, $caption);
	}
} catch (PDOException $ex) {
	?>
	<p>Sorry, a database error occurred.</p>
	<p>(Error details: <?= $ex->getMessage() ?>)</p>
	<?php
}

closeBody();
?>