var nRefreshCountDown = 0;
var m_ShopItemPanels = {}; 
var m_ShopItemFromSerever_IndexByName = [];

var m_PlayerCollectionData = {"aa":2,"bb":3}

function OpenShop(){
    $("#page_shop").ToggleClass("Hidden");
    //$("#menu_hit_listener").RemoveClass("MenuHidden");
}

function OpenPayment() {
    // if ($.Language() == "schinese") {
        $("#alipay_charge").ToggleClass("Hidden");
    // }else{
    //     var playerInfo = Game.GetPlayerInfo(Players.GetLocalPlayer());
    //     var steamid32 = playerInfo.player_steamid.substring(4);
    //     steamid32 = parseInt(steamid32) - 1197960265728;
    //     $("#paypal_payment_tooltip").SetDialogVariableInt("steamid", steamid32);
    //     $("#paypal_payment").ToggleClass("Hidden");
    // }
    $("#menu_items").RemoveClass("Hidden")
    //$("#menu_hit_listener").RemoveClass("MenuHidden");
}

function ClosePayment() {
    $("#alipay_charge").AddClass("Hidden");
    $("#paypal_payment").AddClass("Hidden");

}

function CloseShop(){
    $("#page_shop").AddClass("Hidden");
}


function UpdateShopItems() {
    var parent = $("#shop_items");
    var points = m_PointsLeft;
    var childCount = parent.GetChildCount();

    for (var i = 0; i < childCount; i++) {
        var child = parent.GetChild(i)
        var cost = child.cost;
        if (cost > points) {
            child.enabled = false;
            child.AddClass("NotEnoughPoints");
        }else{
            child.enabled = true;
            child.RemoveClass("NotEnoughPoints");
        }
    }
}

function ShowConfirmPurchaseDialog(name, cost){
    $("#confirm_purchase").SetDialogVariableInt("cost", cost);
    $("#confirm_purchase").SetDialogVariable("item_name", $.Localize("econ_" + name));
    $("#confirm_purchase").SetDialogVariable("item_description", $.Localize("Description_" + name));
    $("#confirm_purchase_dialog").RemoveClass("Hidden");
    psz_PurchaseItemName = name; //临时变量
}
function OnConfirmPurchase() {
    GameEvents.SendCustomGameEventToServer('bom_player_purchase', {
        ItemName: psz_PurchaseItemName,
    })
	OnPurchaseMessageArrived(null);
}

function OnPurchaseMessageArrived(args) {
    QueryShopRelatedDataFromServer();
    // GameEvents.SendCustomGameEventToServer("bom_player_equip",{})
    HideConfirmPurchasePanel();
}


function HideConfirmPurchasePanel() {
    $("#confirm_purchase_dialog").AddClass("Hidden");
}

function BuildShopItems(data) {
    var parent = $("#shop_items");
    parent.RemoveAndDeleteChildren();

    for (var index in data){
        var itemData = data[index];
        var itemName = itemData.name;

        //m_ShopItemFromSerever_IndexByName[itemName] = itemData;
        var itemImage = itemData.image;

        var itemCost = itemData.cost;
        var itemDiscount = itemData.discount;

        m_ShopItemPanels[itemName] = $.CreatePanel("Panel", parent, "");
        m_ShopItemPanels[itemName].BLoadLayoutSnippet("ShopItem");
        m_ShopItemPanels[itemName].FindChildTraverse("shop_item_title").text = $.Localize("econ_" + itemName);

        m_ShopItemPanels[itemName].FindChildTraverse("shop_item_image").SetImage("file://{resources}/images/custom_game/econ/" + itemName + ".png");

        m_ShopItemPanels[itemName].FindChildTraverse("purchase_cost_text").SetDialogVariable("cost", String(itemCost));
        m_ShopItemPanels[itemName].cost = itemCost;
        // if (m_PointsLeft > 0){
            // if (itemCost > m_PointsLeft ) {
                // m_ShopItemPanels[itemName].enabled = false;
                // m_ShopItemPanels[itemName].AddClass("NotEnoughPoints")
            // }else {
                // m_ShopItemPanels[itemName].enabled = true;
                // m_ShopItemPanels[itemName].RemoveClass("NotEnoughPoints")
            // }
        // }

        if (itemDiscount !== undefined){
            m_ShopItemPanels[itemName].FindChildTraverse("sale_overlay").RemoveClass("DontShow");
        }

        (function(index){
            var itemData = data[index]
            m_ShopItemPanels[itemData.name].SetPanelEvent("onactivate", function(){
				ShowConfirmPurchaseDialog(itemData.name, itemData.cost);
            });
            m_ShopItemPanels[itemData.name].FindChildTraverse('preview_button').SetPanelEvent("onactivate", function(){
                GameEvents.SendCustomGameEventToServer('bom_player_preview', {item: itemData.name})
                $("#page_shop").AddClass("Hidden");
            });
            m_ShopItemPanels[itemData.name].SetPanelEvent("onmouseover", function(){
                $.DispatchEvent("DOTAShowTextTooltip", m_ShopItemPanels[itemData.name], $.Localize('#description_'+itemData.name));
            });
            m_ShopItemPanels[itemData.name].SetPanelEvent("onmouseout", function(){
                $.DispatchEvent("DOTAHideTextTooltip");
            });
        })(index);
    }

    RebuildShopTags();
}

