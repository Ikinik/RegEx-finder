<?php
error_reporting(E_ALL | E_STRICT);
ini_set('error_reporting', E_ALL | E_STRICT);
ini_set('display_errors',1);
ini_set('allow_url_fopen',1);

require_once(__DIR__ . "/html2text.php");
$output["result"] = false;
if(isset($_GET["page"]) && !empty($_GET["page"])){
	try{
		$url = urldecode($_GET["page"]);
		$pageContent = file_get_contents($url);
		//$pageContent = "<!DOCTYPE html><html><head><title>Page Title</title></head><body><h1>This is a Heading</h1><p>This is a paragraph.</p></body></html>";
		
		$text = Html2Text\Html2Text::convert($pageContent);
		$output["text"] = $text;
		$output["result"] = true;
	}catch(Exception $e){
		$output["result"] = false;
	}
}
echo json_encode($output);