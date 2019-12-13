var account;
var wallet;
var sw_status = 0;
var msg = "now sending Transaction...."
function init() {
	return new Promise(resolve => {
		if (typeof web3 !== 'undefined') {
			web3 = new Web3(web3.currentProvider);
			ethereum.enable()
			web3.version.getNetwork((error, result) => {
				$('#networkid').text('ネットワークID: '+result)
			})
			web3.eth.getAccounts((error, result) => {
				$('#accounts').text('アカウントアドレス: '+result)
				account = result[0]
				//ethアカウント入力部分にデフォルトで表示させる
				$("div.userdata input.eth").attr('value',account)
			})
		} else {
			document.write('Install <a href="https://metamask.io">METAMASK</a>')
		}
		abi = [{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"pay_unpaid_charge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"set_history","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newSender","type":"address"}],"name":"set_sender","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount_of_water","type":"uint256"}],"name":"set_used_water","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_user","type":"address"},{"name":"_diameter","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"basic_rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"calc_charge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_amount_of_water","type":"uint256"}],"name":"calc_commodity_charge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_amount_of_water","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_history_charge","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_history_water","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_not_pay_counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_on_working","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_unpaid_charge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_user_info","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_wallet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"history_charge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"history_water","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"not_pay_counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"on_working","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unpaid_charge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"user","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
		contractAddress = "0x55ad44d35fd55c65468a1a60e00c06679b8068dd";
		contract = web3.eth.contract(abi).at(contractAddress);
		resolve();
	});
}

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
		reset_form();
	});
});

//水の量セット
function setAmountofWater(){
	var input = $('#amountofWater').val();
	dispLoadning(msg);
	contract.set_used_water.sendTransaction(myEscape(input),{from:account},(error, result) => {
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

////当月の使用した水の量を受け取る
//function getUsedWater(){
//	contract.get_amount_of_water.call({from:account},(error,result) => {
//		if(!error) {
//			$("#usedWater").text('先月の使用量'+result)
//		}
//	});
//}

//depositする
function Deposit() {
	var input = $('#deposit').val();
	dispLoadning(msg);
	contract.deposit.sendTransaction({from:account,to:contractAddress,value:web3.toWei(myEscape(input), "wei")},(error,transactionHash) => {
		if(!error){
            var timerId = setInterval(function(){
				web3.eth.getTransactionReceipt(transactionHash,(error,resultReceipt) => {
                	if(resultReceipt !== null) {
	                	web3.eth.getTransactionReceipt(transactionHash,(error,resultReceipt) => {
                        	if(resultReceipt == false){
                            	//エラー処理
                            	removeLoading();
								console.log("--failed--");
								clearInterval(timerId);
	                     	} else {
                                removeLoading();
								console.log("---Success---");
								clearInterval(timerId);
                            }
                        });
					}
				});
			},500);
		 }else{
		 	console.log(error);
		 	removeLoading();
		 }
		//  if(!error){
		//  	web3.eth.filter('latest', function(error, result){
		//  		if (!error) {
		//  			removeLoading();
		//  		} else {
		//  			console.error(error)
		//  			removeLoading();
		//  		}
		//  	  })
		//  	}else{
		//  		console.error(error);
		//  		removeLoading();
		//  	}
	});
}

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

//デポジットされたethを受け取る
function getUserwallet() {
	contract.get_wallet.call({from:account},(error, result) => {
		if(!error) {
			console.log(account);
			$('#balance').text('残高: ' + result + ' wei')
			console.log(result)
			wallet = Number(result);
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

//使用した水の量と料金の履歴を受け取る
function getHistoryofWater() {
	return new Promise(resolve => {
		contract.get_history_water.call({from:account},(error,result1) => {
			if(!error) {
				console.log(result1)
				contract.get_history_charge.call({from:account},(error,result2) => {
					if(!error) {
						console.log(result2)
						resolve([result1, result2]);
					}
				});
			}
		});
	});
}

//使用した水の量と料金の履歴を表示
function displayHistoryTable(amount) {
	var amount_of_water = amount[0];
	var amount_of_charge = amount[1];
	var len = amount_of_water.length;
	console.log(typeof(amount_of_charge[0]));
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
	for (var i = 0; i < len; i++) {
		label.push(((month + 12 - (len - i) % 12) % 12 + 1) + "月");
	}
	var ctx = document.getElementById('ex_chart');
	var data = {
			labels: label,
			datasets: [{
				label: '水使用量',
				data: amount_of_water,
				borderColor: 'rgba(70, 210, 255, 1)',
				backgroundColor: 'rgba(70, 210, 255, 0.5)'
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

//ストップウォッチの機能
//ストップウォッチのリセット機能
function reset_form() {
	console.log(document.form_sw+ "A")
	if(sw_status == 1)start_count();
	timer = 0;
	document.form_sw.amountofWater.value = 0;
}

function start_count(){
	if(sw_status == 0){
		document.form_sw.bstart.value = "stop";
		sw_status = 1;
		timerID = setInterval("count_up()",100);
	}else{
		document.form_sw.bstart.value = "start";
		sw_status = 0;
		clearInterval(timerID);
	}
}

function count_up(){
	timer++;
	document.form_sw.amountofWater.value = timer;
}

var myEscape = function (str) {
	return str
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');
};



//pending中に表示する
function dispLoadning(msg){
	if(msg == undefined){
		var msg = "";
	}

	var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
	if($("#loading").length == 0){
		$("body").append("<div id='loading'>" + dispMsg + "</div>");
	}
}

//アニメーションを削除
function removeLoading(){
	$("#loading").remove();
}

