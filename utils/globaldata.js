
var url = 'http://192.168.1.9:9000/'
//var url = 'http://localhost:9000/'
var account = 'WMS_Template/'

var user_id='' //用户id
var user_name=''  //用户名称
var user_role=''  //用户职位 
var user_authority=''  //用户权限
var all_warehouse=''   //所有仓库的json格式
var chosen_warehouse=''    //现在选择的仓库的json格式
var all_storage_location = '' //所有库位的json格式
var all_material = ''  //所有物料的json格式
var all_supply = ''  //所有supply的json格式

module.exports = {
  url:url,
  account:account,
  user_id:user_id,
  user_name:user_name,
  user_role: user_role,
  user_authority:user_authority,
  all_warehouse:all_warehouse,
  chosen_warehouse: chosen_warehouse,
  all_storage_location: all_storage_location,
  all_material:all_material,
  all_supply:all_supply
}