function GenRandom(){
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand_str = '';
  for ( var i = 0; i < 16; i++ ) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return(rand_str)
}
var page_id = GenRandom();
document.getElementById("page_id").style.display ="none";
document.getElementById("page_id").value = page_id;

// 初期表示
document.getElementById("loader-wrap").style.display ="none";
document.getElementById("received_data").style.display ="none";
document.getElementById("data_check_form").style.display ="none";
document.getElementById("value_form").style.display ="none";
document.getElementById("network_name_div").style.display ="none";

function RemToPx(rem) {
  var fontSize = getComputedStyle(document.documentElement).fontSize;
  return rem * parseFloat(fontSize);
}

// File select
function MakeTable(){
  $("#loader-wrap").fadeIn(300);
  CsvEncoder()
}
function CsvEncoder() {
  var func_name = arguments.callee.name;
  var form_data = new FormData(document.forms.file_select_form);
  $.ajax({
    url: '/cgi-bin/3d_network_analysis/py/csv_encoder.py',
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
    console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
    GetArrayData()
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
  }).always(function(data){
  });
}
function GetArrayData(){
  var func_name = arguments.callee.name
  $.ajax({
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
    console.dir(data);
    var table = ArrayToTable(data);
    document.getElementById("data_check_table_body").innerHTML = table;
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
    $("#loader-wrap").fadeOut(300);
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n");
  }).always(function(data){
  });
}
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
  insertElement += '</tr>'
  var row_tail = Math.min(data.length, row_lim);
  for (var row = 0; row < row_tail; row++) {
    insertElement += '<tr>'
    for (var elem = 0; elem < col.length; elem++) {
      insertElement += '<td>';
      insertElement += data[row][elem];
      insertElement += '</td>';
    };
    insertElement += '</tr>'
  };
  if (data.length>row_lim) {
    insertElement +='<tr>'
    for (var i = 0; i < col.length; i++) {
      insertElement += '<td>⁝</td>';
    };
    insertElement +='</tr>'
  };
  return(insertElement)
}
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
function ValueUpdate(){
  GetCheckedColumn()
  if (checked_column.length > 1){
    PlotRequest()
  }else{
    alert("Select more than 2 columns.")
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
function PlotRequest(){
  $("#loader-wrap").fadeIn(300);
  var lowest_occure = document.getElementById('lowest_occure').value;
  var lowest_simpson = document.getElementById('lowest_simpson').value;
  var func_name = arguments.callee.name
  $.ajax({
    url: '/cgi-bin/3d_network_analysis/py/calc.py',
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
    if (data == 'calc.py⇒success!') {
      DataReceive();
    }else {
      alert("Adjust value and try again");
    };
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
    console.dir(data.data)
    let parent = document.getElementById('received_data');
    while(parent.lastChild){
      parent.removeChild(parent.lastChild);
    }
    plot_data = JSON.stringify(data.data)
    var plot = '<script type="text/javascript">\
                  window.PLOTLYENV=window.PLOTLYENV || {};\
                  Plotly.newPlot("received_data",' + plot_data + ',' + JSON.stringify(layout) + ',' + JSON.stringify(congfig) + ');\
                </script>'

    $('#received_data').append(plot);
    document.getElementById("received_data").style.display ="";
    document.getElementById('network_name').innerText = GraphName(checked_column, col_name);
    document.getElementById("network_name_div").style.display =""
  }).fail(function (data) {
    console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n");
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
  return(graph_name)
};
function GetHvtxtOption(){
  var result = document.getElementById("hv_txt").checked;
  return(result)
}

// グラフレイアウト
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
    color: "rgb(220, 220, 220)",
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
     size: RemToPx(2.3),
     family: "Arial",
   },
   bgcolor: "rgb(248, 255, 205)",
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