<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/";

$user_ip = $_POST['user_ip'];

$html_name = $server_dir."cashe/".$user_ip.".html";

readfile($html_name);

?>