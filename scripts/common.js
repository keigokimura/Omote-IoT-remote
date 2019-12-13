var account;
var wallet;
var sw_status = 0;
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

//デポジットされたethを受け取る
function getUserwallet() {
	contract.get_wallet.call({from:account},(error, result) => {
		if(!error) {
			$('#balance').text(result + 'wei')
			wallet = Number(result);
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

var myEscape = function (str) {
	return str
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');
};
