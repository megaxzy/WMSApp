/*http://localhost:9000/ledger/WMS_Template/person/{"conditions":[{"key":"name","relation":"EQUAL","values":["2"]},{"key":"password","relation":"EQUAL","values":["2"]}],"orders":[]}*/
var con = '{"conditions":[]}'

function AddFirstCondition(key,relation,value){
  con = con.substr(0, con.length-2);
  var conitem = '{"key":"'+key+'","relation":"'+relation+'","values":["'+value+'"]}';
  con+=conitem;
  con += ']}';
  return con;
}
function AddCondition(key, relation, value) {
  con = con.substr(0, con.length - 2);
  var conitem = ',{"key":"' + key + '","relation":"' + relation + '","values":["' + value + '"]}';
  con += conitem;
  con += ']}';
  return con;
}
//模块化
module.exports = {
  con:con,
  AddFirstCondition:AddFirstCondition,
  AddCondition:AddCondition
}