function RebuildShopTags() {
    if (Object.keys(m_ShopItemPanels).length <= 0 || m_PlayerCollectionData == undefined) {
        $.Schedule(1, RebuildShopTags);
        return;
    }
    for (var name in m_PlayerCollectionData) {
        if (name != "steamid" && m_ShopItemPanels[name] != null) {
            m_ShopItemPanels[name].AddClass("Owned");
        }
    }
}

function QueryShopItemsFromServer() {
    GameEvents.SendCustomGameEventToServer('bom_player_ask_shop_items', {})
}

function OnShopItemsArrived() {
	
    var data = CustomNetTables.GetTableValue('econ_data', 'shop_items');
    // if (data == null) {
		// QueryShopItemsFromServer();
		// return;
	// }
	data = {1:{"name":"t10","image":"",cost:2},2:{"name":"t13","image":"",cost:2},3:{"name":"t15","image":"",cost:2}}
    $.Msg("hello");
	BuildShopItems(data);
}

function OnCollectionDataArrived() {
    // var data = CustomNetTables.GetTableValue('econ_data', 'collection_data_' + Players.GetLocalPlayer());
    // if (data == null) return;
    // RebuildCollections(data);
    // RebuildShopTags(data);
}

function QueryShopRelatedDataFromServer(){
    QueryShopItemsFromServer();
    $("#refresh_button").enabled = false;
    nRefreshCountDown = 60; //60s 保护
    RefreshingRefreshCountDown()
}

function RefreshingRefreshCountDown() {
    nRefreshCountDown--;
    var label = $("#refresh_button_label");
    label.text = $.Localize("#Refresh") + "(" + nRefreshCountDown + ")";
    if (nRefreshCountDown <= 0){
        $("#refresh_button").enabled = true;
        label.text = $.Localize("#Refresh");
    }
    $.Schedule(1, RefreshingRefreshCountDown);
}

function OnPay( amount, method ) {
    // CheckDonateOrderCount = 0;
    // Request( "create_donate_order", {price:amount, method:method}, function (data) {
        // $.Msg(data.url);
        // if (data.url) {
            // $("#AvalonPayment").ShowQRCode(data.url);
        // } else {
            // CheckDonateOrder();
        // }
    // })
}

function OnPaymentComplete(kv) {
    if (!$("#alipay_charge").BHasClass("Hidden")) {
        $("#alipay_charge").AddClass("Hidden");
        $("#charge_button_text").text = $.Localize("#charge");
    }

    //QueryPointsDataFromServer();
    $("#page_shop").RemoveClass("Hidden");
    //$("#menu_hit_listener").RemoveClass("MenuHidden");
}

(function(){
    //OnCollectionDataArrived();
    OnShopItemsArrived();
    //OnPointHistoryArrived();

    var PaymentPanel = $("#payment_panel");
    PaymentPanel.BLoadLayout("file://{resources}/layout/custom_game/payment.xml", false, false);
    PaymentPanel.OnPay(OnPay);

    GameEvents.Subscribe("avalon_payment_complete", OnPaymentComplete);

    QueryShopRelatedDataFromServer();
    //CustomNetTables.SubscribeNetTableListener('econ_data', OnCollectionDataArrived);
    CustomNetTables.SubscribeNetTableListener('econ_data', OnShopItemsArrived);
    //CustomNetTables.SubscribeNetTableListener('econ_data', OnPointHistoryArrived);

    GameUI.OpenPayment = OpenPayment;
})();