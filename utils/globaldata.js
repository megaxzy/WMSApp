
//var url = 'http://www.megaxzy.com:9000/'//正式服
//var url = 'https://localhost:9000/'
//var url = 'https://localhost:443/'
//var url = 'http://192.168.43.103:9000/'
//var url = 'https://wms.jackquantop.com/9000/'
//var url = 'http://47.93.35.199:9000/'//正式服
var url = 'https://www.antufengda.com:9000/'//正式服
//var url = 'http://wms.antufengda.com:9000/'//正式服


var account = 'WMS_Template/'

var user_id='' //用户id
var user_name=''  //用户名称2
var user_role=''  //用户职位 
var user_authority=''  //用户权限
var all_warehouse=''   //所有仓库的json格式
var chosen_warehouse=''    //现在选择的仓库的json格式
var all_storage_location = '' //所有库位的json格式
var all_material = ''  //所有物料的json格式
var all_supply = ''  //所有supply的json格式

var entry_barcode=[] //缓存的所有已经扫过的码
var delivery_barcode = [] //缓存的所有已经扫过的码
var transfer_barcode = [] //缓存的所有已经扫过的码
var transfer0_barcode = [] //缓存的所有已经扫过的码
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
  all_supply:all_supply,
  entry_barcode: entry_barcode,
  delivery_barcode: delivery_barcode,
  transfer0_barcode: transfer0_barcode,
  transfer_barcode: transfer_barcode,
}
