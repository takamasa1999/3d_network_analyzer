<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_network_analyzer_server/";

$page_id = $_POST['page_id'];

$file_dir = $server_dir."cashe/".$page_id."_plot.json";

$data = file_get_contents($file_dir);
echo $data;

?>