var unit_info = '{"Version":1,'
	+ '"evil_skeleton":{"cost":1, "class":"evil"},'
	+ '"wizard_zeus":{"cost":1, "class":"evil"},'
	+ '"brawn_tusk":{"cost":1, "class":"brawn"}}'
GameUI.UnitInfoConfig = JSON.parse(unit_info)
$.Msg('load config unit')