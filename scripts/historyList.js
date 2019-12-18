$(function(){
	init().then(result => {
		getHistoryofWater().then(result => {
			setCurrentJpy().then(result2 => {
				setHistory(result);
				dispHistory();
			});
		});
	});
});

//全期間リスト表示
function dispHistory() {
	var now   = new Date();
	var year  = now.getFullYear();
	var month = now.getMonth();
	var len = waterHistory.length;
	var label = [];
	var inc = 0;
	for (var i = 0; i < len; i++) {
		label.push(year - Math.floor(len / 12) + inc + "年" + ((month + 12 - (len - i) % 12) % 12 + 1) + "月");
		if ((len - i) % 12 == 0) {
			inc++;
		}
	}
	var tbody = document.getElementById('tbodyID');
	for (var i = 0; i < len; i++) {
		var tr = document.createElement('tr');
		tr.innerHTML = '<tr><td>'+label[i]+'</td><td>'+waterHistory[i]+'</td><td>'+chargeHistoryJpy[i]+'</td></tr>';
		tbody.appendChild(tr);
	}
	histState = true;
}