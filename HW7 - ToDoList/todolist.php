<!DOCTYPE html>
<?php
#	Luke Schaack
#	CSE 154, Homework 7 (Remember The Cow) 
#	Section AL
#	Jonathan Shilling
#	Functional page for a website which keeps a persisten todo list for a given user
#	account--the user can add or delete any necessary reminder, log out indefinitely,
#	and return to see the same list.

include('common.php');
ensureLoggedIn();
# since we know the user is logged in, can directly set name & password
session_start();
$name = $_SESSION['name'];
$password = $_SESSION['password'];
$todo;

# generate the proper filename from the given username
$fileName = todoFilename($name);
if (file_exists($fileName)) {
	$todo = file($fileName);
}
?>

<html>
	<head>
		<meta charset="utf-8" />
		<title>Remember the Cow</title>
		<link href="https://webster.cs.washington.edu/css/cow-provided.css" type="text/css" rel="stylesheet" />
		<link href="cow.css" type="text/css" rel="stylesheet" />
		<link href="https://webster.cs.washington.edu/images/todolist/favicon.ico" type="image/ico" rel="shortcut icon" />
	</head>

	<body>
		<div class="headfoot">
			<h1>
				<img src="https://webster.cs.washington.edu/images/todolist/logo.gif" alt="logo" />
				Remember<br />the Cow
			</h1>
		</div>

		<div id="main">
			<h2><?= $name ?>'s To-Do List</h2>

			<ul id="todolist">
				<?php
					# count() will conveniently return 0 if a variable is not set
					for ($i = 0; $i < count($todo); $i++) {
				?>
				<li>
					<form action="submit.php" method="post">
						<input type="hidden" name="action" value="delete" />
						<input type="hidden" name="index" value=<?= '"' . $i . '"' ?> />
						<input type="submit" value="Delete" />
					</form>
					<?= htmlspecialchars($todo[$i]) ?>
				</li>
				<?php
					}
				?>
				<li>
					<form action="submit.php" method="post">
						<input type="hidden" name="action" value="add" />
						<input name="item" type="text" size="25" autofocus="autofocus" />
						<input type="submit" value="Add" />
					</form>
				</li>
			</ul>

			<div>
				<a href="logout.php"><strong>Log Out</strong></a>
				<em>(logged in since <?= $_COOKIE['date'] ?>)</em>
			</div>

		</div>

		<div class="headfoot">
			<p>
				&quot;Remember The Cow is nice, but it's a total copy of another site.&quot; - PCWorld<br />
				All pages and content &copy; Copyright CowPie Inc.
			</p>

			<div id="w3c">
				<a href="https://webster.cs.washington.edu/validate-html.php">
					<img src="https://webster.cs.washington.edu/images/w3c-html.png" alt="Valid HTML" /></a>
				<a href="https://webster.cs.washington.edu/validate-css.php">
					<img src="https://webster.cs.washington.edu/images/w3c-css.png" alt="Valid CSS" /></a>
			</div>
		</div>
	</body>
</html>
