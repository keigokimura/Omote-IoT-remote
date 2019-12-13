

$(function(){
	init().then(result => {
		getUserwallet();
		//getUsedWater();
		getNotPayCount();
		getOnWorking();
		getHistoryofWater().then(result => {
			displayHistoryTable(result);
			display_graph(result);
		});
	});
	setInterval(function(){getUserwallet();},3000);
});

////水の量セット
//function setAmountofWater(){
//	var input = $('#amountofWater').val();
//	dispLoadning();
//	contract.set_used_water.sendTransaction(myEscape(input),{from:account},(error, result) => {
//		console.log(result)
//		if(!error){
//		web3.eth.filter('latest', function(error, result){
//			if (!error) {
//				removeLoading();
//			} else {
//				console.error(error)
//				removeLoading();
//			}
//		  })
//		}else{
//			console.error(error);
//			removeLoading();
//		}
//		});
//}

////当月の使用した水の量を受け取る
//function getUsedWater(){
//	contract.get_amount_of_water.call({from:account},(error,result) => {
//		if(!error) {
//			$("#usedWater").text('先月の使用量'+result)
//		}
//	});
//}



//未払い料金を支払う
function payUnpaidCharge() {
	dispLoadning(msg);
	contract.pay_unpaid_charge.sendTransaction({from:account},(error, result) => {
		if(!error){
			web3.eth.filter('latest', function(error, result){
				if (!error) {
					removeLoading();
				} else {
					console.error(error)
					removeLoading();
				}
			  })
			}else{
				console.error(error);
				removeLoading();
			}
	});
}


//未払金の回数を受け取る
function getNotPayCount() {
	contract.get_not_pay_counter.call({from:account},(error,result) => {
		if(!error) {
			if (result > 0) {
				getUnpaidCharge();
			}
		}
	});
}

//未払金を受け取る
function getUnpaidCharge() {
	contract.get_unpaid_charge.call({from:account},(error,result) => {
		if(!error) {
			$("#unpaid").text("未払金: " + result + " wei");
			$("#sendUnpaid").append('<input type="submit" value="未払金支払い" id="sendUnpaidButton" onclick="payUnpaidCharge()">');
			if(Number(result) >= wallet) {
				$("#sendUnpaidButton").prop('disabled', true);
			}
		}
	});
}

//水道が停止されているかどうかを受け取る
function getOnWorking() {
	contract.get_on_working.call({from:account},(error,result) => {
		if(!error) {
			console.log(result)
			if(!result) {
				$("#onWorking").text("停止中");
				$(".inputWater").prop('disabled', true);
			}
		}
	});
}

//使用した水の量と料金の履歴を表示
function displayHistoryTable(amount) {
	var amount_of_water = amount[0];
	var amount_of_charge = amount[1];
	var len = amount_of_water.length;
	if(len > 0) {
		$('#amount1').text(amount_of_water[len-1]);
		$('#charge1').text(Number(amount_of_charge[len-1]).toLocaleString());
	} else {
		$('#amount1').text(0);
		$('#charge1').text(0);
	}
	if(len > 1) {
		$('#amount2').text(amount_of_water[len-2]);
		$('#charge2').text(Number(amount_of_charge[len-2]).toLocaleString());
	} else {
		$('#amount2').text(0);
		$('#charge2').text(0);
	}
	if(len > 2) {
		$('#amount3').text(amount_of_water[len-3]);
		$('#charge3').text(Number(amount_of_charge[len-3]).toLocaleString());
	} else {
		$('#amount3').text(0);
		$('#charge3').text(0);
	}
}

//グラフを表示
function display_graph(amount) {
	var now   = new Date();
	var year  = now.getFullYear();
	var month = now.getMonth();
	//amount_of_water = [20, 30, 50, 40, 39, 40, 10, 10, 34, 50, 11, 20, 49, 12, 21, 60, 19]
	var amount_of_water = amount[0];
	var amount_of_charge = amount[1];
	console.log(amount_of_water, amount_of_charge);
	label = []
	var len = amount_of_water.length;
	for (var i = len-12; i < len; i++) {
		label.push(((month + 12 - (len - i) % 12) % 12 + 1) + "月");
	}
	if (len < 12) {
		for (var i = 0; i < 12-len; i++) {
			amount_of_water.unshift(0);
		}
		len = 12;
	}
	var ctx = document.getElementById('ex_chart');
	var data = {
			labels: label,
			datasets: [{
				label: '水使用量',
				data: amount_of_water.slice(len-12,len),
				borderColor: 'rgba(70, 210, 255, 1)',
				backgroundColor: 'rgba(70, 210, 255, 0.8)'
			}]
	};
	var options = {
			scales: {
				yAxes: [{
					ticks: {
						min: 0
					}
				}]
			},
			tooltips: {
				titleFontSize: 15,
				bodyFontSize: 12,
				callbacks: {
					title: function (tooltipItem, data){
						return ("料金:" + amount_of_charge[tooltipItem[0].index] + "wei");
					}
				}
			}
	};
	var ex_chart = new Chart(ctx, {
		type: 'bar',
		data: data,
		options: options
	});
}


////ストップウォッチの機能
////ストップウォッチのリセット機能
//function reset_form() {
//	console.log(document.form_sw+ "A")
//	if(sw_status == 1)start_count();
//	timer = 0;
//	document.form_sw.amountofWater.value = 0;
//}
//
//function start_count(){
//	if(sw_status == 0){
//		document.form_sw.bstart.value = "stop";
//		sw_status = 1;
//		timerID = setInterval("count_up()",100);
//	}else{
//		document.form_sw.bstart.value = "start";
//		sw_status = 0;
//		clearInterval(timerID);
//	}
//}
//
//function count_up(){
//	timer++;
//	document.form_sw.amountofWater.value = timer;
//}






