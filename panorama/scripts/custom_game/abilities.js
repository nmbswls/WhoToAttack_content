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



(function() {
    $.Msg("load");
	$.Schedule(0.3, AutoShowAbilityLevel)
})();