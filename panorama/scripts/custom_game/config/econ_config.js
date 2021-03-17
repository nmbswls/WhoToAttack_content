var econ_info = '{"Version":1,'
	+ '"1001":{"name":"t1", "slot":1, "image":"file://{images}/custom_game/tech.png", "desp":"t1  abc"},'
	+ '"1002":{"name":"t2", "slot":1, "image":"", "desp":"t2  abc"},'
	+ '"1003":{"name":"t3", "slot":2, "image":"", "desp":"t3  abc"},'
	+ '"1004":{"name":"t16", "slot":1, "image":"", "desp":"t16  abc"},'
	+ '"1005":{"name":"t17", "slot":1, "image":"", "desp":"t17  abc"},'
	+ '"1006":{"name":"t20", "slot":1, "image":"", "desp":"t17  abc"},'
	+ '"2001":{"name":"e10", "slot":2, "image":"", "desp":"t17  abc"},'
	+ '"2002":{"name":"e10", "slot":2, "image":"", "desp":"t17  abc"},'
	+ '"2003":{"name":"e10", "slot":2, "image":"", "desp":"t17  abc"},'
	+ '"2004":{"name":"e10", "slot":2, "image":"", "desp":"t18  aaaaaaaa"}}'
GameUI.EconInfoConfig = JSON.parse(econ_info)
$.Msg('load econ_info')