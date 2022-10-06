<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/";

// データ取得
$user_ip = $_POST['user_ip'];
$checked_column = $_POST['checked_column'];
$lowest_occure = $_POST['lowest_occure'];
$lowest_simpson = $_POST['lowest_simpson'];
$screen_size = $_POST['screen_size'];


//取得データをjsonで保存
$data_json = array(
  'checked_column' => $checked_column,
);
$data_json = json_encode($data_json, JSON_UNESCAPED_UNICODE);
file_put_contents($server_dir."cashe/".$user_ip."_req.json", $data_json);

//pythonファイルの実行
$python = "C:/Programming_Languages/Python/Python_3.10.5/python.exe";
$calc_py = $server_dir."py/calc.py";
$cmd = $python." ".$calc_py." ".$user_ip." ".$lowest_occure." ".$lowest_simpson." ".$screen_size." "."2>&1";
$py_result = exec($cmd);
print_r("calc.py⇒ ".$py_result);

print_r("\n"."End of {ajax.php}");
?>