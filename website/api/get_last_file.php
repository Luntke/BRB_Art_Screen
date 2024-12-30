<?php
//Disable Caching of the document.
//Source: https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers#answer-2068407
header("Cache-Control: no-store, must-revalidate");//HTTP 1.1.
header("Expires: 0");//Proxies.


$file_path = "./last_file.txt";

if(file_exists($file_path)){
	$data = file_get_contents($file_path);
	echo $data;
	exit;
}

echo "";
?>