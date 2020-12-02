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
