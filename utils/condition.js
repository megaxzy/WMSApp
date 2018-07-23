/*
http://localhost:9000/ledger/WMS_Template/person/
{"conditions":[{"key":"name","relation":"EQUAL","values":["2"]},{"key":"password","relation":"EQUAL","values":["2"]}],"orders":[]}
*/
var con = ''

function NewCondition() {
  con = '{"conditions":[],"orders":[]}';
  return con;
}
function AddFirstCondition(key,relation,value){
  con = con.substr(0, con.length-14);
  var conitem = '{"key":"'+key+'","relation":"'+relation+'","values":["'+value+'"]}';
  con+=conitem;
  con += '],"orders":[]}';
  return con;
}
function AddCondition(key, relation, value) {
  con = con.substr(0, con.length - 14);
  var conitem = ',{"key":"' + key + '","relation":"' + relation + '","values":["'+ value +'"]}';
  con += conitem;
  con += '],"orders":[]}';
  return con;
}
/*
function AddFirstConditions(key, relation, value1,value2) {
  con = con.substr(0, con.length - 14);
  var conitem = '{"key":"' + key + '","relation":"' + relation + '","values":["' + value1 + '"]}' + '","values":["' + value2 + '"]}';
  con += conitem;
  con += '],"orders":[]}';
  return con;
}*/
function AddFirstConditions(key, relation, value) {
  con = con.substr(0, con.length - 14);
  var v=value.shift()
  var conitem = '{"key":"' + key + '","relation":"' + relation + '","values":["' + v +'"' ;
  con += conitem;
  while(value.length!=0){
    v = value.shift()
    conitem =', "'+v+'"'
    con += conitem;
  }
  con += ']}'
  con += '],"orders":[]}';
  return con;
}
function AddFirstOrder(key,value) {
  con = con.substr(0, con.length - 2);
  var conitem = '{"key":"' + key + '","values":"' + value + '"}';
  con += conitem;
  con += ']}';
  return con;
}

//模块化
module.exports = {
  con:con,
  NewCondition:NewCondition,
  AddFirstCondition:AddFirstCondition,
  AddCondition:AddCondition,
  AddFirstOrder: AddFirstOrder,
  AddFirstConditions: AddFirstConditions,
}