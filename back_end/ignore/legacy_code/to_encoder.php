<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/";
$python = "C:/Programming_Languages/Python/Python_3.10.5/python.exe";

$csv_file = $_FILES['file_select']['tmp_name'];

$fp = fopen($csv_file, "r");

stream_filter_prepend($fp,'convert.iconv.utf-8/cp932');


// $csv_data = file_get_contents($csv_file);

// mb_detect_encoding($csv_data);

// $csv_encoder_py = $server_dir."py/csv_encoder.py";
// $cmd = $python." ".$csv_encoder_py." ".$string_data." "."2>&1";
// $py_result = exec($cmd);

print_r($fp);
?>