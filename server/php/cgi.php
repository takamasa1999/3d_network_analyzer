<?php

$server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/";

$user_ip = $_POST['user_ip'];
$data_array = $_POST['data_array'];

//受け取った値をjson形式で保存
$data_json = array(
  // 'checked_column' => $checked_column,
  'data_array' => $data_array,
  // 'user_ip' => $user_ip,
);
$data_json = json_encode($data_json, JSON_UNESCAPED_UNICODE);
file_put_contents($server_dir."cashe/".$user_ip."_data.json", $data_json);

// webページのコンソール出力
echo("End of {cgi.php}");

// pythonファイルの実行。casheクリアのpyを作成予定。
// $python = "C:/Programming_Languages/Python/Python_3.10.5/python.exe";
// $py_file = "C:/Server/Apache/Apache24/htdocs/3D_Analytics/calc.py";
// $cmd = $python." ".$py_file." ".$checked_column." ".$data_array;
// exec($cmd);

?>
