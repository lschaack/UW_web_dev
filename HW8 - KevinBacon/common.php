<?php
#	Luke Schaack
#	CSE 154, Homework 8 (Kevin Bacon) 
#	Section AL
#	Jonathan Shilling
#	Common structure and functionality for every page in the MyMDB website.

# Returns the database id for an actor of the exact provided last name and approximate
# provided first name, or prints an error message and returns null if not found.
function grabActorId($firstName, $lastName) {
	try {
		$db = new PDO('mysql:dbname=imdb;host=localhost;charset=utf8', 'lschaack', 'ro4OHhFI6c');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$firstNameSQL = $db->quote($firstName . '%'); # add wildcard for proper ID results
		$lastNameSQL = $db->quote($lastName);
		$idRow = $db->query("SELECT a.id
							FROM actors a
							WHERE a.last_name = $lastNameSQL
							AND a.first_name LIKE $firstNameSQL
							ORDER BY a.film_count DESC, a.id ASC
							LIMIT 1;");
		if ($idRow->rowCount() > 0) {
			# refine the single-row PDO object returned to an associative array of that row
			$idRow = $idRow->fetch();
			# use the PDOObject to properly quote the id column of associative array
			return $db->quote($idRow['id']);
		} else {
			?>
			<p>Actor <?=$firstName . ' ' . $lastName?> was not found.</p>
			<?php
			return null;
		}
	} catch (PDOException $ex) {
		?>
		<p>Sorry, a database error occurred.</p>
		<p>(Error details: <?= $ex->getMessage() ?>)</p>
		<?php
	}
}

# Displays the header common to all MyMDB pages
function displayHeader() {
	?>
<html>
<head>
	<title>My Movie Database (MyMDb)</title>
	<meta charset="utf-8" />
	<link href="https://webster.cs.washington.edu/images/kevinbacon/favicon.png" type="image/png" rel="shortcut icon" />

	<!-- Link to your CSS file that you should edit -->
	<link href="bacon.css" type="text/css" rel="stylesheet" />
</head>
	<?php
}

# Opens the body and main sections of a MyMDB page, diplays the banner common to all pages
function openBody() {
	?>
<body>
	<div id="frame">
		<div id="banner">
			<!-- used to keep proper spacing without horizontal scrollbar -->
			<div class="container">
				<a href="mymdb.php"><img src="https://webster.cs.washington.edu/images/kevinbacon/mymdb.png" alt="banner logo" /></a>
				<p>My Movie Database</p>
			</div>
		</div>

		<div id="main">
	<?php
}

# Adds footer and closes the main div and body
function closeBody() {
	?>
			<!-- form to search for every movie by a given actor -->
			<form action="search-all.php" method="get">
				<fieldset>
					<legend>All movies</legend>
					<div>
						<input name="firstname" type="text" size="12" placeholder="first name" /> 
						<input name="lastname" type="text" size="12" placeholder="last name" /> 
						<input type="submit" value="go" />
					</div>
				</fieldset>
			</form>

			<!-- form to search for movies where a given actor was with Kevin Bacon -->
			<form action="search-kevin.php" method="get">
				<fieldset>
					<legend>Movies with Kevin Bacon</legend>
					<div>
						<input name="firstname" type="text" size="12" placeholder="first name" /> 
						<input name="lastname" type="text" size="12" placeholder="last name" /> 
						<input type="submit" value="go" />
					</div>
				</fieldset>
			</form>
		</div> <!-- end of #main div -->
	
		<div id="w3c">
			<!-- used to keep proper spacing without horizontal scrollbar -->
			<div class="container">
				<a href="https://webster.cs.washington.edu/validate-html.php"><img alt="HTML Validator" src="https://webster.cs.washington.edu/images/w3c-html.png" alt="Valid HTML5" /></a>
				<a href="https://webster.cs.washington.edu/validate-css.php"><img alt="CSS Validator" src="https://webster.cs.washington.edu/images/w3c-css.png" alt="Valid CSS" /></a>
			</div>
		</div>
	</div> <!-- end of #frame div -->
</body>
</html>
	<?php
}

# Generates a table with title and year columns provided PDOStatement object
# with those columns, including a provided caption above the table.
function generateTable($movies, $caption) {
	?>
	<h1 class="descriptor">Results:</h1>
	<table>
		<caption><?=$caption?></caption>
		<tr><th>#</th><th>Title</th><th>Year</th></tr>
	<?php
	$i = 1;
	foreach ($movies as $movie) {
		list($title, $year) = $movie;
	?>
		<tr><td><?=$i?></td><td><?=$title?></td><td><?=$year?></td></tr>
	<?php
		$i++;
	}
	?>
	</table>
	<?php
}
?>