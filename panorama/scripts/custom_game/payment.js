$.Msg("cnmcnmcnmcnmcnmcncmn payment load");

DONATE_AMOUNT_ARR = [6,30,68,128]

m_ChosenAmountIdx = 0;
m_PayMethod = 0;

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
        $.Msg("cnm on Pay");
		var amount = DONATE_AMOUNT_ARR[m_ChosenAmountIdx];
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


function ShowQRCode(url) {
    var realUrl = "http://47.116.74.28:8099/who_to_kill/store/image?code_url=" + encodeURIComponent(url);
    $("#testtttt").SetImage(realUrl);
	//$("#Html").SetURL(url);
	//setHtml(html)
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

function ChooseAmounIdx(idx){
	m_ChosenAmountIdx = idx;
	var panel = $("#donate_choices");
	for (var i = 0; i < panel.GetChildCount(); i++) {
        var child = panel.GetChild(i)
        child.RemoveClass("Chosen");
    }
	panel.GetChild(m_ChosenAmountIdx).AddClass("Chosen");
	$.Msg("ChooseAmounIdx" + m_ChosenAmountIdx);
}


(function(){
	GameUI.UpdatePaymentPointsRemaining = UpdatePaymentPointsRemaining
	
    $.Msg(encodeURIComponent('http://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3691689833,241053840&fm=15&gp=0.jpg'));
	// $("#testtttt").SetImage("http://47.116.74.28:8099/who_to_kill/store/image?code_url=weixin%3A%2F%2Fwxpay%2Fbizpayurl%3Fpr%3DiGyj6kjzz");
    
	$.GetContextPanel().InputFocus = AvalonCoinInputFocus;
	$.GetContextPanel().OnClose = function (f) { closeHandle = f }
	$.GetContextPanel().OnPay = function (f) { payHandle = f }
	$.GetContextPanel().ShowQRCode = ShowQRCode;
	$("#HtmlPage").visible = false;
    $("#manual_charge").visible = false;

    $("#manual_qrcode_alipay").visible = false;
	// $("#manual_qrcode_wechat").visible = false;

	ChooseAmounIdx(0);
})()
