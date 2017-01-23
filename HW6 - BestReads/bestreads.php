<?php
#	Luke Schaack
#	CSE 154, Homework 6 (Book Review) 
#	Section AL
#	Jonathan Shilling
#	Web service capable of outputting title, author, rating, and review information
#	for a selection of books provided in a local "books/" directory

$mode = $_GET['mode'];

if ($mode != 'books') {
	$title = $_GET['title'];

	if ($mode == 'info') {
		header('Content-type: application/json');
		$data = makeInfoArray('books/' . $title . '/info.txt');
		print json_encode($data);
	} else if ($mode == 'description') {
		header('Content-type: text/plain');
		// prints the entire contents of the description
		print file_get_contents('books/' . $title . '/description.txt');
	} else { // ($mode == 'reviews')
		header('Content-type: text/html');
		$reviews = glob('books/' . $title . '/review*.txt');

		foreach ($reviews as $review) {
			$info = file($review);
			list($author, $stars, $reviewText) = $info;
			?>

			<h3><?= $author ?> <span><?= $stars ?></span></h3>
			<p><?= $reviewText ?></p>

			<?php
		}
	}
} else { // ($mode == 'books')
	header('Content-type: text/xml');
	$xmldoc = new DOMDocument();
	$books = glob('books/*');
	$books_tag = $xmldoc->createElement('books');
	$xmldoc->appendChild($books_tag);
	foreach ($books as $book) {
		// grab the info file
		$info = makeInfoArray($book . '/info.txt');
		$book_tag = $xmldoc->createElement('book');
		$title_tag = $xmldoc->createElement('title');
		$folder_tag = $xmldoc->createElement('folder');
		// title is always in a known spot in this array
		$title = $info['title'];
		$title_tag->nodeValue = $title;
		// edit $book to remove "books/"
		$folder_tag->nodeValue = str_replace('books/', '', $book);
		$book_tag->appendChild($title_tag);
		$book_tag->appendChild($folder_tag);
		$books_tag->appendChild($book_tag);
	}

	print $xmldoc->saveXML();
}

# helper functions
function makeInfoArray($url) {
	$info = file($url);
	list($title, $author, $stars) = $info;
	$data = array(
		"title" => $title,
		"author" => $author,
		"stars" => $stars,
	);
	return $data;
}
?>