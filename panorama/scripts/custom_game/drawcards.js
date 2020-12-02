function SetCardAbilityPanelEvent(panel,abilityName) {
   
    var parent = $("#AbilitySelectorAbilityBody");

   panel.SetPanelEvent("onactivate", function(){
        GameEvents.SendCustomGameEventToServer("CardSelect", {
            ability_name : abilityName,
            player_id : Players.GetLocalPlayer(),
            spell_book_selected: $("#SaveSpellBookCheckBox").IsSelected(),
            ui_secret: parent.ui_secret
        });
        $("#AbilitySelectorPanelRoot").SetHasClass("Show", false);
   });

   panel.SetPanelEvent("onmouseover", function() {
        $.DispatchEvent("DOTAShowAbilityTooltip", panel, abilityName);
   });
   panel.SetPanelEvent("onmouseout", function() {
        $.DispatchEvent("DOTAHideAbilityTooltip");
   })    
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
        //panel.FindChildTraverse("CardImage").SetImage("file://{images}/custom_game/card/"+heroName+".png");
        panel.FindChildTraverse("CardName").text = $.Localize(name);
        panel.idx =  k
    }

    $("#CardSelection").SetHasClass("show", true);
    $("#CardSelection_Body").AddClass("draw");
}

function OnPingOpenDoors(keys) {
    
    var loc = [keys.x, keys.y, keys.z];
    for(var i=0;i<3;i++){
        $.Schedule(i*0.8, function(){
            GameUI.PingMinimapAtLocation(loc);
        });
    }
}

function InitCardPanelEvent(panel) {
    panel.SetPanelEvent("onactivate", function() {
        
        CardPicked(panel.idx)
    });
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
