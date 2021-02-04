var econ_info = '{"Version":1,'
	+ '"t10":{"slot":0, "cost":3, "desp":"t10  abc"},'
	+ '"t13":{"slot":0, "cost":3, "desp":"t13  abc"},'
	+ '"t15":{"slot":0, "cost":3, "desp":"t15  abc"},'
	+ '"t16":{"slot":0, "cost":3, "desp":"t16  abc"},'
	+ '"t17":{"slot":0, "cost":3, "desp":"t17  abc"},'
	+ '"t18":{"slot":0, "cost":3, "desp":"t17  abc"},'
	+ '"b01":{"slot":1, "cost":3, "desp":"t17  abc"},'
	+ '"b02":{"slot":1, "cost":3, "desp":"t17  abc"},'
	+ '"b03":{"slot":1, "cost":3, "desp":"t17  abc"},'
	+ '"b04":{"slot":1, "cost":5, "desp":"t18  aaaaaaaa"}}'
GameUI.EconInfoConfig = JSON.parse(econ_info)
$.Msg('load econ_info')