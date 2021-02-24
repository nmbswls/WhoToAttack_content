
m_InfoItemPanels = {}
IS_PANEL_PLAYER_DETAILS_SHOW = false;

function toggle_player_details(){
    $.Msg("toggle_player_details");
    if (IS_PANEL_PLAYER_DETAILS_SHOW == true){
        IS_PANEL_PLAYER_DETAILS_SHOW = false;
        $("#board_player_info").SetHasClass('unwrap',false);
        $("#button_board_player_info").style['transform'] = 'rotateZ(0deg)';
    }
    else{
        IS_PANEL_PLAYER_DETAILS_SHOW = true;
        $("#board_player_info").SetHasClass('unwrap',true);
        $("#button_board_player_info").style['transform'] = 'rotateZ(180deg)';
    }
}

var CAMERA_CENTER_POSITION = {
    0 : [-2048,1920,128],
    1 : [0,1920,128],
    2 : [2048,1920,128],
    3 : [2048,-128,128],
    4 : [2048,-2174,128],
    5 : [0,-2174,128],
    6 : [-2048,-2174,128],
    7 : [-2048,-128,128],
    8: [0,0,128],
};

function ChangeCamera2BattleField(pid){
	
    GameUI.SetCameraTargetPosition( CAMERA_CENTER_POSITION[pid], 0.2 );

    // var target_player_team = player_id + 6;
    // GameEvents.SendCustomGameEventToServer( "reset_fow", { 
        // "local_player_team": Players.GetTeam(Players.GetLocalPlayer()),
        // "target_player_team": target_player_team,
    // });
    IS_CAMERA_MOVING = true;
    $.Schedule(0.5,function(){
        GameUI.SetCameraTarget( -1 );
        IS_CAMERA_MOVING = false;
    });
}

function OnStatUpdate(table_name, key, data){
	
	if(key != 'user_panel_ranking')
	{
		return;
	}
	var info = CustomNetTables.GetTableValue('player_info_table', 'user_panel_ranking');
	if(!info){
		return;
	}
	$.Msg(info);
    var arr = [];         
	for (var d in info){
		
		var tmp = {"steamId" : info[d].steamId, "pid" : info[d].pid, "score" : info[d].hp}
		arr.push(tmp);
		$.Msg(tmp);
	}
	arr.sort(function(a,b){return b.score-a.score});
	
	// var my_p2team;
	// for (var i=0;i<arr.length;i++){
		// for (var j=0;j<8;j++){
			// if (arr[i].player_id == Players.GetLocalPlayer() && arr[i].p2team){
				// my_p2team = arr[i].p2team;
			// }
		// }
	// }
	var container = $("#board_player_info");
	for (var i=0;i<arr.length;i++){
		var pid = arr[i].pid;
		if(!m_InfoItemPanels[pid]){
			var newPanel = $.CreatePanel("Panel", container, "");
			
			newPanel.BLoadLayoutSnippet("PlayerInfoPanel");
			$.Msg(arr[i]);
			newPanel.FindChildTraverse("player_name").steamid = arr[i].steamId;
			newPanel.FindChildTraverse("avatar_player").steamid = arr[i].steamId;
			
			newPanel.FindChildTraverse("avatar_player").SetPanelEvent("onactivate", 
				function(){ ChangeCamera2BattleField(pid);}
			); 
			
			m_InfoItemPanels[pid] = newPanel;
		}
		m_InfoItemPanels[pid].FindChildTraverse("text_player_hp").text = arr[i].score;
		m_InfoItemPanels[pid].style['position'] = '0px '+i*105+'px 0px';
		
		// for (var j=0;j<8;j++){
			// var team_index = GetPlayerIndexByPlayerID(arr[i].player_id);
			// if (team_index == j){
				// $('#outer_player_board_'+j).style['position'] = '0px '+i*105+'px 0px';
				// if (arr[i].p2team){
					// $('#p2team_flag_'+j).SetImage('file://{resources}/images/custom_game/p2team_'+arr[i].p2team+'.png');
					// $('#p2team_flag_'+j).SetHasClass('invisible',false);
					// // $('#panel_player_board_'+j).style['opacity'] = '1';

					// if (my_p2team == arr[i].p2team && (Game.GetMapInfo().map_display_name == 'casual_2x4' || Game.GetMapInfo().map_display_name == 'ranked_2x4')){
						// HighLightPlayerHPBar(j);
					// }
				// }
			// }
		// }
	}
	$("#button_board_player_info").SetHasClass('invisible',false);
	
}

(function(){

   
    
    toggle_player_details();
	
	CustomNetTables.SubscribeNetTableListener('player_info_table', OnStatUpdate);
})();