(function () {
    GameEvents.Subscribe( "show_cards", OnShowCards);
    GameEvents.Subscribe( "pick_cards_rsp", OnPickCardRsp);
})();

function OnRefreshCard(){
	var cards = keys.cards.split(',');
	MY_DRAW_CHESS_LIST = {};
    if (cards && cards.length>1){
        for (var i=0;i<cards.length;i++){
            if (cards[i]){
                MY_DRAW_CHESS_LIST[i] = cards[i];
            }
        }
    }
		
}

DRAW_CARD_NAMES = {}

function OnPickCardRsp(keys){
    var idx = keys.buy_idx;
    var cardSelectionPanel = $("#CardSelection_Body");
	var panelID = "card_"+idx;
	var panel = cardSelectionPanel.FindChildTraverse(panelID);
	panel.style['opacity'] = 0;
	DRAW_CARD_NAMES[buy_index] = null;
}

function OnShowCards(keys){
	$('#hand_cards').text = keys.hand_cards;
    
    var names = keys.hand_cards.split(',')
    var cardSelectionPanel = $("#CardSelection_Body");
    
    
    for (var k in names) {
        var name = names[k];
        if(name == null || name == "")continue;
        $.Msg("names: " + name);
        var panelID = "card_"+k;
        var panel = cardSelectionPanel.FindChildTraverse(panelID);
        if (panel == undefined && panel == null) {
            panel = $.CreatePanel("Panel", cardSelectionPanel, panelID);
            panel.BLoadLayoutSnippet("Card");
            InitCardPanelEvent(panel);
        }
        panel.style['opacity'] = 1;
        var abilityPanel = panel.FindChildTraverse("CardBottomBar");
        InitAbilityEvent(abilityPanel, name);
        //panel.FindChildTraverse("CardImage").SetImage("file://{images}/custom_game/card/"+heroName+".png");
        //panel.FindChildTraverse("CardSkill").SetImage("file://{images}/custom_game/card/"+name+".png");
        panel.FindChildTraverse("CardName").text = $.Localize(name);
        panel.idx =  k
    }

    $("#CardSelection").SetHasClass("show", true);
    $("#CardSelection_Body").AddClass("draw");
}



function InitCardPanelEvent(panel) {
    panel.SetPanelEvent("onactivate", function() {
        
        CardPicked(panel.idx)
    });
    
    
}

function InitAbilityEvent(abilityPanel, heroName) {
    // 映射
   abilityPanel.SetPanelEvent("onmouseover", function() {
        $.DispatchEvent("DOTAShowAbilityTooltip", abilityPanel, "lone_druid_spirit_bear_entangle");
   });
   abilityPanel.SetPanelEvent("onmouseout", function() {
        $.DispatchEvent("DOTAHideAbilityTooltip");
   })    
}

function CloseCardSelection() {
    $("#CardSelection").SetHasClass("show", false);
    $("#CardSelection_Body").RemoveClass("draw");
}

function CardPicked(cardIdx){
   
    GameEvents.SendCustomGameEventToServer("PickCard", {
        card_idx : cardIdx
    });
    $.Msg("clicked " + cardIdx);
    $("#CardSelection").SetHasClass("show", false);
    $("#CardSelection_Body").RemoveClass("draw");
}
