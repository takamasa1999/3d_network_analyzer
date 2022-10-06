// //生成ファイルの管理に使用するIPアドレス
// async function GetUserIP(){
//   var source = await fetch('https://jsonip.com', { mode: 'cors' });
//   var elem = await source.json();
//   user_ip = await elem.ip
//   user_ip = await user_ip.replace(/:/g, "")
// }
// GetUserIP()

// document.getElementsByClassName("value_input_div").style.display = "none";
// document.getElementById("value_input_div").style.display ="none";

// データ選択イベント
// function DataUpload(){
//   var func_name = arguments.callee.name
//     $.ajax({
//     url: '/cgi-bin/3d_co_occurense_network/server/php/cgi.php',
//     type:'POST',
//     dataType: 'text',
//     data : {
//       user_ip : user_ip,
//       data_array : data_array,
//     },
//     error: function(jqxhr, status, exception) {
//       console.debug('jqxhr', jqxhr);
//       console.debug('status', status);
//       console.debug('exception', exception);
//     }
//   }).done(function(data){
//     console.log("Ajax:" + func_name + "()⇒Success!\n-----------return---------------\n" + data);
//     document.getElementById("value_form").style.display ="";
//     document.getElementById("").style.display ="";
//   }).fail(function (data) {
//     console.log("Ajax:" + func_name + "()⇒Failed...\n-----------return---------------\n" + data);
//   }).always(function(data){
//     document.getElementById("loader-wrap").style.display ="none"
//   });
// }
// var data_array = [];
// function CsvToArray(csv) {
//   data_array.length = 0; //初期化
//   var row_sec = csv.split('\n');
//   var row_head = row_sec[0].split(',');
//   for (let a = 0; a < row_sec.length; a++) {
//     var row = row_sec[a].split(',');
//     var row_rev = [];
//     for (let b = 0; b < row_head.length; b++){
//       if (row[b]===undefined) {
//         row_rev.push('');
//       }else{
//         row_rev.push(row[b]);
//       }
//     };
//     data_array.push(row_rev);
//   }
// }
// function ArrayToTable(array){
//   var insertElement = '';
//   var column = array[0].length;
//   var row_lim = Math.min(array.length, 40);
//   for (let a = 0; a < row_lim-1; a++){
//     switch (a) {
//       case 0:
//         insertElement += '<tr>';
//         for (let b = 0; b < column; b++){
//           num = b+1
//           insertElement += '<th>'
//           insertElement += '<div class="chk_box_div">\
//                               <input type="checkbox" name="chk_box"' + ' id="chk_box' + num + '"' +' value=' + b + '>\
//                               <label for="chk_box' + num + '"' + '></label>\
//                             </div>';
//           try {
//             insertElement +=array[a][b];
//             insertElement +='</th>';
//           } catch (e) {
//             // エラー処理を記述予定
//           };
//         };
//         break;
//       default:
//         insertElement += '<tr>';
//         for (let b = 0; b < column; b++){
//           try {
//             insertElement +='<td>'+array[a][b]+'</td>';
//           } catch (e) {
//             // エラー処理を記述予定
//           };
//         };
//         insertElement += '<tr/>';
//         break;
//     }
//   };
//   insertElement += '<tr>';
//   for (let b = 0; b < column; b++){
//     insertElement +='<td>⁝</td>';
//   };
//   insertElement += '</tr>';
//   return(insertElement);
// }