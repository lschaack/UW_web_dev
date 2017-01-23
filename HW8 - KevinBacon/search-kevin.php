<!DOCTYPE html>
<?php
#	Luke Schaack
#	CSE 154, Homework 8 (Kevin Bacon) 
#	Section AL
#	Jonathan Shilling
#	Display page for a list of every movie in which an actor has performed alongside
#	Kevin Bacon.

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
	$idBacon = grabActorId('Kevin', 'Bacon');
	$id = grabActorId($firstName, $lastName);
	# only execute the following if actor id was properly received
	if ($id) {
		$movies = $db->query("SELECT m.name, m.year
							FROM roles r1
							JOIN roles r2 ON r2.movie_id = r1.movie_id
							JOIN movies m ON m.id = r2.movie_id
							WHERE r1.actor_id = $idBacon
							AND r2.actor_id = $id
							ORDER BY m.year DESC, m.name ASC;
							");

		if ($movies->rowCount() > 0) {
			$caption = "The first degree of Kevin Bacon for $firstName $lastName";
			generateTable($movies, $caption);
		} else {
			?>
			<p>Sorry, it looks like <?=$firstName . ' ' . $lastName?> wasn't in any films with Kevin Bacon.</p>
			<?php
		}
	}
} catch (PDOException $ex) {
	?>
	<p>Sorry, a database error occurred.</p>
	<p>(Error details: <?= $ex->getMessage() ?>)</p>
	<?php
}

closeBody();
?>