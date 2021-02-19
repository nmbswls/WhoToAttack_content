
m_InfoItemPanels = {}
IS_PANEL_PLAYER_DETAILS_SHOW = false;
function DACTableChanged(table,key,data){
    
    //修改血条和排序
    if (key == 'user_panel_ranking'){
        var arr = [];         
        for (var d in data.table){
            data.table[d].steamid = d;
            data.table[d].score = 1000000*data.table[d].hp + 1000*(10 - (data.table[d].rank||0)) + (data.table[d].p2team||data.table[d].player_id);
            arr.push(data.table[d]);
        }
        arr.sort(function(a,b){return b.score-a.score});

        var my_p2team;
        for (var i=0;i<arr.length;i++){
            for (var j=0;j<8;j++){
                if (arr[i].player_id == Players.GetLocalPlayer() && arr[i].p2team){
                    my_p2team = arr[i].p2team;
                }
            }
        }
        for (var i=0;i<arr.length;i++){
            for (var j=0;j<8;j++){
                var team_index = GetPlayerIndexByPlayerID(arr[i].player_id);
                if (team_index == j){
                    $('#outer_player_board_'+j).style['position'] = '0px '+i*105+'px 0px';
                    if (arr[i].p2team){
                        $('#p2team_flag_'+j).SetImage('file://{resources}/images/custom_game/p2team_'+arr[i].p2team+'.png');
                        $('#p2team_flag_'+j).SetHasClass('invisible',false);
                        // $('#panel_player_board_'+j).style['opacity'] = '1';

                        if (my_p2team == arr[i].p2team && (Game.GetMapInfo().map_display_name == 'casual_2x4' || Game.GetMapInfo().map_display_name == 'ranked_2x4')){
                            HighLightPlayerHPBar(j);
                        }
                    }
                }
            }
        }
        $("#button_board_right").SetHasClass('invisible',false);
    }
}

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

(function(){

    var container = $("#board_player_info");
    
    for(var i = 0;i<4;i++){
        m_InfoItemPanels[i] = $.CreatePanel("Panel", container, "");
        m_InfoItemPanels[i].BLoadLayoutSnippet("PlayerInfoPanel");
        m_InfoItemPanels[i].FindChildTraverse("player_name").steamid = "76561198063208676";
        m_InfoItemPanels[i].FindChildTraverse("avatar_player").steamid = "76561198063208676";
    }
    toggle_player_details();
})();