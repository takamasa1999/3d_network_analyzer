//生成ファイルの管理に使用するIPアドレス
async function GetUserIP(){
  var source = await fetch('https://jsonip.com', { mode: 'cors' });
  var elem = await source.json();
  user_ip = await elem.ip
  user_ip = await user_ip.replace(/:/g, "")
}
GetUserIP()

// html操作
document.getElementById("data_check_form").style.display ="none";
document.getElementById("loader-wrap").style.display ="none";
document.getElementById("received_data").style.visibility = "hidden";
document.getElementById("value_form").style.display ="none";
document.getElementById("update_value").style.display ="none";

function RemToPx(rem) {
  var fontSize = getComputedStyle(document.documentElement).fontSize;
  return rem * parseFloat(fontSize);
}

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
    document.getElementById("update_value").style.display ="";
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
  for (let a = 0; a < 20; a++){
    insertElement += '<tr>';
    // 1行目にチェックボックスを追加
    if (a==0) {
      insertElement += '<tr>';
      for (let b = 0; b < column; b++){
        num = b+1
        insertElement +='<td>\
                          <div class="chk_box_div">\
                            <input type="checkbox" name="chk_box"' + ' id="chk_box' + num + '"' +' value=' + b + '>\
                            <label for="chk_box' + num + '"' + '></label>\
                          </div>\
                        </td>';
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
  var data = document.getElementById("file_select").files;
  reader.readAsText(data[0]);
  reader.onload = function(){
    CsvToArray(reader.result);
    var table = ArrayToTable(data_array);
    document.getElementById("data_check_table").innerHTML = table;
    document.getElementById("data_check_form").style.display ="";
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
  var chk_box_sum = document.forms.data_check_form.chk_box;
  for (let i = 0; i < chk_box_sum.length; i++) {
    if (chk_box_sum[i].checked) {  //chk1[i].checked === true
      checked_column.push(chk_box_sum[i].value);
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
    DataReceive()
  }else {
    alert("Adjust value and try again")
  }
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
    $("#loader-wrap").fadeOut(300);
  });
}

function DataReceive(){
  $("#loader-wrap").fadeIn(300);
  var func_name = arguments.callee.name
  $.ajax({
    url: '/cgi-bin/3d_co_occurense_network/server/php/data_receive.php',
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
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + user_ip + "_res.json");
    let parent = document.getElementById('received_data');
    while(parent.lastChild){
      parent.removeChild(parent.lastChild);
    }
    var plot = '<script type="text/javascript">\
                  window.PLOTLYENV=window.PLOTLYENV || {};\
                  Plotly.newPlot("received_data",' + data + ',' + JSON.stringify(layout) + ',' + JSON.stringify(congfig) + ');\
                </script>'
    $('#received_data').append(plot);
    document.getElementById("received_data").style.visibility = "";
    document.getElementById('network_name').innerText = GraphName(checked_column, data_array[0])
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + user_ip + "_res.json");
  }).always(function(data){
    $("#loader-wrap").fadeOut(300);
  });
}

function GraphName(arr1, arr2){
  var graph_name = 'Network for: '
  for (var i = 0; i < arr1.length; i++) {
    col_num = arr1[i]
    graph_name+=arr2[col_num]
    if (i < arr1.length - 1) {
      graph_name+=" & "
    }
  };
  return(graph_name);
};

var axis_lo = {
  showticklabels: false,
  title:'',
}

var layout = {
  hovermode:'closest',
  uirevision: 1,
  margin: {
  	l: 0,
  	r: 0,
  	b: 0,
  	t: 0,
  },
  font: {
    size: RemToPx(2),
 },
 scene: {
   xaxis: axis_lo,
   yaxis: axis_lo,
   zaxis: axis_lo,
 },
 showlegend: false,
 hoverlabel: {
   font: {
     size: RemToPx(2),
   },
  bgcolor: "rgb(255, 255, 255)",
 }
}

var congfig = {
  displayModeBar: true,
  toImageButtonOptions: {
    format: 'html',
  },
}