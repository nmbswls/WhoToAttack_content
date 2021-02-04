var nRefreshCountDown = 0;
var m_PointsLeft = 5;
var m_ShopItemPanels = {}; 
var m_ShopItemFromSerever_IndexByName = [];
var m_SlotEquipInfo = {}; 

var m_PlayerCollectionData = {}

var m_ShopLinesPanels = {}; 
var SHOP_TAGS = ["tab1","tab2","tab3","tab4"]

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
    var points = m_PointsLeft;
	
	for (var k in m_ShopItemPanels) {
		var panel = m_ShopItemPanels[k];
		
        var cost = panel.cost;
        if (cost > points) {
            panel.enabled = false;
            panel.AddClass("NotEnoughPoints");
        }else{
            panel.enabled = true;
            panel.RemoveClass("NotEnoughPoints");
        }
    }
	
    // for (var i = 0; i < childCount; i++) {
        // var child = parent.GetChild(i)
        // var cost = child.cost;
        // if (cost > points) {
            // child.enabled = false;
            // child.AddClass("NotEnoughPoints");
        // }else{
            // child.enabled = true;
            // child.RemoveClass("NotEnoughPoints");
        // }
    // }
}

function ShowConfirmPurchaseDialog(name, cost){
    if(!m_ShopItemPanels[name]){
        return;
    }
        
    if(m_ShopItemPanels[name].BHasClass("Owned")){
        return;
    }
    
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
}



function HideConfirmPurchasePanel() {
    $("#confirm_purchase_dialog").AddClass("Hidden");
}

function InitTabContainers() {
	var lineContainer = $("#shop_lines");
	for(var tagName in SHOP_TAGS){
		var tabName = SHOP_TAGS[tagName];
		m_ShopLinesPanels[tabName] = $.CreatePanel("Panel", lineContainer, "");
		m_ShopLinesPanels[tabName].BLoadLayoutSnippet("ShopLine");
		m_ShopLinesPanels[tabName].FindChildTraverse("line_subtitle_text").text = $.Localize(tabName);
	}
}

