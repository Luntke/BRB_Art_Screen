<?php
//Disable Caching of the document.
//Source: https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers#answer-2068407
header("Cache-Control: no-store, must-revalidate");//HTTP 1.1.
header("Expires: 0");//Proxies.


$data = file_get_contents("php://input");

if(strlen($data) > (100 * 1024)
|| strlen($data) === 0){
	exit;
}

$file_path = "./last_file.txt";
file_put_contents($file_path, $data);
echo "success";

?>