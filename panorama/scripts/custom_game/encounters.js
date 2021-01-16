(function () {
    //GameEvents.Subscribe( "show_cards", OnShowCards);
    GameEvents.Subscribe( "show_encounters", OnRefreshEncounters);
    GameEvents.Subscribe( "ChooseEncounterRsp", OnChooseEncounterRsp);
})();

ECHOOSEED = false;
NOENCOUNTER = false;
ENCOUNTERS_LIST = {}
SHOW_STATE = false;


function CardLockUnlock(){
    GameEvents.SendCustomGameEventToServer("lock_cards_req", {
        locked : !CARD_LOCKED
    });
}

function OnRefreshEncounters(keys){
    var elist = keys.encounters;
    NOENCOUNTER = false;
    if(!elist){
        $.Msg("empty empty");
        SHOW_STATE = false;
        
        $("#EncounterSelection").SetHasClass("show", false);
        $("#EncounterSelection_Body").RemoveClass("draw");
        NOENCOUNTER = true;
        $("#EncounterSelection_NoEventHint").style['opacity'] = 1;
        return;
    }
	ENCOUNTERS_LIST = new Array(3);
    ECHOOSEED = false;
    for(var n in elist){
        var eid = elist[n];
        ENCOUNTERS_LIST[n] = eid;
    }
    
	OnShowEncounters();
}


function OnChooseEncounterRsp(keys){
    if(!keys.ret)
	{
		return;
	}
	EncounterShowHide();
	ECHOOSEED = true;
}

function OnShowEncounters(){
	
    SHOW_STATE = true;
    
    var eids = ENCOUNTERS_LIST;
    var selectionPanel = $("#EncounterSelection_Body");
    
    
    for (var k in eids) {
        var eid = eids[k];
        
        $.Msg("one eid: " + eid);
        var panelID = "encounter_" + k;
        var panel = selectionPanel.FindChildTraverse(panelID);
        if (panel == undefined && panel == null) {
            panel = $.CreatePanel("Panel", selectionPanel, panelID);
            panel.BLoadLayoutSnippet("Encounter");
            InitPanelEvent(panel);
        }
        //var unitData = GameUI.UnitInfoConfig[name]
		
		// var extra = ''
		// if (unitData != null) {
			// var cc = unitData['class'];
			// $.Msg('name ' + name + " c " + cc)
			// extra += ' ' + $.Localize(cc);
			
			// var cost = unitData['cost']
			// extra += '/' + cost;
		// }
		
        panel.idx =  k
        
        
        panel.style['opacity'] = 1;
        
		var entData = GameUI.EncounterInfo[eid]
		
		panel.FindChildTraverse("EncounterName").text = eid;
		
		if (entData != null) {
			panel.FindChildTraverse("EncounterName").text = $.Localize(entData['title']);
			panel.FindChildTraverse("EncounterDesp").text = $.Localize(entData['story_desp']);
            panel.FindChildTraverse("EncounterDespEffect").text = $.Localize(entData['effect_desp']);
		}
		
    }
    $("#EncounterSelection_NoEventHint").style['opacity'] = 0;
    
    $("#EncounterSelection").SetHasClass("show", true);
    $("#EncounterSelection_Body").AddClass("draw");
}



function InitPanelEvent(panel) {
    panel.SetPanelEvent("onactivate", function() {
        ChooseEncounter(panel.idx)
    });
}


function ChooseEncounter(eidx){
	
    GameEvents.SendCustomGameEventToServer("ChooseEncounterReq", {
        eidx : eidx
    });
	
}

function EncounterShowHide(){
	if(ECHOOSEED){
		return;
	}
    if(NOENCOUNTER){
        return;
    }
    SHOW_STATE = !SHOW_STATE;
    if(SHOW_STATE){
        $("#EncounterSelection").SetHasClass("show", true);
        $("#EncounterSelection_Body").AddClass("draw");
    }else{  
        $("#EncounterSelection").SetHasClass("show", false);
        $("#EncounterSelection_Body").RemoveClass("draw");
    }
}
