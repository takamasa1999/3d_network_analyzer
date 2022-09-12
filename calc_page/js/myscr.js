function GenRandom(){
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand_str = '';
  for ( var i = 0; i < 16; i++ ) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return(rand_str)
}
var page_id = GenRandom();

function dispLoading(msg){
  // 引数なし（メッセージなし）を許容
  if( msg == undefined ){
    msg = "";
  }
  // 画面表示メッセージ
  var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
  // ローディング画像が表示されていない場合のみ出力
  if($("#loading").length == 0){
    $("body").append("<div id='loading'>" + dispMsg + "</div>");
  }
}
function removeLoading(){
  $("#loading").remove();
}

window.onload = function() {
  removeLoading();
}

document.getElementById("page_id").style.display ="none";
document.getElementById("page_id").value = page_id;

// 初期表示
document.getElementById("received_data").style.display ="none";
document.getElementById("data_check_form").style.display ="none";
document.getElementById("value_form").style.display ="none";
document.getElementById("network_name_div").style.display ="none";


function RemToPx(rem) {
  var fontSize = getComputedStyle(document.documentElement).fontSize;
  return rem * parseFloat(fontSize);
}

// File select
async function MakeTable(){
  await dispLoading("Importing csv data...")
  await CsvToArray()
  var arr = await GetArrayData()
  var table = ArrayToTable(arr);
  await TableImprement(table)
  await removeLoading()
};
async function CsvToArray(){
  var func_name = await arguments.callee.name;
  var form_data = await new FormData(document.forms.file_select_form);
  await $.ajax({
    url: '/cgi-bin/3d_network_analysis/py/csv_encoder.py',
    type: 'post',
    processData: false,
    contentType: false,
    data: form_data,
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    },
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
  });
};
async function GetArrayData(){
  var func_name = await arguments.callee.name;
  var ajax = await $.ajax({
    url: '/cgi-bin/3d_network_analysis/php/array_data_receive.php',
    type: 'POST',
    dataType: 'json',
    data : {
      file_name : page_id + '_array.json',
    },
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n");
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n");
  }).always(function(data){
  });
  return(ajax);
};
function TableImprement(table_data){
  document.getElementById("data_check_table_body").innerHTML = table_data;
  document.getElementById("data_check_form").style.display ="";
  document.getElementById("value_form").style.display ="";
  if (document.getElementById('data_check_table_body').clientHeight > document.getElementById('col&chk').clientHeight*3.5) {
    document.getElementById('data_check_form').style.height = document.getElementById('col&chk').clientHeight*3.5 + 'px';
  }else {
    document.getElementById('data_check_form').style.height = document.getElementById('data_check_table_body').clientHeight + 'px';
  };
  if (document.getElementById('data_check_table_body').clientWidth > ($(window).width())*0.975) {
    document.getElementById('data_check_form').style.width = $(window).width()*0.975 + 'px';
  }else {
    document.getElementById('data_check_form').style.width = document.getElementById('data_check_table_body').clientWidth + 'px';
  };
};
var col_name
function ArrayToTable(json){
  var col = json.columns;
  var data = json.data;
  col_name =col;
  var insertElement = '';
  var row_lim = 20;
  insertElement += '<tr id="col&chk">';
  for (var i = 0; i < col.length; i++) {
    insertElement += '<th>';
    insertElement += '<div class="chk_box_div">\
                        <input type="checkbox" name="chk_box"' + ' id="chk_box' + i + '"' +' value=' + i + '>\
                        <label for="chk_box' + i + '"' + '></label>\
                      </div>';
    insertElement += col[i];
    insertElement += '</th>';
  };
  insertElement += '</tr>';
  var row_tail = Math.min(data.length, row_lim);
  for (var row = 0; row < row_tail; row++) {
    insertElement += '<tr>';
    for (var elem = 0; elem < col.length; elem++) {
      insertElement += '<td>';
      insertElement += data[row][elem];
      insertElement += '</td>';
    };
    insertElement += '</tr>';
  };
  if (data.length>row_lim) {
    insertElement +='<tr>';
    for (var i = 0; i < col.length; i++) {
      insertElement += '<td>⁝</td>';
    };
    insertElement +='</tr>';
  };
  return(insertElement);
};
// +,-button
function AddRwTxtBox(){
  var box_sum = document.getElementsByClassName("remove_word");
  var box_qty = box_sum.length;
  var idx = String(box_qty + 1);
  var contents = '<input class="remove_word" id="remove_word_' + idx + '"' + 'type="text" name="remove_word" value="">';
  $('.remove_word_div').append(contents);
};
function RemoveRwTxtBox(){
  var box_sum = document.getElementsByClassName("remove_word");
  var box_qty = box_sum.length;
  var idx = box_qty;
  var id_name = "remove_word_" + String(idx);
  var elem = document.getElementById(id_name);
  if (idx == 1 ) {
    pass;
  }else {
    elem.remove();
  };
};
function GetRwTxtValue(){
  var box_sum = document.getElementsByClassName("remove_word");
  var box_qty = box_sum.length;
  var value_list = ["dummy"];
  for (var i = 0; i < box_qty; i++) {
    var val = box_sum.item(i).value;
    value_list.push(val)
  };
  return(value_list)
}

