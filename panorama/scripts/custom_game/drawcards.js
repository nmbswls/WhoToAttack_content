(function () {
    //GameEvents.Subscribe( "show_cards", OnShowCards);
    GameEvents.Subscribe( "show_cards", OnShowCards);
    GameEvents.Subscribe( "pick_cards_rsp", OnPickCardRsp);
    GameEvents.Subscribe( "lock_cards_rsp", OnLockCardRsp);
    
    
})();

Game.AddCommand( "+ShowHideCards", CardShowHide, "",0);
DRAW_CARD_NAMES = {}
CARD_LOCKED = false;
CARD_SHOW_STATE = false;



function CardDrawNew(){
    GameEvents.SendCustomGameEventToServer("draw_cards_req", {
        
    });
}


function CardShowHide(){
    CARD_SHOW_STATE = !CARD_SHOW_STATE;
    if(CARD_SHOW_STATE){
    	//$("#CardSelection_Body").style['opacity'] = 1;
        $("#CardSelection").SetHasClass("show", true);
        $("#CardSelection_Body").AddClass("draw");
    }else{
        //$("#CardSelection_Body").style['opacity'] = 0;    
        $("#CardSelection").SetHasClass("show", false);
        $("#CardSelection_Body").RemoveClass("draw");
    }
}

function CardLockUnlock(){
    GameEvents.SendCustomGameEventToServer("lock_cards_req", {
        locked : !CARD_LOCKED
    });
}

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
	OnShowCards();
}

function OnLockCardRsp(keys){
	var locked = keys.locked;
	CARD_LOCKED = locked;
    
    $("#CardSelection_Lock_Label").text = locked ? "解锁" : "锁定";
    
}

function OnPickCardRsp(keys){
    
    var idx = keys.buy_idx;
    var cardSelectionPanel = $("#CardSelection_Body");
	var panelID = "card_"+idx;
	var panel = cardSelectionPanel.FindChildTraverse(panelID);
    $.Msg("on pick card rsp " + panelID);
	panel.style['opacity'] = 0;
	DRAW_CARD_NAMES[buy_index] = null;
}

function OnShowCards(keys){
	$('#hand_cards').text = keys.hand_cards;
    
    CARD_SHOW_STATE = true;
    
    var names = keys.hand_cards.split(',')
    var cardSelectionPanel = $("#CardSelection_Body");
    
    
    for (var k in names) {
        var name = names[k];
        if(name == null || name == "")continue;
        //$.Msg("names: " + name);
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
    
    if(!CARD_SHOW_STATE){
        return;
    }
    
    CARD_SHOW_STATE = false;
    
    $("#CardSelection").SetHasClass("show", false);
    $("#CardSelection_Body").RemoveClass("draw");

}

function CardPicked(cardIdx){
   
    GameEvents.SendCustomGameEventToServer("PickCard", {
        card_idx : cardIdx
    });
    $.Msg("clicked " + cardIdx);
    //$("#CardSelection").SetHasClass("show", false);
    //$("#CardSelection_Body").RemoveClass("draw");
}
