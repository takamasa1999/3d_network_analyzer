<?php

// DataUpload()よりバックエンド通信。

  $user_ip = $_POST['user_ip'];
  $data_array = $_POST['data_array'];

  //受け取った値をjson形式で保存
  $data_json = array(
    // 'checked_column' => $checked_column,
    'data_array' => $data_array,
    // 'user_ip' => $user_ip,
  );
  $data_json = json_encode($data_json, JSON_UNESCAPED_UNICODE);
  file_put_contents("cashe/".$user_ip."_data.json", $data_json);

  // print_r($data_array)

  // echoでajaxに値を返す
  echo("Here is end of cgi.php");

  // pythonファイルの実行
  // $python = "C:/Programming_Languages/Python/Python_3.10.5/python.exe";
  // $py_file = "C:/Server/Apache/Apache24/htdocs/3D_Analytics/calc.py";
  // $cmd = $python." ".$py_file." ".$checked_column." ".$data_array;
  // exec($cmd);

?>
