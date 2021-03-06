(function () {
    //GameEvents.Subscribe( "show_cards", OnShowCards);
    GameEvents.Subscribe( "show_cards", OnRefreshCard);
    GameEvents.Subscribe( "pick_cards_rsp", OnPickCardRsp);
    GameEvents.Subscribe( "lock_cards_rsp", OnLockCardRsp);
    
    
})();

var ClassColorMap = {
    "class_evil": '#80330d',
    "class_wizard": '#5bc0de',
    "class_nature": '#5cb85c',
    "class_hidden": '#5b0d80',
    "class_brawn": '#f0ad4e',
    "class_vibrant": '#d9534f',
};


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

function OnRefreshCard(keys){
    var cardList = keys.hand_cards;
    
	//var cards = keys.cards.split(',');
	DRAW_CARD_NAMES = new Array(5);
    
    for(var n in cardList){
        var cardName = cardList[n];
        //$.Msg("refresh card " + cardName);
        DRAW_CARD_NAMES[n] = cardName;
    }
    
	OnShowCards();
}

function OnLockCardRsp(keys){
	var locked = keys.locked;
	CARD_LOCKED = locked;
    
    $("#CardSelection_Lock_Label").text = locked ? "解锁" : "锁定";
    
}

function OnPickCardRsp(keys){
    if(!keys.ret)
	{
		return;
	}
    var idx = keys.buy_idx;
    var cardSelectionPanel = $("#CardSelection_Body");
	var panelID = "card_"+idx;
	var panel = cardSelectionPanel.FindChildTraverse(panelID);
    //$.Msg("on pick card rsp " + panelID);
	panel.style['opacity'] = 0;
	DRAW_CARD_NAMES[idx] = null;
}

function OnShowCards(){
	
    CARD_SHOW_STATE = true;
    
    var names = DRAW_CARD_NAMES;
    var cardSelectionPanel = $("#CardSelection_Body");
    
    
    for (var k in names) {
        var name = names[k];
        
        //$.Msg("names: " + name);
        var panelID = "card_"+k;
        var panel = cardSelectionPanel.FindChildTraverse(panelID);
        if (panel == undefined && panel == null) {
            panel = $.CreatePanel("Panel", cardSelectionPanel, panelID);
            panel.BLoadLayoutSnippet("Card");
            InitCardPanelEvent(panel);
        }
        var unitData = GameUI.UnitInfoConfig[name]
		var classColor = "white";
		var extra = ''
		if (unitData != null) {
			var cc = unitData['class'];
			//$.Msg('name ' + name + " c " + cc)
			extra += ' ' + $.Localize(cc);
			
			var cost = unitData['cost']
			extra += '/' + cost;
			classColor = ClassColorMap[cc] || classColor;
		}
		
        var abilityPanel = panel.FindChildTraverse("CardBottomBar");
        InitAbilityEvent(abilityPanel, unitData);
        panel.idx =  k       
        if(name == null || name == ""){
            panel.style['opacity'] = 0; 
            continue;
        }
        panel.style['opacity'] = 1;
        panel.FindChildTraverse("CardImage").SetImage("file://{images}/custom_game/img_"+name+".png");
        //panel.FindChildTraverse("CardSkill").SetImage("file://{images}/custom_game/card/"+name+".png");
        panel.FindChildTraverse("CardName").text = $.Localize(name);
		panel.FindChildTraverse("CardDesp").text = extra;
		panel.FindChildTraverse("CardDesp").style.color = classColor;
        
    }

    $("#CardSelection").SetHasClass("show", true);
    $("#CardSelection_Body").AddClass("draw");
}



function InitCardPanelEvent(panel) {
    panel.SetPanelEvent("onactivate", function() {
        
        CardPicked(panel.idx)
    });
    
    
}

function InitAbilityEvent(abilityPanel, unitData) {
    // 映射

	if(!unitData){
		return;
	}
	var abilityName = unitData['despSkill'];
	if(!abilityName){
		return;
	}
	abilityPanel.SetPanelEvent("onmouseover", function() {
		$.DispatchEvent("DOTAShowAbilityTooltip", abilityPanel, abilityName);
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
    
    //$("#CardSelection").SetHasClass("show", false);
    //$("#CardSelection_Body").RemoveClass("draw");
}
