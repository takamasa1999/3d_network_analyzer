<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_network_analyzer_server/";

$file_name = $_POST['file_name'];

$file_dir = $server_dir."cashe/".$file_name;

$data = file_get_contents($file_dir);
echo $data;

?>