function AutoShowAbilityLevel(){
	var abilities = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AbilitiesAndStatBranch");
	if (abilities === null){
		$.Schedule(0.1, AutoShowAbilityLevel);
		return;
	}

	var m_QueryUnit = Players.GetLocalPlayerPortraitUnit();
	for(var i = 0; i < 10; ++i){
		
		var abilityIndex = Entities.GetAbility(m_QueryUnit, i);
		var ability = abilities.FindChildTraverse("Ability" + i);
		var abilityName = Abilities.GetAbilityName(abilityIndex);
        
        
        
		if (ability != null) {
			var levelPips = ability.FindChildTraverse("AbilityLevelContainer");
            
            // if(abilityName.indexOf("build") == -1 && abilityName.indexOf("empty") == -1){
                // levelPips.style.visibility = "visible";
                // continue;
            // }
            
            levelPips.style.visibility = "collapse";
            
            
			//levelPips.style.visibility = "collapse";

			var buttonAndLevel = ability.FindChildTraverse("ButtonAndLevel");
			var levelNumber = buttonAndLevel.FindChildTraverse("XAbilityLevelNumbers");
			if (levelNumber == null || levelNumber == undefined){
				levelNumber = $.CreatePanel("Label", buttonAndLevel, "XAbilityLevelNumbers");
				levelNumber.style.verticalAlign = "bottom";
				levelNumber.style.horizontalAlign = "center";
				levelNumber.style.marginBottom = "10px";
				levelNumber.style.fontSize = "22px";
			}
			var clevel = Abilities.GetLevel(abilityIndex);
			if (Entities.GetTeamNumber(m_QueryUnit) !== Entities.GetTeamNumber(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))) clevel = "?"
			var mlevel = Abilities.GetMaxLevel(abilityIndex);



			levelNumber.text = clevel + "/" + mlevel;
            
            if(abilityName.indexOf("empty") == 0){
                levelNumber.text = "";
            }
            if(abilityName.indexOf("build") == -1){
                levelNumber.text = "";
            }
			// if (abilityName == "empty1" 
				// || abilityName == "empty2" 
				// || abilityName == "empty3" 
				// || abilityName == "empty4" 
				// || abilityName == "empty5" 
				// || abilityName == "empty6"
				// ){
				// levelNumber.text = "";
			// }
		}
	}
	$.Schedule(0.1, AutoShowAbilityLevel);
}

function EnterRemoveMode(){
	m_InRemoveMode = true;
	var abilities = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AbilitiesAndStatBranch");
	var m_LocalHero = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
	for(var i = 0; i < 12; i++){
		var ability = abilities.FindChildTraverse("Ability" + i)
		if (ability != null){
			var abilityButton = ability.FindChildTraverse("AbilityButton");
			var abilityName = Abilities.GetAbilityName(Entities.GetAbility(m_LocalHero, i));
			// if (abilityName == "empty_1" || 
			// 	abilityName == "empty_2" ||
			// 	abilityName == "empty_3" ||
			// 	abilityName == "empty_4" ||
			// 	abilityName == "empty_5" ||
			// 	abilityName == "empty_6" ||
			// 	abilityName == "empty_a1" ||
			// 	abilityName == "empty_a2" ||
			// 	abilityName == "empty_a3" ||
			// 	abilityName == "empty_a4" ||
			// 	abilityName == "empty_a5" ||
			// 	abilityName == "empty_a6"
			// 	) {
			// 	continue; // 空技能无法移除
			// }
			abilityButton.style.washColor = "#881212";
			abilityButton.SetPanelEvent("oncontextmenu", (function(arg){
				return function(){
					if (!m_InRemoveMode) return;
					var abilityName = Abilities.GetAbilityName(Entities.GetAbility(m_LocalHero, arg));
					if (GameUI.IsControlDown()) {
						abilityName = "Canceled"
					}
					GameEvents.SendCustomGameEventToServer("ConfirmAbilityRemove", {
						AbilityName:abilityName
					})
					EndRemoveMode();
				}
			})(i));
		}
	}
}

function EndRemoveMode(){
	m_InRemoveMode = false;
	var abilities = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AbilitiesAndStatBranch");
	for(var i = 0; i < 12; i++){
		var ability = abilities.FindChildTraverse("Ability" + i)
		if (ability != null){
			var abilityButton = ability.FindChildTraverse("AbilityButton")
			abilityButton.style.washColor = "#ffffff";
		}
	}
}

(function() {
	$.Schedule(0.3, AutoShowAbilityLevel)
    
    GameEvents.Subscribe("player_remove_ability", EnterRemoveMode);
	GameEvents.Subscribe("player_confirm_ability_remove", EndRemoveMode);
    
})();