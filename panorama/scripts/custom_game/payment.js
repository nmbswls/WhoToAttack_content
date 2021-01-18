$.Msg("cnmcnmcnmcnmcnmcncmn payment load");
function GoBack() {
	$("#InputPage").visible = true;
	$("#HtmlPage").visible = false;
	$("#manual_charge").visible = false;
}

var payHandle = null;
function Pay( method ) {
	$("#InputPage").visible = false;
	$("#HtmlPage").visible = true;
	if (payHandle) {
		var AvalonCoin = $("#AvalonCoin");
		var text = AvalonCoin.text;
		var amount = parseInt(text);
		if (!amount || amount < 0) return;
		payHandle( amount, method );
	}
}

function AvalonCoinInputFocus() {
	$("#AvalonCoin").SetFocus();
	$("#InputPage").visible = true;
	$("#HtmlPage").visible = false;
}

// 鏂囨湰鏀瑰彉
var AvalonCoinLock = false;
function OnAvalonCoinChange() {
	if (AvalonCoinLock) return;
	AvalonCoinLock=true;

	var AvalonCoin = $("#AvalonCoin");
	var text = AvalonCoin.text;
	var m = text.replace(/\D+/g,"");
	var amount = parseInt(m);
	if (amount > 0) {
		AvalonCoin.text = parseInt(m);
	}
	else {
		amount = 0;
		AvalonCoin.text = "0";
	}

	var str = (amount/100).toString()
	if (str.indexOf(".") > 0) {
		$("#PrePayButton").SetDialogVariable("Amount",(amount).toFixed(2).toString());
	}
	else{
		$("#PrePayButton").SetDialogVariable("Amount",Math.floor(amount).toString());
	}
	AvalonCoinLock = false;
}

function AddAvalonCoin(num) {
	var AvalonCoin = $("#AvalonCoin");
	var text = AvalonCoin.text;
	var amount = parseInt(text);
	if (!amount || amount < 0) amount = 0;
	AvalonCoin.text = (amount + num);
}

var closeHandle = null;
function Close() {
	if (closeHandle) {
		closeHandle();
	}
}

// 鏄剧ず浜岀淮鐮?
function ShowQRCode(url) {
	$("#Html").SetURL(url)
	$("#HtmlPage").visible = true;
	$("#url_entry").text = url;
}

function UpdatePaymentPointsRemaining() {
	$("#PayTip").text = "????"
}

function ManualCharge() {
    $("#manual_charge").visible = true;

    var playerId = Players.GetLocalPlayer();
    var playerInfo = Game.GetPlayerInfo( playerId );
    var steamid32 = playerInfo.player_steamid.substring(4);
    steamid32 = parseInt(steamid32) - 1197960265728;
    
    $("#manual_charge_tooltip").SetDialogVariable("steamid", steamid32);
}

function ShowManualQRCode() {
	$("#manual_qrcode_alipay").visible = true;
	$("#manual_qrcode_wechat").visible = true;
}

(function(){
	GameUI.UpdatePaymentPointsRemaining = UpdatePaymentPointsRemaining
	var AvalonCoin = $("#AvalonCoin");
	AvalonCoin.text = 8;
	$("#PrePayButton").SetDialogVariable("Amount", "8");
	$.GetContextPanel().InputFocus = AvalonCoinInputFocus;
	$.GetContextPanel().OnClose = function (f) { closeHandle = f }
	$.GetContextPanel().OnPay = function (f) { payHandle = f }
	$.GetContextPanel().ShowQRCode = ShowQRCode;
	$("#HtmlPage").visible = false;
    $("#manual_charge").visible = false;

    $("#manual_qrcode_alipay").visible = false;
	// $("#manual_qrcode_wechat").visible = false;

	$("#PayTip").text = "fuck"
})()