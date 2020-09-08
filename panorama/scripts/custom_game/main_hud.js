(function () {
    GameEvents.Subscribe( "init_time", InitShowTime );
    GameEvents.Subscribe( "show_time", OnShowTime );
})();

CustomNetTables.SubscribeNetTableListener( "data_table", DataTableChanged );

function DataTableChanged(table,key,data){
	if (key == "hide_damage_stat"){
        $("#board_left").SetHasClass('invisible',true);
    }
}

function find_dota_hud_element(id){
    var hudRoot;
    for(panel=$.GetContextPanel();panel!=null;panel=panel.GetParent()){
        hudRoot = panel;
    }
    var comp = hudRoot.FindChildTraverse(id);
    return comp;
}

find_dota_hud_element('NormalRoot').style['opacity'] = '0';
find_dota_hud_element('RadarIcon').style['opacity'] = '0';
//find_dota_hud_element('ToggleScoreboardButton').style['opacity'] = '0';
//find_dota_hud_element('LockAndStartButton').style['opacity'] = '0';


function SetTips(keys){
	var isHider = keys.isHider;
	//$.Msg("asdasassasadd?????s");
	
	if(isHider == 1){
		$('#tip_hider').SetHasClass('tip_hidden',false);
		$('#tip_searcher').SetHasClass('tip_hidden',true);
	}else{
		$('#tip_hider').SetHasClass('tip_hidden',true);
		$('#tip_searcher').SetHasClass('tip_hidden',false);
	}
}


function OnShowTime(keys){
	//$.Msg("on shown");
	if(keys.time_left < 1){
		$('#left_time').text = $.Localize("roundend");
	}else{
		$('#left_time').text = keys.time_left;
	}
	
	
}




