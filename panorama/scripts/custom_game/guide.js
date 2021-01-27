function tips_over_guide(t, pos){
    $.DispatchEvent( "DOTAShowTextTooltip", $("#"+pos), $.Localize(t+'_title'));
}
function tips_out(){
    $.DispatchEvent( "DOTAHideTitleTextTooltip");
    $.DispatchEvent( "DOTAHideTextTooltip");
}

function close_panel_guide(){
    IS_PANEL_GUIDE_OPEN = false;
    $('#panel_guide').style['opacity'] = '0';
    $('#panel_guide').style['transform'] = 'scale3d( 0.95, 0.95, 0.95)';
    $('#panel_guide').style['position'] = '-100px -50px 0px';
    Game.EmitSound("Shop.PanelUp");
}

function open_panel_guide(){
    IS_PANEL_GUIDE_OPEN = true;
    $('#panel_guide').style['opacity'] = '1';
    $('#panel_guide').style['transform'] = 'scale3d( 1, 1, 1)';
    $('#panel_guide').style['position'] = '0px 0px 0px';
}