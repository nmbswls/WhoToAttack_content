(function () {
    //GameEvents.Subscribe( "init_time", InitShowTime );
    //GameEvents.Subscribe( "show_time", OnShowTime );
    
    GameEvents.Subscribe( "show_cards", OnShowCards);
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
		$('#left_time').text = $.Localize("roundend");
	}else{
		$('#left_time').text = keys.time_left;
	}
	
	
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


