/*

Cubox：https://apps.apple.com/app/id1113361350

[rewrite_local]
^https?:\/\/cubox\.(cc|pro)\/c\/api\/userInfo url script-response-body https://raw.githubusercontent.com/WoshiTm/saonian/main/Cubox.js

[MITM]
hostname = cubox.cc, cubox.pro

*/
var luori = JSON.parse($response.body);
luori.data.isExpire = false;
luori.data.expireTime ="2099-09-18T08:08:08Z";
luori.data.nickName ="落日余晖";
luori.data.level = 1;
luori.data.paymentSource = 9;
$done({ body: JSON.stringify(luori) });