// Plot graph
async function PlotGraph(){
  await dispLoading("Calcurating & Plotting...")
  await GetCheckedColumn()
  if (checked_column.length > 1){
    var rsp1 = await Plotter();
    if (rsp1 == 'plotter.py⇒success!') {
      var plt_data = await GetPlotter();
      await GraphImprement(plt_data)
    }else {
      alert("Adjust value and try again");
    };
  }else{
    alert("Select more than 2 columns.");
  };
  await removeLoading();
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
async function Plotter(){
  var lowest_occure = await document.getElementById('lowest_occure').value;
  var lowest_simpson = await document.getElementById('lowest_simpson').value;
  var func_name = await arguments.callee.name;
  var ajax = await $.ajax({
    url: '/cgi-bin/3d_network_analysis/py/plotter.py',
    type: 'POST',
    dataType: 'text',
    data : {
      page_id : page_id,
      checked_column : checked_column,
      lowest_occure : lowest_occure,
      lowest_simpson :lowest_simpson,
      remove_word : GetRwTxtValue(),
      screen_size: RemToPx(1),
      show_hv_txt: GetHvtxtOption(),
    },
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
  });
  return(ajax);
}
async function GetPlotter(){
  var func_name = await arguments.callee.name
  var ajax = await $.ajax({
    url: '/cgi-bin/3d_network_analysis/php/plot_data_receive.php',
    type: 'POST',
    dataType: 'json', //ここがエラーの原因か
    data : {
      page_id : page_id,
    },
    error: function(jqxhr, status, exception) {
      console.debug('jqxhr', jqxhr);
      console.debug('status', status);
      console.debug('exception', exception);
    }
  }).done(function(data){
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n");
    // console.dir(data.data)
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n");
  }).always(function(data){
  });
  return(ajax);
}
function GraphImprement(json_data){
  let parent = document.getElementById('received_data');
  while(parent.lastChild){
    parent.removeChild(parent.lastChild);
  }
  plot_data = JSON.stringify(json_data.data)
  var plot = '<script type="text/javascript">\
                window.PLOTLYENV=window.PLOTLYENV || {};\
                Plotly.newPlot("received_data",' + plot_data + ',' + JSON.stringify(layout) + ',' + JSON.stringify(congfig) + ');\
              </script>'
  $('#received_data').append(plot);
  document.getElementById("received_data").style.display ="";
  document.getElementById('network_name').innerText = GraphName(checked_column, col_name);
  document.getElementById("network_name_div").style.display =""
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
  return(graph_name)
};
function GetHvtxtOption(){
  var result = document.getElementById("hv_txt").checked;
  return(result)
}

// グラフレイアウト
var axis_lo = {
  showticklabels: false,
  showgrid: false,
  zeroline : false,
  showspikes : false,
  title:'',
}
var layout = {
  hovermode:"closest",
  margin: {
  	l: 0,
  	r: 0,
  	b: 0,
  	t: 0,
  },
  font: {
    size: RemToPx(2.5),
    family: "Oleo_Reg, Klee_Reg",
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
     size: RemToPx(2.5),
   },
   bgcolor: "#FEFFF5",
  },
  modebar: {
    add:["eraseshape"],
    remove:["tableRotation", "resetCameraLastSave3d", "toimage", "resetCameraDefault3d", "reset"],
  },
}
var congfig = {
  displayModeBar: true,
  displaylogo: false,
}
