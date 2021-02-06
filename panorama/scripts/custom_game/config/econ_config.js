var econ_info = '{"Version":1,'
	+ '"1001":{"name":"t10", "slot":1, "cost":3, "desp":"t10  abc"},'
	+ '"1002":{"name":"t12", "slot":1, "cost":3, "desp":"t13  abc"},'
	+ '"1003":{"name":"t14", "slot":1, "cost":3, "desp":"t15  abc"},'
	+ '"1004":{"name":"t16", "slot":1, "cost":3, "desp":"t16  abc"},'
	+ '"1005":{"name":"t17", "slot":1, "cost":3, "desp":"t17  abc"},'
	+ '"1006":{"name":"t20", "slot":1, "cost":3, "desp":"t17  abc"},'
	+ '"2001":{"name":"e10", "slot":2, "cost":3, "desp":"t17  abc"},'
	+ '"2002":{"name":"e10", "slot":2, "cost":3, "desp":"t17  abc"},'
	+ '"2003":{"name":"e10", "slot":2, "cost":3, "desp":"t17  abc"},'
	+ '"2004":{"name":"e10", "slot":2, "cost":5, "desp":"t18  aaaaaaaa"}}'
GameUI.EconInfoConfig = JSON.parse(econ_info)
$.Msg('load econ_info')