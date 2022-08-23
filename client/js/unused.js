// 乱数作成。ページIDに使おうと思っていた。
function GenRandom(){
  let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand_str = '';
  for ( var i = 0; i < 16; i++ ) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return(rand_str)
}
var page_id = GenRandom();