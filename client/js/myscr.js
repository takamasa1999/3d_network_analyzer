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
document.getElementById("received_data").style.display ="none";
document.getElementById("value_form").style.display ="none";
document.getElementById("update_value").style.display ="none";
document.getElementById("network_name_div").style.display ="none";

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
  data_array.length = 0; //初期化
  var row_sec = csv.split('\n');
  var row_head = row_sec[0].split(',');
  for (let a = 0; a < row_sec.length; a++) {
    var row = row_sec[a].split(',');
    var row_rev = [];
    for (let b = 0; b < row_head.length; b++){
      if (row[b]===undefined) {
        row_rev.push('');
      }else{
        row_rev.push(row[b]);
      }
    };
    data_array.push(row_rev);
  }
}
function ArrayToTable(array){
  var insertElement = '';
  var column = array[0].length;
  var row_lim = Math.min(array.length, 40);
  for (let a = 0; a < row_lim-1; a++){
    switch (a) {
      case 0:
        insertElement += '<tr>';
        for (let b = 0; b < column; b++){
          num = b+1
          insertElement += '<th>'
          insertElement += '<div class="chk_box_div">\
                              <input type="checkbox" name="chk_box"' + ' id="chk_box' + num + '"' +' value=' + b + '>\
                              <label for="chk_box' + num + '"' + '></label>\
                            </div>';
          try {
            insertElement +=array[a][b];
            insertElement +='</th>';
          } catch (e) {
            // エラー処理を記述予定
          };
        };
        break;
      default:
        insertElement += '<tr>';
        for (let b = 0; b < column; b++){
          try {
            insertElement +='<td>'+array[a][b]+'</td>';
          } catch (e) {
            // エラー処理を記述予定
          };
        };
        insertElement += '<tr/>';
        break;
    }
  };
  insertElement += '<tr>';
  for (let b = 0; b < column; b++){
    insertElement +='<td>⁝</td>';
  };
  insertElement += '</tr>';
  return(insertElement);
}
function MakeTable(){
  document.getElementById("loader-wrap").style.display ="";
  CsvEncoder()
}

function CsvEncoder() {
  var func_name = arguments.callee.name;
  var form_data = new FormData(document.forms.file_select_form);
  $.ajax({
    url: '/cgi-bin/3d_co_occurense_network/server/py/csv_encoder.py',
    type: 'post',
    processData: false,
    contentType: false,
    data: form_data,
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n");
    CsvToArray(data);
    var table = ArrayToTable(data_array);
    document.getElementById("data_check_table").innerHTML = table;
    document.getElementById("data_check_form").style.display ="";
    DataUpload()
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
  });
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
      screen_size: RemToPx(1),
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
    document.getElementById("received_data").style.display ="";
    document.getElementById('network_name').innerText = GraphName(checked_column, data_array[0]);
    document.getElementById("network_name_div").style.display =""
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
  margin: {
  	l: 0,
  	r: 0,
  	b: 0,
  	t: 0,
  },
  font: {
    size: RemToPx(2),
    color: "#a3a3a3",
    family: "Arial",
 },
 scene: {
   xaxis: axis_lo,
   yaxis: axis_lo,
   zaxis: axis_lo,
   projection: {
     type: "perspective",
   },
 },
 showlegend: false,
 hoverlabel: {
   align: "left",
   font: {
     size: RemToPx(2),
     family: "Arial",
   },
   bgcolor: "rgb(248, 255, 205)",
  },
  modebar: {
    // color: "rgb(255, 255, 255)",
    // bgcolor:"rgb(103, 197, 255)",
    add:["eraseshape"],
    remove:["tableRotation", "resetCameraLastSave3d", "toimage", "resetCameraDefault3d", "reset"],
  },
}
var congfig = {
  displayModeBar: true,
  displaylogo: false,
}