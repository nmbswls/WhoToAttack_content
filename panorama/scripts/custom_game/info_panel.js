
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
    0 : [-4735,4735,128],
    1 : [127,4735,128],
    2 : [4991,4735,128],
    3 : [-4735,-127,128],
    4 : [4991,-127,128],
    5 : [-4735,-4991,128],
    6 : [127,-4991,128],
    7 : [4991,-4991,128],
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

function OnOpenDoorUpdate(table_name, key, data){
	if(key != 'open_door_info')
	{
		return;
	}
	var info = CustomNetTables.GetTableValue('player_info_table', 'open_door_info');
	if(!info){
		return;
	}
	$.Msg("cnm ");
	for(var k in m_InfoItemPanels)
	{	
		var panel = m_InfoItemPanels[k];
		if(panel){
			panel.FindChildTraverse("open_door_mark").SetHasClass('invisible',true);
		}
	}
	for (var d in info){
		var pid = info[d];
		if(!m_InfoItemPanels[pid]){
			continue;
		}
		
		var panel = m_InfoItemPanels[pid];
		
		panel.FindChildTraverse("open_door_mark").SetHasClass('invisible',false);
		
		// if(info[d].is_open != undefined && info[d].is_open != 0){
			// panel.FindChildTraverse("open_door_mark").SetHasClass('invisible',false);
		// }else{
			// panel.FindChildTraverse("open_door_mark").SetHasClass('invisible',true);
		// }
	}
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
		var tmp = {"steamId" : info[d].steamId, "pid" : info[d].pid, "score" : info[d].hp, "money" : info[d].money}
		arr.push(tmp);
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
				function(){
					$.Msg("avatar onclick " + pid);
					ChangeCamera2BattleField(pid);
				}
			); 
			
			m_InfoItemPanels[pid] = newPanel;
		}
		m_InfoItemPanels[pid].FindChildTraverse("text_player_hp").text = arr[i].score;
		m_InfoItemPanels[pid].FindChildTraverse("text_player_gold").text = "$"+arr[i].money;
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
	CustomNetTables.SubscribeNetTableListener('player_info_table', OnOpenDoorUpdate);
	
})();