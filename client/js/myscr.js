//生成ファイルの管理に使用するIPアドレス
async function GetUserIP(){
  var source = await fetch('https://jsonip.com', { mode: 'cors' });
  var elem = await source.json();
  user_ip = await elem.ip
  user_ip = await user_ip.replace(/:/g, "")
}
GetUserIP()

// html操作
document.getElementById("data_check").style.display ="none";
document.getElementById("loader-wrap").style.display ="none";
document.getElementById("received_data").style.visibility = "hidden";
document.getElementById("value_form").style.display ="none";
// document.getElementsByClassName("value_input_div").style.display = "none";
// document.getElementById("value_input_div").style.display ="none";

// データ選択イベント
function DataUpload(){
  var func_name = arguments.callee.name
    $.ajax({
    url: '/cgi-bin/3d_co_occurense_network/server/php/cgi.php',
    type:'POST',
    dataType: 'text',
    data : {
      user_ip : user_ip,
      data_array : data_array,
    },
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
    document.getElementById("value_form").style.display ="";
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
    document.getElementById("loader-wrap").style.display ="none"
  });
}
var data_array = [];
function CsvToArray(csv) {
  data_array.length = 0; //グローバル変数の初期化
  var dataString = csv.split('\n');
  for (let i = 0; i < dataString.length; i++) {
    data_array[i] = dataString[i].split(',');
  }
}
function ArrayToTable(array){
  var insertElement = '';
  var column = array[0].length;
  for (let a = 0; a < 3; a++){
    insertElement += '<tr>';
    // 1行目にチェックボックスを追加
    if (a==0) {
      insertElement += '<tr>';
      for (let b = 0; b < column; b++){
        num = b+1
        insertElement +='<td><input type="checkbox" name="active_column" class="active_column" value=' + b + '></td>';
      }
      insertElement += '</tr>';
    }
    for (let b = 0; b < column; b++){
      try {
        insertElement +='<td>'+array[a][b]+'</td>';
      } catch (e) {
        // エラー処理などを記述予定
      }
    }
    insertElement += '</tr>';
  }
  insertElement += '<tr>';
  for (let b = 0; b < column; b++){
    insertElement +='<td>⁝</td>';
  }
  insertElement += '<tr>';
  return(insertElement);
}
function MakeTable(){
  document.getElementById("loader-wrap").style.display ="";
  var reader = new FileReader();
  var data = document.getElementById("upload_data").files;
  reader.readAsText(data[0]);
  reader.onload = function(){ //readerがonload
    CsvToArray(reader.result);
    var table = ArrayToTable(data_array);
    document.getElementById("data_check").innerHTML = table;
    document.getElementById("data_check").style.display ="";
    DataUpload()
  }
}

function ValueUpdate(){
  GetCheckedColumn()
  if (checked_column.length > 1){
    RequestSend()
  }else{
    alert("Choose more than 2 column")
  }
}
var checked_column = [];
function GetCheckedColumn(){
  checked_column.length = 0;
  var chk_box = document.data_check_form.active_column;
  for (let i = 0; i < chk_box.length; i++) {
    if (chk_box[i].checked) {  //chk1[i].checked === true
      checked_column.push(chk_box[i].value);
    }
  }
}
function RequestSend(){
  $("#loader-wrap").fadeIn(300);
  var lowest_occure = document.getElementById('lowest_occure').value;
  var lowest_simpson = document.getElementById('lowest_simpson').value;
  var func_name = arguments.callee.name
  $.ajax({
    url: '/cgi-bin/3d_co_occurense_network/server/php/ajax.php',
    type: 'POST',
    dataType: 'text',
    data : {
      user_ip : user_ip,
      checked_column : checked_column,
      lowest_occure : lowest_occure,
      lowest_simpson :lowest_simpson,
    },
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
    if (data == "calc.py⇒ success!\nEnd of {ajax.php}") {
    HtmlReceive()
  }else {
    alert("Adjust value and try again")
  }
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
    $("#loader-wrap").fadeOut(300);
  });
}
// function HtmlReceive(){
//   var func_name = arguments.callee.name
//   $.ajax({
//     url: '/cgi-bin/3d_co_occurense_network/server/cashe/' + user_ip + ".html",
//     type: 'POST',
//     dataType: 'html',
//     error: function(jqxhr, status, exception) {
//       console.debug('jqxhr', jqxhr);
//       console.debug('status', status);
//       console.debug('exception', exception);
//     }
//   }).done(function(data){
//     console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n");
//     let parent = document.getElementById('received_data');
//     while(parent.lastChild){
//       parent.removeChild(parent.lastChild);
//     }
//     $('#received_data').append(data);
//     document.getElementById("received_data").style.visibility = "";
//   }).fail(function (data) {
//     console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n");
//   }).always(function(data){
//     $("#loader-wrap").fadeOut(300);
//   });
// }

function HtmlReceive(){
  $("#loader-wrap").fadeIn(300);
  var func_name = arguments.callee.name
  $.ajax({
    url: '/cgi-bin/3d_co_occurense_network/server/php/html_receive.php',
    type: 'POST',
    dataType: 'text',
    data : {
      user_ip : user_ip,
    },
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
    let parent = document.getElementById('received_data');
    while(parent.lastChild){
      parent.removeChild(parent.lastChild);
    }
    $('#received_data').append(data);
    document.getElementById("received_data").style.visibility = "";
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
    $("#loader-wrap").fadeOut(300);
  });
}