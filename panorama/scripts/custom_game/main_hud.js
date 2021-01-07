(function () {
    //GameEvents.Subscribe( "init_time", InitShowTime );
    GameEvents.Subscribe( "show_time", OnShowTime );
    
    GameEvents.Subscribe( "ping_open_doors", OnPingOpenDoors);
    
    CustomNetTables.SubscribeNetTableListener( "player_info_table", PlayerInfoTableChanged );
})();

function find_dota_hud_element(id){
    var hudRoot;
    for(panel=$.GetContextPanel();panel!=null;panel=panel.GetParent()){
        hudRoot = panel;
    }
    var comp = hudRoot.FindChildTraverse(id);
    return comp;
}

find_dota_hud_element('GuideFlyout').style['opacity'] = '0';
find_dota_hud_element('ItemList').style['opacity'] = '0';
find_dota_hud_element('GridUpgradesTab').style['opacity'] = '0';
find_dota_hud_element('GridNeutralsTab').style['opacity'] = '0';
find_dota_hud_element('QuickBuyRows').style['opacity'] = '0';
find_dota_hud_element('DeliverItemsButton').style['opacity'] = '0';
find_dota_hud_element('SearchContainer').style['opacity'] = '0';
find_dota_hud_element('RequestSuggestion').style['opacity'] = '0';
find_dota_hud_element('PopularItems').style['opacity'] = '0';
find_dota_hud_element('ToggleMinimalShop').style['opacity'] = '0';




function OnBackHome(){
    $.Msg("cnmcnmcnm OnBackHome");
}

function PlayerInfoTableChanged(table,key, data){
    if (key == 'player_info'){
        for (var i in data.data){
            var info = data.data[i];
            
            // var is_muted = Game.IsPlayerMuted( info.player_id );
            // var is_local_player = Players.GetLocalPlayer() == info.player_id ? true : false;
            
            $.Msg("changed " + info.money);

            // 渲染玩家详情面板
            // $('#player_name_'+player_id).steamid = info.steam_id;
            // $('#avatar_player_'+player_id).steamid = info.steam_id;

            // $('#player_details_damage_'+player_id).text = (info.hero_damage || 0) + '-' + (info.hero_damaged || 0);
            // $("#player_details_win_"+player_id).text = info.win_round+'-'+info.lose_round;
            // $("#player_details_money_"+player_id).text = '$'+info.total_money;


        }
    }
}

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
		$('#left_time').text = "round " + keys.round + " " + $.Localize("祈祷中");
	}else{
		$('#left_time').text = "round " + keys.round + " stage " + keys.stage + " left " + keys.time_left;
	}
	
}


function OnPingOpenDoors(keys) {
    
    var loc = [keys.x, keys.y, keys.z];
    for(var i=0;i<1;i++){
        $.Schedule(i*1, function(){
            GameUI.PingMinimapAtLocation(loc);
        });
    }
}



