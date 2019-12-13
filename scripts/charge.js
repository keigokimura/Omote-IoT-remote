//pending中に表示する
function dispLoadning(){
	var msg = "now sending Transaction...."
	var dispMsg = "<div class='loadingMsg loadGif'><h3>" + msg + "</h3></div>";
	if($("#loading").length == 0){
		$("body").append("<div id='loading'>" + dispMsg + "</div>");
	}
}

//入金成功時に表示する
function dispSuccess(){
	var msg = "入金(チャージ)が完了しました";
	var dispMsg = "<div class='loadingMsg successIcon'><h3>" + msg + "</h3></div>";
	if($("#loading").length == 0){
		$("body").append("<div id='loading'>" + dispMsg + "</div>");
	}
	setTimeout(function(){location.href = '../'},2500);
}

//入金失敗時に表示する
function dispFailed(){
	var msg = "入金(チャージ)できませんでした";
	var dispMsg = "<div class='loadingMsg failIcon'><h3>" + msg + "</h3><a href='../'>閉じる</a></div>";
	if($("#loading").length == 0){
		$("body").append("<div id='loading'>" + dispMsg + "</div>");
	}
}

//アニメーションを削除
function removeLoading(){
	$("#loading").remove();
}

//depositする
function Deposit() {
	var input = $('#charge').val();
	dispLoadning();
	contract.deposit.sendTransaction({from:account,to:contractAddress,value:web3.toWei(input, "wei")},(error,transactionHash) => {
		getUserwallet();
		if(!error){
			var timerId = setInterval(function(){
				web3.eth.getTransactionReceipt(transactionHash,(error,resultReceipt) => {
					if(resultReceipt !== null) {
						web3.eth.getTransactionReceipt(transactionHash,(error,resultReceipt) => {
							if(!resultReceipt.status){
								clearInterval(timerId);
								removeLoading();
								dispFailed();
							} else {
								clearInterval(timerId);
								removeLoading();
								dispSuccess();
							}
						});
					}
				});
			},500);
		}else{
			console.log(error);
			removeLoading();
			dispFailed();
		}
	});
}

//送金ボタンを押したとき
function chargeButton() {
	var charge = $('#charge').val();
	if (charge == "") {
		$('#error').text("金額を入力してください");
	} else if (charge <= 0) {
		$('#error').text("正しい金額を入力してください");
	} else {
		$('#error').text("");
		Deposit();
	}
}

$(function(){
	init().then(result => {
		getUserwallet();
	});
	setInterval(function(){getUserwallet();},3000);
});
