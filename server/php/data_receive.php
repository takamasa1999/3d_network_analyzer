<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/";

$user_ip = $_POST['user_ip'];

$file_dir = $server_dir."cashe/".$user_ip."_res.json";

$data = file_get_contents($file_dir);
echo $data;

?>