function BuildShopItems(data) {
	
	for (var k in m_ShopLinesPanels) {
		var panel = m_ShopLinesPanels[k].FindChildTraverse("shop_items");
        panel.RemoveAndDeleteChildren();
    }
	
	for (var index in data){
		var itemData = data[index];
		var itemName = itemData.name;
		
		var configInfo = GameUI.EconInfoConfig[itemName];
		if(!configInfo){
			continue;
		}
		
		var slot = configInfo['slot'];
		
		if(slot == undefined){
			continue;
		}
		var container = m_ShopLinesPanels[SHOP_TAGS[slot]];
		if(!container){
			continue;
		}
		var parent = container.FindChildTraverse("shop_items");
		$.Msg("add " + itemName);

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
				GameEvents.SendCustomGameEventToServer('player_preview_req', {item: itemData.name})
				$("#page_shop").AddClass("Hidden");
			});
			m_ShopItemPanels[itemData.name].FindChildTraverse('equip_button').SetPanelEvent("onactivate", function(){
				GameEvents.SendCustomGameEventToServer('player_equip_req', {to_equip: itemData.name})
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
	
	for (var k in m_ShopLinesPanels) {
		var panel = m_ShopLinesPanels[k].FindChildTraverse("shop_items");
		if(!panel)continue;
        if(panel.GetChildCount() > 0){
			m_ShopLinesPanels[k].FindChildTraverse('no_good_text').style['visibility'] = 'collapse';
		}else{
			m_ShopLinesPanels[k].FindChildTraverse('no_good_text').style['visibility'] = 'visible';
		}
    }

    RebuildShopTags();
}

function RebuildShopTags() {
    if (Object.keys(m_ShopItemPanels).length <= 0 || m_PlayerCollectionData == undefined) {
        $.Schedule(1, RebuildShopTags);
        return;
    }
    for (var k in m_PlayerCollectionData) {
		var name = m_PlayerCollectionData[k];
        if (name != "steamid" && m_ShopItemPanels[name] != null) {
			$.Msg("collection data " + name);
            m_ShopItemPanels[name].AddClass("Owned");
        }
    }
    
    for (var k in m_ShopItemPanels) {
		var panel = m_ShopItemPanels[k];
        panel.RemoveClass("Equiped");
    }
    
    for (var k in m_SlotEquipInfo) {
		var name = m_SlotEquipInfo[k];
        if (name != "steamid" && m_ShopItemPanels[name] != null) {
            m_ShopItemPanels[name].AddClass("Equiped");
        }
    }
    
}

function QueryShopItemsFromServer() {
    GameEvents.SendCustomGameEventToServer('player_query_shop_items_req', {})
}

function OnPlayerPurchaseRsp() {
	QueryShopRelatedDataFromServer();
	//GameEvents.SendCustomGameEventToServer("bom_player_equip",{})
	HideConfirmPurchasePanel();
}

function BuildPointsInfo(data) {
	m_PointsLeft = data.amount;
	$("#my_point_value").text = Math.floor(m_PointsLeft);
	UpdateShopItems();
}

function OnShopItemsArrived(table_name, key, data) {
	if(key != 'shop_items')
	{
		return;
	}
	$.Msg( "Table ", table_name, " changed: '", key, "' = ", data );
    var data = CustomNetTables.GetTableValue('econ_data', 'shop_items');
    if (data == null) {
		return;
	}
	BuildShopItems(data);
	UpdateShopItems();
}

function OnPointHistoryArrived(table_name, key, data) {
	
	if(key != 'coin_data_' + Players.GetLocalPlayer())
	{
		return;
	}
	$.Msg( "Table ", table_name, " changed: '", key, "' = ", data );
    var data = CustomNetTables.GetTableValue('econ_data', 'coin_data_' + Players.GetLocalPlayer());
    if (data == null) return;
	
    BuildPointsInfo(data);
}

function RebuildCollections(data){
	m_PlayerCollectionData = data;
}


function OnCollectionDataArrived(table_name, key, data) {
	
	if(key != 'collection_data_' + Players.GetLocalPlayer())
	{
		return;
	}
	
	$.Msg( "Table ", table_name, " changed: '", key, "' = ", data );
    var data = CustomNetTables.GetTableValue('econ_data', 'collection_data_' + Players.GetLocalPlayer());
    if (data == null) return;
	
    RebuildCollections(data);
    RebuildShopTags();
}

function OnEquipDataArrived(table_name, key, data){
    if(key != 'equip_info_' + Players.GetLocalPlayer())
	{
		return;
	}
    $.Msg( "Table ", table_name, " changed: '", key, "' = ", data );
    var data = CustomNetTables.GetTableValue('econ_data', 'equip_info_' + Players.GetLocalPlayer());
    if (data == null) return;
    
    m_SlotEquipInfo = data
    
    RebuildShopTags();
}

function QueryCollectionDataFromServer() {
    GameEvents.SendCustomGameEventToServer('player_query_econ_data_req', {})
}

function QueryShopRelatedDataFromServer(){
    QueryShopItemsFromServer();
	QueryCollectionDataFromServer();
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

    var PaymentPanel = $("#payment_panel");
    PaymentPanel.BLoadLayout("file://{resources}/layout/custom_game/payment.xml", false, false);
    PaymentPanel.OnPay(OnPay);

    GameEvents.Subscribe("avalon_payment_complete", OnPaymentComplete);
	InitTabContainers()
    QueryShopRelatedDataFromServer();
    CustomNetTables.SubscribeNetTableListener('econ_data', OnCollectionDataArrived);
    CustomNetTables.SubscribeNetTableListener('econ_data', OnShopItemsArrived);
    CustomNetTables.SubscribeNetTableListener('econ_data', OnPointHistoryArrived);
    CustomNetTables.SubscribeNetTableListener('econ_data', OnEquipDataArrived);
    
	
	GameEvents.Subscribe('player_purchase_rsp', OnPlayerPurchaseRsp);
	
    GameUI.OpenPayment = OpenPayment;
})();