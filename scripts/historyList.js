//全期間リスト表示
function dispList(amount) {
	var now   = new Date();
	var year  = now.getFullYear();
	var month = now.getMonth();
	var waterHistoy = amount[0];
	var chargeHistory = amount[1];
	var len = waterHistory.length;
	label = [];
	inc = 0;
	for (var i = 0; i < len; i++) {
		label.push(year - Math.floor(len / 12) + inc + "年" + ((month + 12 - (len - i) % 12) % 12 + 1) + "月");
		if ((len - i) % 12 == 0) {
			inc++;
		}
	}
	var tbody = document.getElementById('tbodyID');
	for (var i = 0; i < len; i++) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = label[i];
        tbody.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = waterHistory[i];
        tbody.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = chargeHistory[i];
        tbody.appendChild(td);
        tbody.appendChild(tr);
	}
}

//ethereumと円の変換
function convertEthToJpy() {
	chargeHistoryEth = [];
	$.ajax({
		  type: 'GET',
		  url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=jpy&ids=ethereum',
		  dataType: 'json',
		  success: function(json){
			  Ethereum = json[0];
			  current_price = Ethereum["current_price"];
			  console.log(current_price)

		  }
		});
}

$(function(){
	init().then(result => {
		getHistoryofWater().then(result => {
			dispList(result);
			convertEthToJpy();
		});
	});
});
