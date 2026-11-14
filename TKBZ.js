
/*
[rewrite_local]
https://cdxmhn.top/bz/img006/periodList url script-response-body https://raw.githubusercontent.com/WoshiTm/saonian/refs/heads/main/TKBZ.js

[mitm]
hostname = cdxmhn.top
*/

var body = $response.body;
body = body.replace(/"is_vip":"1"/g, '"is_vip": "0"');
$done({ body });