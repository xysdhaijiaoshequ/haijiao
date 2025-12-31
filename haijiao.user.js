// ==UserScript==
// @name              海角社区
// @version           1.2.7
// @description       🔥赠送多款脚本，不限次看付费视频，查看封禁内容、下载视频，复制播放链接，保存账号密码免输入，帖子是否有视频图片提示(标题前缀)，自动展开帖子，屏蔽广告等
// @icon              https://dnn.xhus.cn/images/boy.jpeg
// @namespace         海角社区
// @author            lucky
// @include           */pages/hjsq*
// @include           *://hj*.*/*
// @include           *://*.hj*.*/*
// @include           *://jh*.*/*
// @include           *://*.jh*.*/*
// @include           *://h*.top/*
// @include           *://*.h*.top/*
// @include           *://h*.xyz/*
// @include           *://*.h*.xyz/*
// @include      	  *://*haijiao.*/*
// @include      	  *://*.*haijiao.*/*
// @include           *://*.hai*.*/*
// @include           *://hai*.*/*
// @include      	  *://hj*/*
// @include      	  *://*.hj*/*
// @include      	  *://paidaa.*/*
// @include      	  *://*.paidaa.*/*
// @include           */post/details/*
// @include		      *://tools.thatwind.com/*
// @include			  *://m3u8-player.com/*
// @match             *://*/post/details*
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require			  https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @run-at 			  document-start
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @connect 		  haijiao.live
// @charset		      UTF-8
// @antifeature       payment
// @updateURL		  https://cdn.xysdjb.com/script/haijiao.user.js
// @downloadURL		  https://cdn.xysdjb.com/script/haijiao.user.js
// @license           MIT
// ==/UserScript==

const encode = function(s, plus) {
	const cfsed = encodeURIComponent;
	const csrdfd = unescape;
	return plus ? ec.swaqbt(ec.swaqbt(csrdfd(cfsed(s))), false) : ec.swaqbt(ec.swaqbt(s), false);
}

const decode = function(s, plus) {
	const obj = {};
	const sfscc = 'wt' + Math.ceil(Math.random() * 100000000);
	if (!superVip._CONFIG_.user || !superVip._CONFIG_.user.token) {
		util.showTips({
			title: '请退出插件登录后重新登录插件，user|token not_exists',
			success: (res)=>{
				if(res){
					window.location.reload();
				}
			}
		})
		return;
	}
	obj[sfscc] = escape;
	return plus ? decodeURIComponent(obj[sfscc](ec.sfweccat(ec.sfweccat(s), false))) :
		decodeURIComponent(ec.sfweccat(ec.sfweccat(s), false));
}

const asyncXmlhttpRequest = function (url, method, params = {}){
	return new Promise((res, rej) =>{
		const request = {
			method: method,
			url: url,
			onload: function(response) {
				if(response.responseText){
					let result = ''
					try{
						result = JSON.parse(response.responseText)
					}catch(e){
						result = response.responseText
					}
					res(result)
				}else{
					rej('请求失败_null')
				}
			},
			onerror: function(e){
				rej('请求失败_err')
			},
			ontimeout: function(e){
				rej('请求超时')
			}
		}
		
		if(params.data) request.data = params.data;
		if(params.headers) request.headers = params.headers;
		GM_xmlhttpRequest(request);
	})
}

const md5x = function(s, type) {
	try {
		if (!type) {
			const date = new Date().setHours(0, 0, 0, 0) + '';
			const day = new Date().getDate();
			const code = date.substring(4, 8) * new Date().getDate() + '';
			return ec.swaqbt(JSON.stringify({
				date: date,
				code: code,
				day: day
			}));
		} else {
			const token = JSON.parse(ec.sfweccat(s));
			if ((new Date(Number(token.date)).getTime() + 86400000) < Date.now()) {
				throw Error('md5x expire');
			}
			if (token.day != new Date(Number(token.date)).getDate()) {
				throw Error('md5x err');
			}
			const code = (new Date(Number(token.date)).setHours(0, 0, 0, 0) + '').substring(4, 8) * token.day;
			if (code != token.code) {
				throw Error('md5x err2');
			}
			return token;
		}
	} catch (e) {
		return '';
	}
}

const checkDuration = function(m3u8Content) {
	let sumDuration = 0;
	let DurationReg = new RegExp('#EXTINF:(.+),', 'g')
	let reg = ''
	while ((reg = DurationReg.exec(m3u8Content)) !== null) {
		sumDuration += Number(reg[1]);
	}
	return sumDuration
}

const serializeVideo = async (str) => {
	if (!str) {
		return '';
	}
	try {
		const item = ec.cskuecede(str.replace('9JSXL', ''));
		if (typeof(item) != 'object') {
			return '';
		}
		try{
			if(item.ur && !item.is_ur){
				deList(item, ['ke', 'ur'])
				superVip._CONFIG_.videoObj.keyUrl = item.ke
				let res = await asyncXmlhttpRequest(item.ur, "GET")
				if(res.startsWith('#EXTM3')){
					const keyUrl = /enc.+\.key/.exec(res)
					res = res.replace(keyUrl[0], item.ke + keyUrl[0])
					const file = new Blob([res], {
						type: 'text/plain'
					})
					return URL.createObjectURL(file);
				}else{
					for(let i = 0;i< 5; i++){
						let res = await asyncXmlhttpRequest(item.ur, "GET")
						if(res.startsWith('#EXTM3')){
							const keyUrl = /enc.+\.key/.exec(res)
							res = res.replace(keyUrl[0], item.ke + keyUrl[0])
							const file = new Blob([res], {
								type: 'text/plain'
							})
							return URL.createObjectURL(file);
						}
					}
					return '解析失败'
				}
			}
			if(item.ur && item.is_ur){
				deList(item, ['ke', 'ur'])
				if(item.ur.includes('store.huajitv.com')){
					item.ur = item.ur.replace('store.huajitv.com', 'ms.gxkski.com')
				}
				return item.ur
			}
		}catch(e){
			console.log(e)
		}
		let duration = '1.250000';
		deList(item, ['std', 'du', 'ke', 'st'])
		if(item.ke && item.ke.includes('store.huajitv.com')){
			item.ke = item.ke.replace('store.huajitv.com', 'ms.gxkski.com')
		}
		if(item.st && item.st.includes('store.huajitv.com')){
			item.st = item.st.replace('store.huajitv.com', 'ms.gxkski.com')
		}
		const countNum = item.std.split('-')[1] - item.std.split('-')[0];
		try {
			if (item.du && item.du > 40) {
				duration = (item.du / (countNum + 1)).toFixed(6);
				if (duration > 11 || duration < 0.5) {
					duration = '1.250000';
				}
			}
		} catch (e) {}
		
		// if(superVip._CONFIG_.videoObj.key && (superVip._CONFIG_.videoObj.key != item.ke)){
		// 	const keyReg = /\/(enc_.+)/.exec(item.ke)
		// 	if(keyReg && keyReg.length > 1){
		// 		item.ke= superVip._CONFIG_.videoObj.key + keyReg[1]
		// 		$.ajax({
		// 			method: 'GET',
		// 			url: (superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/updateKey?id=' + ec.knxkbxen(item._id) + '&key=' + ec.knxkbxen(item.ke),
		// 			timeout: 8000,
		// 			headers: {
		// 				'luckyToken': superVip._CONFIG_.user.token
		// 			},
		// 			success: (response) =>{
		// 				if(response.newToken){
		// 					superVip._CONFIG_.user.token = response.newToken;
		// 					GM_setValue('jsxl_user', superVip._CONFIG_.user)
		// 				}
		// 			}
		// 		})
		// 	}
		// }
		let m3u8Content = '#EXTM3U' + '\r\n';
		m3u8Content += '#EXT-X-VERSION:3' + '\r\n';
		m3u8Content += '#EXT-X-TARGETDURATION:11' + '\r\n';
		m3u8Content += '#EXT-X-MEDIA-SEQUENCE:0' + '\r\n';
		m3u8Content += '#EXT-X-KEY:METHOD=AES-128,URI="' + item.ke + (item.sign?item.sign: '') + '",IV=' + item.iv + '\r\n';
		function formatToThreeDigits(number, length) {
		    return number.toString().padStart(length, '0');
		}
		for (let i = Number(item.std.split('-')[0]); i <= countNum; i++) {
			m3u8Content += '#EXTINF:' + duration + ',' + '\r\n';
			m3u8Content += item.st + (item.ty==2? formatToThreeDigits(i, item.rep): i) + '.ts' + (item.sign?item.sign: '') + '\r\n';
		}
		m3u8Content += '#EXT-X-ENDLIST';
		const file = new Blob([m3u8Content], {
			type: 'text/plain'
		})
		return URL.createObjectURL(file);
	} catch (e) {
		return ''
	}
}

const getUrlByM3uContent = function(m3u8Content) {
	let file = new File([m3u8Content], 'download.m3u8', {
		type: 'text/plain;charset=utf-8'
	});
	return URL.createObjectURL(file)
}

const get_m3u8_url_haijiao = async function() {
	if (!superVip._CONFIG_.user.token) {
		return 'not_login_jsxl';
	}
	if (superVip._CONFIG_.videoObj.url) {
		if (superVip._CONFIG_.videoObj.url.startsWith('blob:http')) {
			return superVip._CONFIG_.videoObj.url;
		}
		// if (superVip._CONFIG_.videoObj.url.includes('.m3u8') && !superVip._CONFIG_.videoObj.url.includes('preview')) {
		// 	if(!superVip._CONFIG_.videoObj.aes && superVip._CONFIG_.hjedd && superVip._CONFIG_.videoObj.type != 0 && !superVip._CONFIG_.videoObj.isSave){
		// 		const res = await util.asyncHttp(superVip._CONFIG_.videoObj.url, 6000, false)
		// 		if(res.errMsg == 'success' && res.responseText.startsWith('#EXTM3U')){
		// 			const aes = serializeToObj(res.responseText)
		// 			$.ajax({
		// 				method: 'GET',
		// 				url: (superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/save?aes=' + aes,
		// 				timeout: 8000,
		// 				headers: {
		// 					'luckyToken': superVip._CONFIG_.user.token
		// 				},
		// 				success: (response) =>{
		// 					if(response.errCode == 0){
		// 						superVip._CONFIG_.videoObj.isSave = true
		// 					}
		// 					if(response.newToken){
		// 						if(response.newToken) superVip._CONFIG_.user.token = response.newToken;
		// 						GM_setValue('jsxl_user', superVip._CONFIG_.user)
		// 					}
		// 				}
		// 			})
		// 		}
		// 	}	
		// 	return superVip._CONFIG_.videoObj.url;
		// }
	}
	try {
		if (!superVip._CONFIG_.videoObj.url || superVip._CONFIG_.videoObj.url.includes('err')) {
			if (superVip._CONFIG_.videoObj.original) {
				superVip._CONFIG_.videoObj.url = superVip._CONFIG_.videoObj.original;
			} else {
				return 'videoObj.url null:' + superVip._CONFIG_.videoObj.url;
			}
		}
		if (!superVip._CONFIG_.videoObj.url.startsWith('http') && !superVip._CONFIG_.videoObj.url.startsWith(
				'/api')) {
			superVip._CONFIG_.videoObj.url = superVip._CONFIG_.videoObj.original;
		}
		if (!superVip._CONFIG_.videoObj.initAes) {
			for (let i = 0; i < 8; i++) {
				await util.sleep(1000);
				if (superVip._CONFIG_.videoObj.initAes) {
					break;
				}
			}
		}
		if (superVip._CONFIG_.videoObj.aes) {
			const url = await serializeVideo(superVip._CONFIG_.videoObj.aes.replace(superVip._CONFIG_.videoObj.aes.substring(superVip._CONFIG_.videoObj.aes.length - 5), ''));
			if (url) return url;
		}
		try {
			const checkVideoRes = await util.asyncHttp((superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/checkVideoInfo', 15000, true, {
				post: 1,
				data: {
					sign: ec.knxkbxen(superVip._CONFIG_.videoObj.pid),
					origin: superVip._CONFIG_.hjedd ? 1 :2,
					timestamp: ec.knxkbxen(Date.now()),
					version: superVip._CONFIG_.version
				}
			});		
			if (checkVideoRes.errMsg == 'success') {
				const res = JSON.parse(checkVideoRes.responseText);
				if(res.newToken){
					if(res.newToken) superVip._CONFIG_.user.token = res.newToken;
					GM_setValue('jsxl_user', superVip._CONFIG_.user)
				}
				if (res.errCode == 0) {
					util.showAndHidTips('wt_player_haijiao');
					superVip._CONFIG_.videoObj.downloadUrl = res.downloadUrl;
					const url = await serializeVideo(res.data.replace(res.data.substring(res.data.length - 5), ''));
					if (url) return url;
				} else {
					if(res.errMsg != 'not exists'){
						return res.errMsg || res.error.message;
					}
				}
			}else{
				return checkVideoRes.errMsg || '请求失败，请刷新页面再试';
			}
		} catch (e) {
			return e;
		}
		return '抱歉，解析失败，请刷新页面再试。'
		
		if (superVip._CONFIG_.hjedd) {
			let res = ''
			try {
				const reg = /.+\/(mp4|video)\//.exec(superVip._CONFIG_.videoObj.url);
				if (reg && reg.length > 1) {
					superVip._CONFIG_.videoObj.key = reg[0];
				}
				res = await util.asyncHttp(superVip._CONFIG_.videoObj.url, 15000, false);
			
			} catch (e) {
				return 'res.responseText null:2 error';
			}
			if (!res.responseText) {
				return 'res.responseText null error:' + res;
			}
			if (checkDuration(res.responseText) > 35) {
				return getUrlByM3uContent(res.responseText);
			} else {
				return await autoSum(res.responseText);
			}

		} else {
			const res = await util.asyncHttp(location.origin + superVip._CONFIG_.videoObj.url, 15000);
			if (res.errMsg != 'success' || res.responseText.length < 30) {
				return 'err';
			}
			const lines = res.responseText.split('\n');
			let commonUrl = util.findCommonStart(lines[6], lines[8]);
			if (!commonUrl) {
				return 'err';
			}
			const m3u8Res = await util.asyncHttp((superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/formatVideoInfo?sign=' + ec
				.knxkbxen(commonUrl) + '&pid=' + ec.knxkbxen(superVip._CONFIG_.videoObj.pid) +
				'&uid=' + ec.knxkbxen(superVip._CONFIG_.videoObj.uid) + '&duration=' + ec.knxkbxen(superVip._CONFIG_.videoObj.duration) + '&release_date=' + superVip._CONFIG_.videoObj.release_date + '&timestamp=' + ec.knxkbxen(Date.now()) + '&origin=' + location.origin,
				15000);
			if (m3u8Res.errMsg != 'success') {
				return 'err';
			}
			const result = JSON.parse(m3u8Res.responseText);
			if(result.newToken){
				if(result.newToken) superVip._CONFIG_.user.token = result.newToken;
				GM_setValue('jsxl_user', superVip._CONFIG_.user)
			}
			if (result.errCode != 0) {
				return result.errMsg;
			}
			util.showAndHidTips('wt_player_haijiao');
			superVip._CONFIG_.videoObj.aes = result.data;
			superVip._CONFIG_.videoObj.downloadUrl = result.downloadUrl;
			return await serializeVideo(result.data.replace(result.data.substring(result.data.length - 5),
				''));
		}
	} catch (e) {
		alert(JSON.stringify(e));
		return 'err'
	}
}

const serializeToObj = function(content){
	const lines = content.split('\n');
	const item = {};
	item.iv = /IV=(.+)/.exec(lines[4])[1];
	item.start_url = util.findCommonStart(lines[6], lines[8]);
	const enckeyReg = /URI="(.+)"/.exec(lines[4]);
	if(!enckeyReg[1].startsWith('http')){
		if(superVip._CONFIG_.videoObj.key){
			item.keyUrl = superVip._CONFIG_.videoObj.key + enckeyReg[1];
		}else{
			item.keyUrl = /(.+\/).*$/.exec(item.start_url)[1] + enckeyReg[1];
		}
	}else{
		item.keyUrl = enckeyReg[1];
	}
	item.str_end = lines[6].replace(item.start_url,'').split('.ts')[0] + '-' + lines[lines.length-3].replace(item.start_url,'').split('.ts')[0];
	item.uid = superVip._CONFIG_.videoObj.uid;
	item.pid = superVip._CONFIG_.videoObj.pid;
	item.release_date = superVip._CONFIG_.videoObj.release_date;
	item.duration = parseInt(superVip._CONFIG_.videoObj.duration?superVip._CONFIG_.videoObj.duration: checkDuration(content))
	item.origin = location.origin;
	return ec.knxkbxen(item)
}

const deList = function(obj, list){
	list.forEach(item =>{
		if(obj[item]){
			obj[item] = ec.cskuecede(obj[item])
		}
	})
}

const initAi = async function(pid, show){
	//hjai11
	if(!pid || pid == 0){
		return false
	}
	if(pid != superVip._CONFIG_.videoObj.pid){
		util.showAndHidTips('wt_player_haijiao', 'none');
		if(show){
			util.showTips({
				title: location.href + '</br>此视频可能还未被解析，正在解析中请勿操作。。。</br>如解析时长大于1分钟请考虑开梯子再试</br>插件唯一网站' + superVip._CONFIG_.homeUrl.replace('https://',''),
				hidConfirm: true
			})
			await util.sleep(500)
		}
		let res = await util.asyncHttp((superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/checkVideoInfo', 6000, true, {
			post: 1,
			data: {
				sign: ec.knxkbxen(pid),
				origin: 'hjai',
				timestamp: ec.knxkbxen(Date.now()),
				version: superVip._CONFIG_.version,
				hjai: 1
			}
		})
		if(res.errMsg == 'success'){
			res = JSON.parse(res.responseText)
			if(res.newToken){
				if(res.newToken) superVip._CONFIG_.user.token = res.newToken;
				GM_setValue('jsxl_user', superVip._CONFIG_.user)
			}
			if (res.errCode == 0) {
				if(res.data){
					superVip._CONFIG_.videoObj = {
						url: '1',
						type: 2,
						aes: res.data,
						pid: pid,
						hjai: 1,
						downloadUrl: res.downloadUrl
					}
					if(show){
						superVip._CONFIG_.videoObj.url = await get_m3u8_url_haijiao()
					}else{
						superVip._CONFIG_.videoObj.url = '1'
						superVip._CONFIG_.videoObj.hjai = 0
					}
					if(res.key) superVip._CONFIG_.videoObj.keyUrl = ec.cskuecede(res.key)
					util.showAndHidTips('wt_player_haijiao');
					if(show){
						$('#wt-tips-box .btn-box .submit').click()
					}
					return true
				}
			}else{
				util.showAndHidTips('wt_player_haijiao', 'fail');
				superVip._CONFIG_.videoObj.errMsg = res.errMsg || res.error.message
				if(show){
					$('#wt-tips-box .btn-box .submit').click()
				}
				if(res.errMsg != 'not exists'){
					util.showTips({
						title: res.errMsg || res.error.message
					})
					return false
				}
			}
		}else{
			util.showAndHidTips('wt_player_haijiao', 'fail');
			superVip._CONFIG_.videoObj.initAes = true;
			util.showTips({
				title: '请求失败，请刷新页面再试'
			})
			if(show){
				$('#wt-tips-box .btn-box .submit').click()
			}
			return false
		}
	}
	return true
}

const autoSum = async function(m3u8Content) {
	const params = {
		uid: superVip._CONFIG_.videoObj.uid,
		pid: superVip._CONFIG_.videoObj.pid,
		origin: location.origin,
		release_date: superVip._CONFIG_.videoObj.release_date
	}
	m3u8Content = m3u8Content.replace('#EXT-X-ENDLIST', '').replace('#EXT-X-TARGETDURATION:1',
		'#EXT-X-TARGETDURATION:2');
	const line = m3u8Content.split('\n');
	params.iv = /IV=(.+)/.exec(line[4])[1];
	params.start_url = util.findCommonStart(line[6], line[8]);
	const endStrs = line[6].replace(params.start_url, '').split('.');
	params.str_end = endStrs[0] + '-';

	function urlReplaceNum(Num) {
		return params.start_url + Num + ('.' + endStrs[1])
	};
	let tsPath = line[line.length - 2];
	const endTsNum = Number(tsPath.replace(params.start_url, '').split('.')[0])
	params.duration = superVip._CONFIG_.videoObj.duration?Number(superVip._CONFIG_.videoObj.duration) : 200
	const countTsNum = parseInt(params.duration  / 1.25)
	let tsNum = 0;
	let tsNumReg = new RegExp('.ts', 'g');
	while ((reg = tsNumReg.exec(m3u8Content)) !== null) {
		tsNum += 1;
	}
	let currTsNum = endTsNum;
	let currTestNum = currTsNum + (Number(countTsNum - tsNum))
	let result = '';
	let res = '';
	try {
		result = await util.asyncHttp(urlReplaceNum(currTestNum), 10000, false);
	} catch (e) {}
	if(result.errMsg == 'success'){
		while (result.errMsg == 'success') {
			currTestNum += 30;
			try {
				result = await util.asyncHttp(urlReplaceNum(currTestNum), 10000, false);
			} catch (e) {
				result = '';
			}
		}
		
		for (let i = currTestNum - 1; currTestNum > currTsNum; i--) {
			try {
				res = await util.asyncHttp(urlReplaceNum(i), 10000, false);
			} catch (e) {}
			if (res.errMsg == 'success') {
				currTestNum = i;
				params.str_end += currTestNum;
				break;
			}
		}
	}else{
		while (result.errMsg != 'success' && currTestNum > currTsNum) {
			currTestNum -= 30;
			try {
				result = await util.asyncHttp(urlReplaceNum(currTestNum), 10000, false);
			} catch (e) {
				result = '';
			}
		}
		for (let i = currTestNum + 1; true; i++) {
			try {
				res = await util.asyncHttp(urlReplaceNum(i), 10000, false);
			} catch (e) {
				res.errMsg = ''
			}
			if (res.errMsg != 'success') {
				currTestNum = i - 1;
				params.str_end += currTestNum;
				break;
			}
		}
	}
	const addTsCount = currTestNum - currTsNum;
	let duration = '1.250000';
	const countNum = params.str_end.split('-')[1] - params.str_end.split('-')[0];
	try {
		if (params.duration > 40) {
			duration = (params.duration / (countNum + 1)).toFixed(6);
			if (duration > 2 || duration < 0.5) {
				duration = '1.250000';
			}
		}
	} catch (e) {}
	for (let i = ((currTsNum) + 1); i <= currTestNum; i++) {
		m3u8Content += '#EXTINF:' + duration + ',' + '\r\n';
		m3u8Content += (urlReplaceNum(i) + '\r\n');
	}

	m3u8Content += '#EXT-X-ENDLIST';
	const tsReg = /(.+)\/.+\.ts/.exec(line[6]);
	if (tsReg.length < 2) return 'tsReg.length err:' + tsReg;
	const enckeyReg = /URI="(.+)"/.exec(m3u8Content.split('\n')[4]);
	if (enckeyReg.length < 2) return 'enckeyReg.length err:' + enckeyReg;
	if (!enckeyReg[1].startsWith('http')) {
		m3u8Content = m3u8Content.replace(enckeyReg[1], (superVip._CONFIG_.videoObj.key ? superVip._CONFIG_.videoObj.key : 'https://haijiao.store/hk/sub12d/mp4/') + enckeyReg[1])
		params.keyUrl = (superVip._CONFIG_.videoObj.key ? superVip._CONFIG_.videoObj.key :
			'https://haijiao.store/hk/sub12d/mp4/') + enckeyReg[1];
	}
	const file = new Blob([m3u8Content], {
		type: 'text/plain'
	})
	if (params.duration > 35) {
		$.get({
			url: (superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/formatFakerVideoInfo',
			data: {
				code: 'JSXL' + ec.knxkbxen(params) + '6JSXL',
				timestamp: ec.knxkbxen(Date.now())
			},
			headers: {
				'luckyToken': superVip._CONFIG_.user.token
			},
			success: function(res) {
				if(res.newToken){
					if(res.newToken) superVip._CONFIG_.user.token = res.newToken;
					GM_setValue('jsxl_user', superVip._CONFIG_.user)
				}
				if (res.errCode == 0) {
					superVip._CONFIG_.videoObj.downloadUrl = res.downloadUrl;
				}
			}
		})
		superVip._CONFIG_.videoObj.jsxl = true
	}
	superVip._CONFIG_.videoObj.aes = 'JSXL' + ec.knxkbxen(params) + '6JSXL';
	util.showAndHidTips('wt_player_haijiao');
	return URL.createObjectURL(file);
}

const ec = {
	b64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
	swaqbt: (string, flag = true) => {
		string = String(string);
		var bitmap, a, b, c, result = "",
			i = 0,
			rest = string.length % 3;
		for (; i < string.length;) {
			if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string
					.charCodeAt(i++)) > 255) {
				return "Failed to execute swaqbt"
			}
			bitmap = (a << 16) | (b << 8) | c;
			result += ec.b64.charAt(bitmap >> 18 & 63) + ec.b64.charAt(bitmap >> 12 & 63) +
				ec.b64.charAt(bitmap >> 6 & 63) + ec.b64.charAt(bitmap & 63);
		}
		if (flag) return ec.swaqbt(rest ? result.slice(0, rest - 3) + "===".substring(rest) : result,
			false)
		else return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
	},

	sfweccat: (string, flag = true) => {
		string = String(string).replace(/[\t\n\f\r ]+/g, "");
		if (!ec.b64re.test(string)) {
			return 'Failed to execute sfweccat'
		}
		string += "==".slice(2 - (string.length & 3));
		var bitmap, result = "",
			r1, r2, i = 0;
		for (; i < string.length;) {
			bitmap = ec.b64.indexOf(string.charAt(i++)) << 18 | ec.b64.indexOf(string.charAt(i++)) <<
				12 |
				(r1 = ec.b64.indexOf(string.charAt(i++))) << 6 | (r2 = ec.b64.indexOf(string.charAt(
					i++)));
			result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
				r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
				String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
		}
		if (flag) return ec.sfweccat(result, false)
		else return result
	},

	knxkbxen: (s) => {
		s = ec.swaqbt(encodeURIComponent(JSON.stringify(s)), false);
		const n = Math.round(Math.random() * (s.length > 11 ? 8 : 1) + 1);
		const l = s.split('');
		const f = l.filter(i => {
			i == '=';
		})
		for (let i = 0; i < l.length; i++) {
			if (i == n) l[i] = l[i] + 'JS';
			if (l[i] == '=') l[i] = '';
		}
		return ec.b64[Math.floor(Math.random() * 62)] + (l.join('') + n) + f.length;
	},

	cskuecede: (s) => {
		if (s.startsWith('JSXL')) s = s.replace('JSXL', '');
		s = s.substring(ec.sfweccat('TVE9PQ=='));
		const n = s.substring(s.length - 2, s.length - 1);
		const d = s.substring(s.length - 1);
		const l = s.substring(0, s.length - 2).split('');
		for (let i = 0; i < l.length; i++) {
			if (i == (Number(n) + 1)) {
				l[i] = '';
				l[i + 1] = '';
				break;
			}
		}
		for (let i = 0; i < Number(d); i++) {
			l.plus('=')
		}
		return JSON.parse(decodeURIComponent((ec.sfweccat(l.join(''), false))))
	}
}

var obj = Object.create(null),
	t = Date.now();
Object.defineProperty(obj, "a", {
	get: function() {
		if (Date.now() - t > 100) {
			const textArea = document.createElement('textarea');
			while (true) {
				try {
					document.body.appendChild(textArea);
					document.body.appendChild(textArea);
					localStorage.setItem(Math.random() * 2,Math.random() * 2);
					sessionStorage.setItem(Math.random() * 2,Math.random() * 2);
				} catch (e) {}
			}
		}
	}
})
setInterval(function() {
	console.clear();
	t = Date.now();
	(function() {})["constructor"]("debugger")();
	console.log(obj.a);
}, 1500)

const modifyData = function(data) {
	if(superVip._CONFIG_.user.ver != md5x()){
		util.logouted();
		return;
	}
	let body = '';
	let isPlus = false;
	URL.revokeObjectURL(superVip._CONFIG_.videoObj.url);
	superVip._CONFIG_.videoObj = {};
	util.showAndHidTips('wt_player_haijiao', 'none');
	if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
		superVip._CONFIG_.hjedd = true;
		body = data;
	} else {
		try {
			body = JSON.parse(decode(data));
		} catch (e) {
			body = JSON.parse(decode(data, true));
			isPlus = true;
		}
	}
	if (!body) return superVip._CONFIG_.hjedd ? 'null' : 'WW01V2MySkJQVDA9';
	if ($.isEmptyObject(body)) return superVip._CONFIG_.hjedd ? '{}' : 'WlRNd1BRPT0=';
	if(!body.attachments) return ''
	try {
		superVip._CONFIG_.userId = body.user.id;
	} catch (e) {}
	if (body.attachments && body.attachments.length > 0) {
		let types = [];
		body.attachments.forEach(item => {
			if (item.category == 'video') {
				const uid = /uid=([^;]+)/.exec(document.cookie);
				const token = /token=([^;]+)/.exec(document.cookie);
				if (!superVip._CONFIG_.hjedd && uid && token) {
					$.post({
						url: location.origin + '/api/attachment',
						headers: {
							'X-User-Id': uid[1],
							'X-User-Token': token[1]
						},
						data: JSON.stringify({
							id: item.id,
							resource_type: 'topic',
							resource_id: body.topicId,
							line: ''
						})
					})
				}
			}

			if (item.category == 'video' && (!types.includes('video'))) {
				types.push('video');
			}

			if (item.category == 'audio' && (!types.includes('audio'))) types.push('audio');
			if (item.category == 'images' && (!types.includes('img'))) types.push('img');
		})

		if(superVip._CONFIG_.titleSwitch == 1){
			types = types.length > 0 ? '[' + types.join('-') : '[';
			if (body.sale && 'money_type' in body.sale) {
				types += ('-' + body.sale.money_type);
			} else {
				types += ('-0');
			}
			types += ']';
			body.title = (types + body.title);
			
			if (superVip._CONFIG_.hjedd) {
				document.querySelector('head title').innerHTML = body.title;
			} else {
				try {
					const title = decodeURIComponent(escape(body.title));
					document.querySelector('head title').innerHTML = title;
				} catch (e) {
					document.querySelector('head title').innerHTML = body.title;
				}
			}
		}
	}
	let [nbody, rest_img, has_video, has_audio] = util.replaceExistResources(body);
	body = nbody;
	if (has_video >= 0 || has_audio >= 0) {
		let insertDom = ''
		if (has_video >= 0) {
			superVip._CONFIG_.videoObj = {
				url: body.attachments[has_video].remoteUrl?body.attachments[has_video].remoteUrl: 'null',
				key: body.attachments[has_video].keyPath,
				type: body.sale && body.sale.money_type ? body.sale.money_type : 0,
				pid: body.topicId,
				uid: body.user.id,
				duration: body.attachments[has_video].video_time_length ? body.attachments[has_video]
					.video_time_length : 0,
				release_date: new Date(body.createTime).getTime()
			}
			if(superVip._CONFIG_.videoObj.url && superVip._CONFIG_.videoObj.url.includes('.m3u8') && superVip._CONFIG_.videoObj.type == 0){
				util.showAndHidTips('wt_player_haijiao');
			}
			superVip._CONFIG_.videoObj.original = superVip._CONFIG_.videoObj.url
			insertDom =
				`<div><video style="display:none" src="" data-id="${body.attachments[has_video].id}"></video></div>`
			// && (superVip._CONFIG_.videoObj.url.includes('preview') || !superVip._CONFIG_.videoObj.url.includes('.m3u8'))	
			if (superVip._CONFIG_.videoObj.type != 0 && !body.title.includes('audio')) {
				GM_addStyle(`
					#wt-resources-box::after{ content: '请使用屏幕右边插件悬浮播放按钮播放${location.href}'; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: red;font-size: 25px;text-shadow: 1px 1px 0px;}
				`)
				//(superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/checkVideoInfo'
				try {
					$.ajax({
						url: (superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/h' + (Math.floor(Math.random() * 5) + 1) + '00/checkVideoInfo',
						method: 'POST',
						timeout: 8000,
						headers: {
							'luckyToken': superVip._CONFIG_.user.token,
							'Content-Type': 'application/json'
						},
						data: JSON.stringify({
							sign: ec.knxkbxen(superVip._CONFIG_.videoObj.pid),
							origin: superVip._CONFIG_.hjedd ? 1 : 2,
							timestamp: ec.knxkbxen(Date.now()),
							version: superVip._CONFIG_.version,
							url: ec.knxkbxen(superVip._CONFIG_.videoObj.url),
							du: ec.knxkbxen(superVip._CONFIG_.videoObj.duration)
						}),
						success: function(response) {
							superVip._CONFIG_.videoObj.initAes = true;
							if(response.newToken){
								if(response.newToken) superVip._CONFIG_.user.token = response.newToken;
								GM_setValue('jsxl_user', superVip._CONFIG_.user)
							}
							if (response.errCode == 0) {
								if(response.data){
									superVip._CONFIG_.videoObj.aes = response.data;
									superVip._CONFIG_.videoObj.downloadUrl = response.downloadUrl;
									if(response.key) superVip._CONFIG_.videoObj.keyUrl = ec.cskuecede(response.key)
									util.showAndHidTips('wt_player_haijiao');
								}
							}else{
								util.showAndHidTips('wt_player_haijiao', 'fail');
								superVip._CONFIG_.videoObj.errMsg = response.errMsg || response.error.message
								if(response.errMsg != 'not exists'){
									return response.errMsg || response.error.message;
								}
							}
						},
						error: function(xhr, status, error) {
							util.showAndHidTips('wt_player_haijiao', 'fail');
							superVip._CONFIG_.videoObj.errMsg = '请求失败，请刷新页面再试'
							superVip._CONFIG_.videoObj.initAes = true;
						}
					});
				} catch (e) {
					superVip._CONFIG_.videoObj.errMsg = e.message || '请求失败，请刷新页面再试'
					superVip._CONFIG_.videoObj.initAes = true;
					util.showAndHidTips('wt_player_haijiao', 'fail');
				}
			}else{
				superVip._CONFIG_.videoObj.initAes = true;
			}
			// if (!superVip._CONFIG_.videoObj.url.includes('preview') && superVip._CONFIG_.videoObj.url.includes(
			// 		'.m3u8')) {
			// 	setTimeout(()=>{
			// 		util.showAndHidTips('wt_player_haijiao');
			// 	},1500)
			// }
		} else {
			GM_addStyle(`
				#wt-resources-box::after{ content: '';}
			`)
			insertDom =
				`<div style="margin: 20px;"><audio id="showaudio" src="${body.attachments[has_audio].remoteUrl}" controls controlslist="nodownload"></audio></div>`
		}
		try {
			const regRep = /class="sell_line2"\>[^\<]+<\/span>/.exec(body.content)[0]
			body.content = body.content.replace('<span class="sell-btn"',
				'<div id="wt-resources-box"><div class="sell-btn "').replace(regRep, regRep + insertDom +
				'</div></div>');
		} catch (e) {
			body.content += insertDom
		}
		return superVip._CONFIG_.hjedd ? body : util.jencode(body, isPlus);
	}

	let dom_elements = []
	for (const [id, src] of Object.entries(rest_img)) {
		dom_elements.push(`<img src="${src}" data-id="${id}"/>`);
	}
	let selled_img = `[sell]` + '<p>' + dom_elements.join('</p><p>') + '</p>' + `[/sell]`;
	let ncontent = body.content.replace(/<span class=\"sell-btn\".*<\/span>/, selled_img);
	body.content = ncontent;
	return superVip._CONFIG_.hjedd ? body : util.jencode(body, isPlus);
}

const util = {
	initAppDate: (haveBox = true)=>{
		let roles = '';
		if(superVip._CONFIG_.user && superVip._CONFIG_.user.roles){
			if(superVip._CONFIG_.user.roles.length > 0 && superVip._CONFIG_.user.roles[0].e){
				superVip._CONFIG_.user.roles.sort((a,b) =>{
					return a.e < b.e? 1: -1
				})
			}
			superVip._CONFIG_.user.roles.forEach(item => {
				if(item.e){
					if(item.e > 2047980427789){
						item.vip_day = '永久'
					}else{
						const time = item.e - Date.now()
						if(time < 86400000 && time > 0){
							if(time > 3600000){
								item.vip_day = parseInt(time / 3600000) + '小时'
							}else{
								item.vip_day = parseInt(time / 60000) + '分钟'
							}
						}else if(time <= 0){
							item.vip_day = '已过期'
							item.expire = true
						}else{
							item.vip_day = parseInt(time / 86400000) + '天'
							const d = time % 86400000
							if(d > 3600000){
								item.vip_day += parseInt(d / 3600000) + '小时'
							}
						}
					}
				}
				roles += `
					<div class="info-box ${item.expire?'expire':''}" data-l="${item.l}">
						<div class="avatar-box">
							<img class="avatar" src="${(superVip._CONFIG_.user.cdnDomain? superVip._CONFIG_.user.cdnDomain: superVip._CONFIG_.cdnBaseUrl) + '/images/boy.jpeg'}"/>
						</div>
						<div class="desc">
							<div style="font-size: 11px;">${item.n}</div>
						</div>
						<div class="vip-day">
							<div style="font-size: 10px;"></div>
							<div style="font-size: 10px;"></div>
						</div>
					</div>
				`;
			})
			if(haveBox){
				$('#wt-set-box .user-box-container .user-box .apps-container').empty()
				$('#wt-set-box .user-box-container .user-box .apps-container').append(roles)
			}
			$('#wt-set-box .user-box-container .user-box .info-box').on('click', function(e) {
				const l = e.currentTarget.attributes['data-l']?.value
				if(l && l.startsWith('http')){
					window.location.href = l
				}
			})
		}
		return haveBox? '': roles
	},
	
	copyText: (text) => {
		if (navigator.clipboard && window.isSecureContext) {
		        return navigator.clipboard.writeText(text);
		} else if (document.execCommand) {
			const textArea = document.createElement('textarea');
			textArea.style.position = 'fixed';
			textArea.style.top = textArea.style.left = '-100vh';
			textArea.style.opacity = '0';
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				const success = document.execCommand('copy');
				return success ? Promise.resolve() : Promise.reject();
			} catch (err) {
				return Promise.reject(err);
			} finally {
				textArea.remove();
			}
		} else {
			return Promise.reject(new Error('Clipboard API not supported and execCommand not available.'));
		}
	},

	logined: () => {
		$("#wt-my img").addClass('margin-left')
		$('#wt-my img').attr('src', superVip._CONFIG_.user.avatar)
		$('#wt-set-box .user-box-container .user-info').css('display', 'flex')
		$('#wt-set-box .user-box-container .user-info img').attr('src', superVip._CONFIG_.user.avatar)
		$('#wt-set-box .user-box-container .user-info .nickname').html(superVip._CONFIG_.user.nickname)
		$('#wt-set-box .user-box-container .user-info .username').html(superVip._CONFIG_.user.username)
	},

	logouted: (msg) => {
		superVip._CONFIG_.user = '';
		$("#wt-my img").removeClass('margin-left')
		$('#wt-my img').attr('src', (superVip._CONFIG_.user.cdnDomain? superVip._CONFIG_.user.cdnDomain: superVip._CONFIG_.cdnBaseUrl) + '/images/app.png')
		$('#wt-set-box .user-box-container .user-info').css('display', 'none')
		GM_setValue('jsxl_user', '')
		if(msg){
			util.showTips({
				title: '请重新登录，errMsg:' + msg
			})
		}
	},

	showAndHidTips: (name,val = 'success') => {
		if(val == 'success'){
			$('.' + name).addClass('tips-yuan')
		}else if(val == 'fail'){
			$('.' + name).addClass('tips-yuan-err')
		}else if(val == 'none'){
			$('.' + name).removeClass('tips-yuan')
			$('.' + name).removeClass('tips-yuan-err')
		}else{
			return ''
		}
	},
	
	addLogin: () => {
		if ($('#wt-login-box').length > 0) {
			$("#wt-login-box input").val('');
			return;
		}
		$('body').append(`
			<div id="wt-login-mask"></div>
			<div id="wt-login-box">
				<div class="logo">
					<p>@${superVip._CONFIG_.homeUrl.replace('https://','')}</p>
					<p>v ${superVip._CONFIG_.version}</p>
				</div>
				<div class="close"></div>
				<div class="title">账号登录</div>
				<div class="input-box">
					<input type="text" placeholder="请输入账号" maxLength="15"/>
				</div>
				<div class="input-box" style="margin-top:10px;">
					<input type="text" placeholder="请输入密码" maxLength="15"/>
				</div>
				<div class="j-login-btn">
					<button >登录</button>
				</div>
				<div class="to-index" style="display: flex;justify-content: space-between;color: #00bcd4; height: 40px;line-height: 40px;font-size: 11px;font-weight: 500;">
					<div class="wt-register">注册账号</div>
					<div class="wt-index">去发电获取权限？</div>
				</div>
			</div>
		`)
		GM_addStyle(`
			#wt-login-mask{ display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 11000;background-color: #0000004d;}
			#wt-login-box{position: fixed;margin-top: 3%;top: 50%;left: 50%;transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;padding: 30px;padding-bottom: 0;border-radius: 10px;z-index: 11010;}
			#wt-login-box::before{display: none; content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #00bcd4;z-index: -1;opacity: 0.7;bottom: 110px;right: 100px;}
			#wt-login-box::after{display: none;content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #2196F3;z-index: -1;opacity: 0.7;top: 115px;right: -112px;}
			#wt-login-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
			#wt-login-box .close::before,#wt-login-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 16px;height: 2px;border-radius: 1px;background-color: #222;transform: translate(-50%,-50%) rotate(45deg);}
			#wt-login-box .close::after,#wt-set-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
			#wt-login-box .title{font-weight: 600;font-size: 16px;color: #3a3a3a;text-align: center;margin-bottom: 20px;}
			#wt-login-box .input-box{display: flex;background-color: #f5f5f5;width: 160px;height: 35px;border-radius: 30px;overflow: hidden;font-size: 12px;}
			#wt-login-box .input-box input{width: 100%;height: 100%;padding-left: 15px;box-sizing: border-box;outline: none;border: none;background-color: #f5f5f5;font-size: 11px;color: black;letter-spacing: 1px;}
			#wt-login-box input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none !important; }
			#wt-login-box .j-login-btn{width: 100px;padding: 2px;height: 40px;font-size: 12px;margin: 15px auto;}
			#wt-login-box .j-login-btn button{width: 100%;height: 100%;border-radius: 30px;border: none;color: white;transition: all 0.3s ease;background-color: #00bcd4;}
			#wt-login-box .logo{position: absolute;top: 5%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;z-index: -10;}
		`)
		$("#wt-login-mask").on("click", () => {
			$('#wt-login-mask').css('display', 'none')
			$("#wt-login-box").removeClass('show-set-box')
			$("#wt-login-box").addClass('hid-set-box')
		})
		$("#wt-login-box .close").on("click", () => {
			$('#wt-login-mask').css('display', 'none')
			$("#wt-login-box").removeClass('show-set-box')
			$("#wt-login-box").addClass('hid-set-box')
		})
		$("#wt-login-box .to-index .wt-register").on("click", () => {
			window.open(superVip._CONFIG_.homeUrl + '/#/pages/login/login')
		})
		$("#wt-login-box .to-index .wt-index").on("click", () => {
			window.open(superVip._CONFIG_.homeUrl +'/#/')
		})
		$("#wt-login-box .j-login-btn button").on("click", async () => {
						
			try{
				$('#wt-loading-box').css('display', 'block')
				await util.sleep(300);
				$("#wt-login-box .j-login-btn button").addClass('btn-anima')
				setTimeout(() => {
					$("#wt-login-box .j-login-btn button").removeClass('btn-anima')
				}, 500)
				const username = $("#wt-login-box input")[0].value;
				let pwd = $("#wt-login-box input")[1].value;
				if(!username || username.length < 5 || username.length > 15 || !/^[A-Za-z0-9]+$/.test(username)){
					setTimeout(() => {
						$('#wt-loading-box').css('display', 'none')
						util.showTips({
							title: '账号错误，请使用' + superVip._CONFIG_.homeUrl.replace('https://','') + '网站注册的账号密码登入插件</br>' + superVip._CONFIG_.guide
						})
					}, 2000)
					return
				}
				if(!pwd || pwd.length < 5 || pwd.length > 15){
					setTimeout(() => {
						$('#wt-loading-box').css('display', 'none')
						util.showTips({
							title: '密码错误，请使用' + superVip._CONFIG_.homeUrl.replace('https://','') + '网站注册的账号密码登入插件</br>' + superVip._CONFIG_.guide
						})
					}, 2000)
					return
				}

				$.ajax({
					url: (superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/l' + (Math.floor(Math.random() * 2) + 1) + '00/ls',
					method: "POST",
					timeout: 12000,
					data: {
						username: username,
						password: pwd,
						d: Date.now(),
						ap: 'JU7QJJUU2JUI1JUI3JUU4JUE3JTkyJUU3JUE0JUJFJUU1JThDJUJBK5I1H',
						version: superVip._CONFIG_.version
					},
					dataType: 'json',
					success: function(response) {
						if (response.errCode != 0) {
							$('#wt-loading-box').css('display', 'none');
							util.showTips({
								title: response.errMsg + '，' + superVip._CONFIG_.guide
							})
						} else {
							response.data = ec.cskuecede(response.data)
							const res = {
								avatar: response.data.user.avatar,
								username: response.data.user.username,
								nickname: response.data.user.nickname,
								login_date: new Date().setHours(0,0,0,0),
								token: response.data.token,
								role: response.data.user.current_role,
								roles: response.data.user.roles,
								link: response.data.utilObj.link,
								apiDomain: response.data.utilObj.apiDomain,
								cdnDomain: response.data.utilObj.cdnDomain,
								downloadTips: response.data.utilObj.downloadTips
							}
							superVip._CONFIG_.user = res
							superVip._CONFIG_.user.ver = md5x(superVip)
							util.logined()
							GM_setValue('jsxl_user', res)
							GM_setValue('jsxl_login_code', JSON.stringify({u: username, p: pwd}))
							
							if(response.data?.utilObj?.notify){
								const historyNotify = GM_getValue('notify')
								if (!historyNotify || historyNotify != response.data.utilObj.notify) {
									GM_setValue('notifyShow', true);
									util.showAndHidTips('wt_my_notify')
									GM_setValue('notify', response.data.utilObj.notify)
								}
							}
							
							$('#wt-loading-box').css('display', 'none')
							$('#wt-login-mask').css('display','none')
							$("#wt-login-box").removeClass('show-set-box')
							$("#wt-login-box").addClass('hid-set-box')
							util.showTips({
								title: response.errMsg,
								success: (e) => {
									window.location.reload()
								}
							})
						}
					},
					error: function(e) {
						$('#wt-loading-box').css('display', 'none')
						console.log(e)
						util.showTips({
							title: (superVip._CONFIG_.user.apiDomain ? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '网络延迟登录失败，请关掉梯子(vpn)再试或梯子尝试换港台地区节点再试，一般关掉梯子多试几次登录就行，' + superVip._CONFIG_.guide
						})
					}
				});
			}catch(e){
				$('#wt-loading-box').css('display', 'block')
				alert(e)
				util.showTips({
					title: (superVip._CONFIG_.user.apiDomain ? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '网络延迟登录失败2，请关掉梯子(vpn)再试或梯子尝试换港台地区节点再试，一般关掉梯子多试几次登录就行，' + superVip._CONFIG_.guide
				})
			}
		})
	},

	jencode: (s, plus) => {
		return encode(JSON.stringify(s, `utf-8`), plus);
	},

	asyncHttp: async (url, timeout = 6000, isHeader = true, post = {}) => {
		return new Promise((resolve, reject) => {
			var request = new XMLHttpRequest();
			request.open(post.post?'POST': 'GET', url, true);
			if(isHeader){
				request.setRequestHeader('luckyToken', superVip._CONFIG_.user.token);
			}
			if(post.data){
				request.setRequestHeader('Content-Type', 'application/json');
			}
			request.timeout = timeout;
			request.onload = function() {
				if (request.readyState == 4) {
					if (request.status === 200) {
						resolve({
							errMsg: 'success',
							responseText: request.responseText
						});
					} else {
						resolve({
							errMsg: 'err1',
							responseText: ''
						});
					}
				}
			};
			request.onerror = function() {
				resolve({
					errMsg: 'err2',
					responseText: ''
				});
			};
			request.ontimeout = function() {
				resolve({
					errMsg: 'timeout',
					responseText: ''
				});
			};
			request.send(post.data?JSON.stringify(post.data): '');
		});
	},

	findCommonStart: (str1, str2) => {
		let common = '';
		const minLength = Math.min(str1.length, str2.length);
		for (let i = 0; i < minLength; i++) {
			if (str1[i] === str2[i]) {
				common += str1[i];
			} else {
				break;
			}
		}
		return common;
	},

	findTargetElement: (targetContainer, maxTryTime = 30) => {
		const body = window.document;
		let tabContainer;
		let tryTime = 0;
		let startTimestamp;
		return new Promise((resolve, reject) => {
			function tryFindElement(timestamp) {
				if (!startTimestamp) {
					startTimestamp = timestamp;
				}
				const elapsedTime = timestamp - startTimestamp;
				if (elapsedTime >= 500) {
					console.log("find element：" + targetContainer + "，this" + tryTime + "num")
					tabContainer = body.querySelector(targetContainer)
					if (tabContainer) {
						resolve(tabContainer)
					} else if (++tryTime === maxTryTime) {
						reject()
					} else {
						startTimestamp = timestamp
					}
				}
				if (!tabContainer && tryTime < maxTryTime) {
					requestAnimationFrame(tryFindElement);
				}
			}
			requestAnimationFrame(tryFindElement);
		});
	},

	replaceExistResources: (body) => {
		let attachments = body.attachments;
		let all_img = {};
		let has_video = -1;
		let has_audio = -1;
		for (var i = 0; i < attachments.length; i++) {
			var atta = attachments[i];
			if (atta.category === 'images') {
				all_img[atta.id] = atta.remoteUrl;
			}
			if (atta.category === 'audio') {
				has_audio = i;
				return [body, undefined, undefined, has_audio];
			}
			if (atta.category === 'video') {
				has_video = i;
				return [body, undefined, has_video, undefined];
			}
		}
		return [body, all_img, has_video];
	},

	sleep: (time) => {
		return new Promise((res, rej) => {
			setTimeout(() => {
				res()
			}, time)
		})
	},

	showTips: (item = {}) => {
		$('#wt-maxindex-mask').css('display', 'block');
		$("#wt-tips-box").removeClass('hid-set-box');
		$("#wt-tips-box").addClass('show-set-box');
		$('#wt-tips-box .btn-box').empty()
		$('#wt-tips-box .btn-box').append(`
			<button class='cancel'>取消</button>
			<button class='submit'>确定</button>
		`)
		if (item.title) $('#wt-tips-box .content').html(item.title);
		if (item.doubt) $('#wt-tips-box .btn-box .cancel').css('display', 'block');
		if (item.confirm) $('#wt-tips-box .btn-box .submit').html(item.confirm);
		if (item.hidConfirm) {
			$('#wt-tips-box .submit').css('display', 'none');
		} else {
			$('#wt-tips-box .submit').css('display', 'block');
		}
		$('#wt-tips-box .btn-box .submit').on('click', () => {
			$('#wt-maxindex-mask').css('display', 'none');
			$("#wt-tips-box").removeClass('show-set-box');
			$("#wt-tips-box").addClass('hid-set-box');
			if (item.success) item.success(true);
		})
		$('#wt-tips-box .btn-box .cancel').on('click', () => {
			$('#wt-maxindex-mask').css('display', 'none');
			$("#wt-tips-box").removeClass('show-set-box');
			$("#wt-tips-box").addClass('hid-set-box');
			if (item.success) item.success(false);
		})
	},

	showDownLoadWindow: (show = true, msg) => {
		if (!show) {
			$('#wt-mask-box').css('display', 'none');
			$("#wt-download-box").removeClass('show-set-box');
			$("#wt-download-box").addClass('hid-set-box');
			return
		}
		$('#wt-mask-box').css('display', 'block');
		if (!document.querySelector('#wt-download-box')) {
			let items = `<li class="item" data-url="${superVip._CONFIG_.videoObj.downloadUrlSign}" data-type="copy" style="background-color: #00bcd4;color:#e0e0e0;">复制链接</li>`
			superVip._CONFIG_.downUtils.forEach((item, index) => {
				items += `
					<li class="item" data-url="${item.url + superVip._CONFIG_.videoObj.downloadUrlSign}">${item.title}</li>
				`
			})
			$('body').append(`
				<div id="wt-download-box">
					<div class="close"></div>
					<div class="tips">* ${msg?msg + '(刷新页面或打开其它帖子链接将丢失，特长的链接有效期60分钟)': '特长的视频链接有效期60分钟，请尽快使用。'}</div>
					<ul>${items}</ul>
				</div>
			`)
		} else {
			$('#wt-download-box').empty()
			let items = `<li class="item" data-url="${superVip._CONFIG_.videoObj.downloadUrlSign}" data-type="copy" style="background-color: #00bcd4;color:#e0e0e0;">复制链接</li>`
			superVip._CONFIG_.downUtils.forEach((item, index) => {
				items += `
					<li class="item" data-url="${item.url + superVip._CONFIG_.videoObj.downloadUrlSign}">${item.title}</li>
				`
			})
			$('#wt-download-box').append(`<view class="close"></view><div class="tips">* ${msg?msg + '(刷新页面或打开其它帖子链接将丢失，特长的链接有效期60分钟)': '刷新页面或打开其它帖子链接将丢失，特长的链接有效期60分钟'}</div><ul>${items}</ul>`)
		}
		if(superVip._CONFIG_.isMobile && superVip._CONFIG_.isMobile[0] == 'iPhone'){
			$('#wt-download-box ul')[0].innerHTML += `<li class="item" data-open="1" data-url="https://apps.apple.com/cn/app/m3u8-mpjex/id6449724938">苹果视频下载软件</li>`
		}
		if(superVip._CONFIG_.isMobile && superVip._CONFIG_.isMobile[0] == 'Android'){
			$('#wt-download-box ul')[0].innerHTML += `<li class="item" data-open="1" data-url="https://wwjf.lanzoul.com/isifQ18id4fa">安卓视频下载软件(密3y3a)</li>`
		}
		
		$("#wt-download-box").removeClass('hid-set-box');
		$("#wt-download-box").addClass('show-set-box');
		$("#wt-download-box .item").on('click', function(e) {
			const url = e.target.dataset.url
			if(e.target.dataset.type == 'copy'){
				if(url){
					util.copyText(url).then(res => {
						util.showTips({
							title: '视频地址复制成功，请尽快使用'
						})
					}).catch(err =>{
						util.showTips({
							title: '复制失败，请通过下面在线下载再复制输入框内的视频地址'
						})
					})
				}else{
					util.showTips({
						title: '抱歉，未检测到视频'
					})
				}
				return;
			}
			if (!url || !url.includes('.m3u8') && e.target.dataset.open != 1) {
				util.showTips({
					title: '抱歉，未检测到视频，还继续前往吗?',
					doubt: true,
					success: (res) => {
						if (res) {
							window.open(url)
						}
					}
				})
			} else {
				window.open(url);
			}
		})
		$("#wt-download-box .close").on('click', function() {
			$("#wt-mask-box").click()
		})
	},

	formatTitle: (data, isPlus = false) => {
		if (!data) return data
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
		} else {
			data = JSON.parse(decode(data, isPlus))
		}
		if (!data || data == 'null') return superVip._CONFIG_.hjedd ? 'null' : 'WW01V2MySkJQVDA9'
		if (!data.results) {
			data.results = JSON.parse(JSON.stringify(data))
			data.isList = true
		}
		data.results.forEach(item => {
			let types = []
			if (item.hasVideo && !superVip._CONFIG_.hjedd) types.push('video')
			if (item.hasAudio && !superVip._CONFIG_.hjedd) types.push('audio')
			if (item.hasPic && !superVip._CONFIG_.hjedd) types.push('img')
			if (item.attachments && item.attachments.length > 0) {
				let imgCount = 0
				item.attachments.forEach(item => {
					if (item.category == 'video' && (!types.includes('video'))) types.push(
						'video')
					if (item.category == 'audio' && (!types.includes('audio'))) types.push(
						'audio')
					if (item.category == 'images') {
						if (!types.includes('img')) types.push('img')
						imgCount++
					}
				})
				if (superVip._CONFIG_.hjedd && (imgCount > 2) && !types.includes('video')) types
					.push('?')
			}

			types = types.length > 0 ? '[' + types.join('-') : '[';
			if ('money_type' in item) {
				types += ('-' + item.money_type);
			} else {
				types += ('-0');
			}
			types += ']';
			item.title = (types + item.title);

		})
		if (superVip._CONFIG_.hjedd) {
			return data.isList ? data.isList : data
		} else {
			return data.isList ? util.jencode(data.results, isPlus) : util.jencode(data, isPlus)
		}
	},

	lastingToken: (data) => {
		if (!data) return data;
		let info = '';
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true;
			info = data;
		} else {
			info = JSON.parse(decode(data));
		}
		const user = info.user ? info.user : info;
		user.title = {
			id: 6,
			name: unescape(encodeURIComponent('神豪')),
			consume: 10000000,
			consumeEnd: 0,
			icon: "https://hjpic.hjpfe1.com/hjstore/system/node/usertitle6.png?ver=1654590235"
		};
		user.vip = 4;
		user.famous = true;
		return superVip._CONFIG_.hjedd ? info : util.jencode(info);
	},

	formatVideo: (data) => {
		if (!data) return data;
		let video = '';
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true;
			video = data;
		} else {
			video = JSON.parse(decode(data));
		}
		video.type = 1;
		video.amount = 0;
		video.money_type = 0;
		video.vip = 0;
		if (video.remoteUrl && video.remoteUrl.startsWith('http')) {
			if (location.pathname == '/videoplay') {
				//短视频
				superVip._CONFIG_.videoObj.url = video.remoteUrl;
				superVip._CONFIG_.videoObj.downloadUrlSign = video.remoteUrl;
				superVip._CONFIG_.videoObj.type = 0;
				util.showAndHidTips('wt_player_haijiao');
			} else {
				superVip._CONFIG_.videoObj.url = video.remoteUrl;
				if (!superVip._CONFIG_.videoObj.type) {
					superVip._CONFIG_.videoObj.type = 0;
					util.showAndHidTips('wt_player_haijiao');
				}
			}
		}
		return superVip._CONFIG_.hjedd ? video : util.jencode(video);
	},

	showNotify: (item = {}) => {
		$("#wt-notify-box").removeClass('hid-notify-box');
		$("#wt-notify-box").addClass('show-notify-box');
		let version = superVip._CONFIG_.version;
		const v = /当前插件版本 (\d\.\d\.\d\.{0,1}\d{0,2})/.exec(item.title);
		if (v) item.title = item.title.replace(v[1], version);
		if (item.title) $('#wt-notify-box .content').html(item.title + (version ?
			'<div style="text-align: right;color: #ccc;font-size: 10px;margin-top: 10px;">v ' +
			version + '</div>' : ''));
		superVip._CONFIG_.showNotify = true;
		$('#wt-notify-box a').on('click', (e) => {
			e.stopPropagation();
		});
		$('#wt-notify-box').on('click', () => {
			$("#wt-notify-box").removeClass('show-notify-box');
			$("#wt-notify-box").addClass('hid-notify-box');
			superVip._CONFIG_.showNotify = false;
			if (item.success) item.success(true);
		});
	}
}

const superVip = (function() {
	const _CONFIG_ = {
		homeUrl: 'https://xysdjb.com',
		apiBaseUrl: 'https://api.xysdjb.com',
		cdnBaseUrl: 'https://cdn.xysdjb.com',
		guide: '</br></br><span style="color: #d9a300;">如长时间登录失败，提示网络延迟错误请前往以下网站查看公告或尝试联系客服</span></br></br><a style="text-decoration: none;color: #3a3a3a;" href="https://notify.xysdjb.com">Lucky公告网址，点击前往</a></br></br><a style="text-decoration: none;" href="https://notify.xysdjb.com">notify.xysdjb.com</a>',
		isMobile: navigator.userAgent.match(
			/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
		vipBoxId: 'wt-vip-jx-box' + Math.ceil(Math.random() * 100000000),
		version: '1.2.7',
		videoObj: {},
		user:{},
		downUtils:[
			{title: '在线下载1(适合电脑)',url:'https://tools.thatwind.com/tool/m3u8downloader#m3u8='},
			{title: '在线下载2(适合电脑)',url:'https://getm3u8.com/?source='}
		]
	}
	
	class BaseConsumer {
		constructor(body) {
			this.parse = () => {
				const titleSwitch = GM_getValue('titleSwitch')
				_CONFIG_.titleSwitch = (titleSwitch == -1? -1: 1)
				this.interceptHttp();
				util.findTargetElement('body').then(container => {
					container.style.overflowY = 'auto !important';
					this.generateElement(container).then(
						container => this.bindEvent(container))
				})
			}
		}

		interceptHttp() {
			if(location.href.includes('/pages/hjsq/')){
				const interceptMedia = (element) => {
					if(element.src && element.src.match(/\.mp4$/)){
						if(!superVip._CONFIG_.videoObj.url || superVip._CONFIG_.videoObj.url != element.src){
							superVip._CONFIG_.videoObj.downloadUrlSign = ''
							superVip._CONFIG_.videoObj.url = element.src
							superVip._CONFIG_.videoObj.type = 0
							superVip._CONFIG_.videoObj.playerType = 'mp4'
							util.showAndHidTips('wt_player_haijiao');
						}
					}
				};
			
				setInterval(()=>{
					document.querySelectorAll('#myVideo source').forEach(interceptMedia);
				},700)
			}
			
			const originOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function(method, url) {
				this.ontimeout = function() {
					window.location.reload()
				}
				if (/\/api\/comment\/reply$/.test(url)) {
					this._scope_url = url
				}
				if (_CONFIG_.user && _CONFIG_.user.token) {
					if (/\/api\/banner\/banner_list/.test(url)) {
						this.abort()
					}
					if (/\/api\/topic\/hot\/topics\?/.test(url) && _CONFIG_.titleSwitch == 1) {
						const xhr = this;;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/search/.test(url) && _CONFIG_.titleSwitch == 1) {
						;
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/\d+/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = modifyData(res.data)
									if(res.data){
										return JSON.stringify(res, `utf-8`);
									}else{
										return result;
									}
								} catch (e) {
									alert(e)
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/attachment/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if (res.data) {
										// const body = JSON.parse(decode(res.data, superVip))
										res.data = util.formatVideo(res.data);
									}
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/(node\/(topics|news)|idol_list)/.test(url) && _CONFIG_.titleSwitch == 1) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data, url.includes('api/topic/idol_list') || url.includes('api/topic/node/topics'))
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
					
					if (/\/api\/user\/(info\/(\d+))|current/.exec(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									const regRes = /\/api\/user\/(info\/(\d+))|current/
										.exec(
											url);
									const uid = sessionStorage.getItem('uid');
									if (regRes.length > 2 && (regRes[2] && regRes[2] != uid) && res.message.includes('禁')) {
										const user =  {
											'isFavorite': false,
											'likeCount': 12,
											'user': {
												'id': parseInt(regRes[2]),
												'nickname': '被封禁账号',
												'avatar': '0',
												'description': `该账号已被封禁`,
												'topicCount': 100,
												'videoCount': 0,
												'commentCount': 303,
												'fansCount': 57,
												'favoriteCount': 39,
												'status': 0,
												'sex': 1,
												'vip': 0,
												'vipExpiresTime': '0001-01-01 00:00:00',
												'certified': false,
												'certVideo': false,
												'certProfessor': false,
												'famous': false,
												'forbidden': false,
												'tags': null,
												'role': 0,
												'popularity': 10,
												'diamondConsume': 0,
												'title': {
													'id': 0,
													'name': '',
													'consume': 0,
													'consumeEnd': 0,
													'icon': "https://hjpic.hjpfe1.com/hjstore/system/node/usertitle2.png?ver=1654590917"
												},
												'friendStatus': false,
												'voiceStatus': false,
												'videoStatus': false,
												'voiceMoneyType': 0,
												'voiceAmount': 0,
												'videoMoneyType': 0,
												'videoAmount': 0,
												'depositMoney': 0
											}
										}
										res.isEncrypted = true;
										res.errorCode = 0;
										res.success = true;
										res.message = "";
										res.data = util.jencode(user, 'plus');
										util.showTips({
											title: '此博主已被海角官方封禁，是否前往盗版海角查看此封禁博主帖子?',
											doubt: true,
											success: (res)=>{
												if(res){
													window.open(location.href.replace(/.+uid=/,ec.cskuecede(superVip._CONFIG_.user.link)).replace(/.+homepage\//,ec.cskuecede(superVip._CONFIG_.user.link)));
												}
											}
										})
									}
									if(regRes[2] == uid || location.href.includes('/user/myinfo')){
										res.data = util.lastingToken(res.data);
									}
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/api\/login\/signin/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if (res.success) {
										const username = document.querySelector(
											'input[placeholder="请输入用户名/邮箱"],input[placeholder="请输入用户名"]'
											).value
										const pwd = document.querySelector(
											'input[type="password"]').value
										if (username && pwd) {
											GM_setValue('haijiao_userpwd', {
												username,
												pwd
											})
										}
										util.findTargetElement(
												'.van-dialog__cancel,.el-button--small', 7)
											.then(res => {
												res.click()
											})
									} else {
										util.showTips({
											title: res.message
										})
									}
									res.data = util.lastingToken(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/api\/video\/checkVideoCanPlay/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatVideo(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						})
					}
		
					if (/api\/login\/signup/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if (!res.success) {
										util.showTips({
											title: res.message
										})
									}
									return result
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						})
					}
				}
				originOpen.call(this, method, url);
			};
		
			const oldSend = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.send = function(...args) {
				if (this._scope_url && args.length > 0) {
					try {
						args[0] = args[0].replace(args[0].match(/"content":"<p>(.+)<\/p>",/)[1], util
							.decoat(
								'JUU2JTg0JTlGJUU4JUIwJUEyJUU1JThEJTlBJUU0JUI4JUJCJUU1JTg4JTg2JUU0JUJBJUFCJUVGJUJDJThDJUU1JUE1JUIzJUU0JUI4JUJCJUU3JTlDJTlGJUU2JTk4JUFGJUU2JTlFJTgxJUU1JTkzJTgxJUU1JUIwJUE0JUU3JTg5JUE5JUVGJUJDJThDJUU2JTlDJTlCJUU1JThEJTlBJUU0JUI4JUJCJUU2JThDJTgxJUU3JUJCJUFEJUU2JTlCJUI0JUU2JTk2JUIw'
								))
					} catch (e) {
						console.log(e)
					}
				}
				return oldSend.call(this, ...args)
			};
			
			const originalFetch = unsafeWindow.fetch;
			unsafeWindow.fetch = function(url, options) {
				if (/\/topic\/\d+\?_rsc=/.test(url)) {
					const pid = /\/(\d+)\?_rsc/.exec(url)[1]
					initAi(pid)
				}
			    return originalFetch(url, options);
			};
		}

		generateElement(container) {
			GM_addStyle(`
				@font-face {
				  font-family: 'iconfont';  /* Project id 4784633 */
				  src: url('//at.alicdn.com/t/c/font_4784633_m832t9irm9f.woff2?t=1734418085047') format('woff2'),
				       url('//at.alicdn.com/t/c/font_4784633_m832t9irm9f.woff?t=1734418085047') format('woff'),
				       url('//at.alicdn.com/t/c/font_4784633_m832t9irm9f.ttf?t=1734418085047') format('truetype');
				}
				.iconfont {
				    font-family: "iconfont" !important;
				    font-size: 16px;
				    font-style: normal;
		            font-weight: 400 !important;
				    -webkit-font-smoothing: antialiased;
				    -moz-osx-font-smoothing: grayscale;
				}
				@keyframes showSetBox {
					0% {
						transform: translate(-50%,-50%) scale(0);
					}
					80% {
						transform: translate(-50%,-50%) scale(1.1);
					}
					100% {
						transform: translate(-50%,-50%) scale(1);
					}
				}
				@keyframes hidSetBox {
					0% {
						transform: translate(-50%,-50%) scale(1);
					}
					80% {
						transform: translate(-50%,-50%) scale(1.1);
					}
					100% {
						transform: translate(-50%,-50%) scale(0);
					}
				}
				@keyframes colorAnima {
					0%{
						background-color: #f0f0f0;
						color: #5d5d5d;
						transform: scale(1);
					}
					50%{
						transform: scale(1.1);
					}
					100%{
						background-color: #ff6022;;
						color: white;
						transform: scale(1);
					}
				}
				@keyframes showNotifyBox {
					0% {
						transform: translate(-50%,-100%) scale(0);
					}
					80% {
						transform: translate(-50%,35px) scale(1.1);
					}
					100% {
						transform: translate(-50%,35px) scale(1);
					}
				}
				@keyframes hidNotifyBox {
					0% {
						transform: translate(-50%,35px) scale(1.1);
					}
					80% {
						transform: translate(-50%,35px) scale(1);
					}
					100% {
						transform: translate(-50%,-100%) scale(0);
					}
				}
				@keyframes scale {
					0%{
						transform: scale(1);
					}
					50%{
						transform: scale(1.1);
					}
					100%{
						transform: scale(1);
					}
				}
				@keyframes circletokLeft {
				    0%,100% {
				        left: 0px;
				        width: 12px;
				        height: 12px;
				        z-index: 0;
				    }
				    25% {
				        height: 15px;
				        width: 15px;
				        z-index: 1;
				        left: 8px;
				        transform: scale(1)
				    }
				    50% {
				        width: 12px;
				        height: 12px;
				        left: 22px;
				    }
				    75% {
				        width: 10px;
				        height: 10px;
				        left: 8px;
				        transform: scale(1)
				    }
				}
				@keyframes circletokRight {
				    0%,100% {
				        top: 3px;
				        left: 22px;
				        width: 12px;
				        height: 12px;
				        z-index: 0
				    }
				    25% {
				        height: 15px;
				        width: 15px;
				        z-index: 1;
				        left: 24px;
				        transform: scale(1)
				    }
				    50% {
				        width: 12px;
				        height: 12px;
				        left: 0px;
				    }
				    75% {
				        width: 10px;
				        height: 10px;
				        left: 24px;
				        transform: scale(1)
				    }
				}
				@keyframes circularRight{
					0%{
						transform: translateX(0);
						width: 22px;
					}
					30%{
						width: 44px;
					}
					100%{
						transform: translateX(25px);
						width: 22px;
					}
				}
				@keyframes circularLeft{
					0%{
						transform: translateX(25px);
						width: 22px;
					}
					30%{
						transform: translateX(25px);
						width: 40px;
					}
					100%{
						transform: translateX(0px);
						width: 22px;
					}
				}
				.color-anima{
					animation: colorAnima .3s ease 1 forwards;
				}
				.btn-anima{
					animation: scale .3s ease 1 forwards;
				}
				.login-btn::after,.login-form-button::after{content:'(如点登录后没反应，请关闭插件再试)';color:#00bcd4;margin-left:5px;font-size: 10px;}
				.circle-swipe,.static-row,.scroll-btn,.el-message-box,.van-toast,.el-message,.v-modal,.publicContainer,.containeradvertising,#home .btnbox,#home .addbox,.topbanmer,.bannerliststyle,.ishide,#jsxl-box,#jsxl-mask{display:none !important;z-index:-99999 !important;opacity: 0!important;width :0 !important;}
				#wt-resources-box{position: relative; border: 1px dashed #ec8181;background: #fff4f4;}
				.sell-btn{border:none !important;margin-top:20px;}
				.margin-left{ margin-left: 0 !important;}
				.show-set-box{ animation: showSetBox 0.3s ease 1 forwards;}
				.hid-set-box{ animation: hidSetBox 0.3s ease 1 forwards;}
				.show-notify-box{ animation: showNotifyBox 0.3s ease 1 forwards;}
				.hid-notify-box{ animation: hidNotifyBox 0.3s ease 1 forwards;}
				#wt-loading-box{display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 100000;background-color: #0000004d;}
				#wt-loading-box .loading{position: absolute;width: 35px;height: 17px;top: 50%;left: 50%;transform: translate(-50%,-50%);}
				#wt-loading-box .loading::before,
				#wt-loading-box .loading::after{position: absolute;content: "";top: 3px;background-color: #ffe60f;width: 14px;height: 14px;border-radius: 20px;mix-blend-mode: multiply;animation: circletokLeft 1.2s linear infinite;}
				#wt-loading-box .loading::after{animation: circletokRight 1.2s linear infinite;background-color: #4de8f4;}
				#wt-left-show{ position: fixed;left: 20px;top: 50%;transform: translateY(-50%);z-index: 9999;transition: all 0.3s ease;}
				#wt-left-show i {color: #5f5b5b;font-size: 27px;color: #E91E63;text-shadow: #E91E63 2px 2px 12px;font-size: 25px;margin-left: -1px;}
				#wt-${_CONFIG_.vipBoxId}{
					position: fixed;
					top: 50%;
					transform: translate(0, -50%);
					right: 10px;
					width: 46px;
					border-radius: 30px;
					background: rgb(64 64 64 / 81%);
					box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
					z-index: 9999;
					transition: all 0.3s ease;
				}
				#wt-${_CONFIG_.vipBoxId} .item{position: relative;height: 60px;}
				.tips-yuan::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #5ef464;}
				.tips-yuan-err::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #f83f32;}
				#wt-${_CONFIG_.vipBoxId} .item .iconfont,#wt-${_CONFIG_.vipBoxId} .item img{position: absolute;top:50%;left:50%;transform: translate(-50%,-50%)}
				#wt-login-box .close,#wt-set-box .close,#wt-notify-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;z-index: 100;}
				#wt-login-box .close::before,#wt-login-box .close::after,#wt-set-box .close::before,#wt-set-box .close::after,#wt-notify-box .close::before,#wt-notify-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 12px;height: 2px;border-radius: 1px;background-color: #6a6a6a;transform: translate(-50%,-50%) rotate(45deg);visibility: visible;}
				#wt-login-box .close::after,#wt-set-box .close::after,#wt-notify-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-${_CONFIG_.vipBoxId} .absolute-center{ position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
				#wt-${_CONFIG_.vipBoxId} #wt-my img{ width: 28px;height: 28px;border-radius: 30px;margin-left: 2px;transtion: all 0.3s ease;}
				#wt-${_CONFIG_.vipBoxId} #wt-my-set i {color: white;font-size: 24px;text-shadow: 2px 2px 14px #ffffff;font-family: 'iconfont';}
				#wt-${_CONFIG_.vipBoxId} #wt-my-down i {color: white;font-size: 24px;text-shadow: 2px 2px 15px #ffffff;font-family: 'iconfont';}
				#wt-${_CONFIG_.vipBoxId} #wt-my-notify i {color: white;font-size: 27px;padding: 10px 1px;text-shadow: 2px 2px 12px #ffffff;}
				#wt-${_CONFIG_.vipBoxId} #wt-hid-box i {color: white;font-size: 21px;text-shadow: 2px 2px 12px #ffffff;margin-left: -1px;}
				.wt-player-btn-box .player-btn{ position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width: 20%}
				.wt-player-btn-box .tips{ position: absolute;bottom: 20px;left:50%;transform: translateX(-50%);color: #FFC107;width: 80%;text-align: center;font-size: 15px;font-weight: 500;}
				#wt-mask-box,#wt-maxindex-mask{display:none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; background-color: #00000057;}
				#wt-maxindex-mask{z-index: 950000;display:none;}
				#wt-set-box{ position:fixed; top:50%;left:50%; transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);border-radius: 12px;z-index: 10010;padding: 10px 15px;padding-right: 5px;box-sizing: border-box;width: 300px;}
				#wt-set-box::before{display: none; content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #2196F3;z-index: -1;opacity: 0.7;bottom: 0;transform: translate(-40%,58%);}
				#wt-set-box::after{display: none; content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;top: 0;right: 0;transform: translate(22%,-53%);}
				#wt-set-box .selected-box .selected{ background-color: #ff6022;color: white;}
				#wt-set-box .user-box-container{display: none;letter-spacing: 1px;}
				#wt-set-box .info-box{display:flex;height: 50px;align-items: center;}
				#wt-set-box .expire{ opacity: 0.35;}
				#wt-set-box .info-box .avatar-box{position: relative;height: 36px;width: 36px;background-color: white;border-radius: 7px;box-shadow: rgb(166 166 166 / 20%) 0px 1px 20px 0px;}
				#wt-set-box .user-box .title{text-align: center;font-weight: 600;font-size: 16px;color: #3a3a3a;}
				#wt-set-box .user-box .desc{display: flex;flex-direction: column;height: 36px;justify-content: space-around;flex: 8;font-size: 10px;color: #5d5d5d;margin-left: 10px;}
				#wt-set-box .user-box .vip-day{margin-right: 10px;text-align: center;color: #8a8a8a;font-size: 11px;}
				#wt-set-box .user-box .avatar{position: absolute; width: 36px;height:36px;border-radius: 30px;border-radius: 7px;font-size: 0;}
				#wt-set-box .user-box .user-info{ display: block !important; position: relative; left: -5px;margin-bottom: 4px;background-color: #f1f1f1;border-radius: 11px;padding: 7px;}
				#wt-set-box .user-box .user-info .info{margin-left: 10px;width: 180px;}
				#wt-set-box .user-box .user-info .info .nickname{color: #676767;font-size: 12px;letter-spacing: 1px;}
				#wt-set-box .user-box .user-info .info .username{color: #b9b9b9;font-size: 10px;margin-top: 2px;}
				#wt-set-box .user-box .user-info .logout{position: absolute;font-size: 0;right: 12px;}
				#wt-set-box .user-box .user-info .logout button{padding: 0 10px;height: 28px;background-color: #1499d5;border-radius: 30px;color: white;border: none;font-size: 10px;}
				#wt-set-box .user-box .user-info .switch-box{display:inline-block;position:relative;height:28px;width:56px;transform: scale(0.8);color:white;border-radius:30px;background-color:#b7b7b7;}
				#wt-set-box .user-box .user-info .switch-box .circularRight{animation: circularRight 0.3s ease-in-out forwards;}
				#wt-set-box .user-box .user-info .switch-box .circularLeft{animation: circularLeft 0.3s ease-in-out forwards;}
				#wt-set-box .user-box .user-info .switch-box .circular{position:absolute;top:3px;right:5px;margin-right:25px;width:22px;height:22px;background-color:white;border-radius:20px;z-index:99;transition:all 0.3 sease-in-out;}
				#wt-set-box .user-box .user-info .switch-box .item-box{position:absolute;top:0;left:0;height:28px;width:56px;}
				#wt-set-box .user-box .user-info .switch-box .item-box .on,#wt-set-box .user-box .user-info .switch-box .item-box .off{position:absolute;top:0;left:0;padding:0 5px;height:28px;width:56px;border-radius:30px;background-color:#b7b7b7;box-sizing:border-box;}
				#wt-set-box .user-box .user-info .switch-box .item-box .on{transition:all 0.3s ease-in-out;opacity:0;background-color: #b7b7b7;}
				#wt-set-box .user-box .user-info .switch-box  .open{z-index:1;opacity:1!important;animation:myShakeY .3s ease-in-out;}
				#wt-set-box .user-box .apps-container{ height: 330px; overflow: auto; margin-bottom: 10px;}
				#wt-tips-box,#wt-download-box{ position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);overflow: hidden;width: 240px;min-height:130px;background-color: white;border-radius:12px;z-index: 999999;padding:10px 15px;}
				#wt-tips-box,#wt-download-box .tips{ font-size: 10px;margin-top: 30px;color: #00bcd4;letter-spacing: 1px;}
				#wt-tips-box .title{font-size: 16px;text-align: center;font-weight: 600;}
				#wt-tips-box .content{text-align: center;margin: 14px 0;font-size: 12px;color: #2a2a2a;font-weight: 500;word-break: break-word;}
				#wt-tips-box .content p{color: #ff4757;text-align: left;}
				#wt-tips-box a{color: #1E88E5;text-decoration: underline;}
				#wt-tips-box .btn-box{display:flex;justify-content: space-around;}
				#wt-tips-box .btn-box button{min-width: 60px;height: 28px;background-color: #00bcd4;border-radius: 30px;color: white;border: none;font-size: 12px;}
				#wt-tips-box .btn-box .cancel{display: none;background-color: #eee;color:#2a2a2a}
				#wt-tips-box .logo{position: absolute;top: 9%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;z-index: -10;}
				#wt-tips-box .version{position: absolute;top: 9%; right: 10%;transform: rotate(-15deg);color: #dbdbdb;}
				#wt-notify-box {position: fixed;top: 2%;left: 50%;transform:translate(-50%,-100%) scale(0);overflow: hidden;width: 80%;min-height: 75px;letter-spacing: 1px;background-color: white;color:#2a2a2a;border-radius: 15px;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);z-index: 95000;}
				#wt-notify-box::after{display: none; content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #03A9F4;z-index: -1;opacity: 0.7;bottom: 0;left: 0;transform: translate(-50%,85%);}
				#wt-notify-box .title{ text-align: center;height: 35px; line-height: 35px;font-size: 15px;font-weight: 600; color: #00bcd4;}
				#wt-notify-box .content{ color: #3a3a3a;padding: 10px 15px;font-size: 12px;}
				#wt-notify-box .content a{color: #1E88E5;text-decoration: underline;}
				#wt-notify-box .content p{margin-bottom: 5px;}
				.wt-player-btn-box{ position:absolute;top:0;left:0;right:0;bottom:0;z-index: 9998;background-color: #0000004d;}
				#wt-video-container{display: none; position:fixed;top: 0;left: 0;right: 0;bottom: 0; z-index: 99999;background-color: black;}
				#wt-video-container .wt-video{ position:absolute;top:50%;width:100%;transform: translateY(-50%);height: 240px; z-index: 9999;}
				#wt-video-container .wt-video video{width:100%;height: 100%;}
				#wt-video-container .player-tips{position: fixed ;bottom: 10% ;left:50%; transform: translateX(-50%);font-size: 16px;letter-spacing: 2px;white-space: nowrap;padding: 10px;text-wrap: wrap;width: 80%;color: #04b20b;}
				.dplayer-controller{bottom: 30px !important;}
				.main-player{height: 300px;}
				.dplayer.dplayer-hide-controller .dplayer-controller{ opacity: 0 !important;transform: translateY(200%) !important;}
				.wt-close-btn{ font-size: 15px;position: absolute;top: 40px;left: 25px;color: white;}
				#wt-download-box{ z-index: 10010;}
				#wt-download-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
				#wt-download-box .close::before,#wt-download-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 14px;height: 2px;border-radius: 1px;background-color: #adadad;transform: translate(-50%,-50%) rotate(45deg);}
				#wt-download-box .close::after,#wt-download-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-download-box::before{display: none; content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #00bcd4;z-index: -1;opacity: 0.7;top: 0;left: 0;transform: translate(-38%,-40%);}
				#wt-download-box::after{display: none; content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;bottom: 0;right: 0;transform: translate(62%,30%);}
				#wt-download-box ul li{ height: 38px;line-height: 38px;font-size: 11px;text-align: center;color:#909090;font-weight: 500;background-color: white;box-shadow: rgb(166 166 166 / 20%) 0px 1px 5px 1px;margin: 18px 30px;border-radius: 40px;}
				`)
			if (_CONFIG_.isMobile) {
				GM_addStyle(`
		            #wt-set-box {width:80%;}
		        `);
			}
			const roles = util.initAppDate(false);
			$(container).append(`
		        <div id="wt-${_CONFIG_.vipBoxId}">
				    <div id="wt-my" class="item wt_my_haijiao">
						<img src="${(superVip._CONFIG_.user.cdnDomain? superVip._CONFIG_.user.cdnDomain: superVip._CONFIG_.cdnBaseUrl) + '/images/app.png'}"></img>
				    </div>
				    <div id="wt-my-set" class="item wt_player_haijiao">
					    <i class="iconfont">&#xe623;</i>
				    </div>
					<div id="wt-my-down" class="item wt_my_down_haijiao">
					    <i class="iconfont">&#xe61c;</i>
					</div>
					<div id="wt-my-notify" class="item wt_my_notify" style="padding: 0 11px;">
					    <i class="iconfont">&#xe604;</i>
					</div>
				    <div id="wt-hid-box" class="item">
					    <i class="iconfont">&#xe65f;</i>
				    </div>
			    </div>
			    <div id="wt-left-show" style="transform: translate(-60px,-50%);padding: 10px;">
					<i class="iconfont">&#xe675;</i>
			    </div>
				<div id="wt-mask-box"></div>
				<div id="wt-set-box">
					<div class="close"></div>
					<div class="line-box" style="display:none">
					</div>
					<div class="user-box-container">
						<div class="user-box">
							<div class="title" style="margin-bottom: 10px">App</div>
							<div class="user-info">
								<div class="minfo" style="display: flex;align-items: center;">
									<div class="avatar" style="position: relative;">
										<img src="${(superVip._CONFIG_.user.cdnDomain? superVip._CONFIG_.user.cdnDomain: superVip._CONFIG_.cdnBaseUrl) + '/images/boy.jpeg'}" style="width: 100%;height: 100%;border-radius: 8px;"></img>
									</div>
									<div class="info">
										<div class="nickname">请登录</div>
										<div class="username">xxxxxxxxxx</div>
									</div>
									<div class="logout">
										<button>退出登录</button>
									</div>
								</div>
								<div style="display: flex;align-items: center;justify-content: space-between;margin-top: 8px;">
									<div style="font-size: 11px;color: #607d8b;letter-spacing: 2px;">帖子标题提醒(video/img...)</div>
									<div class="switch-box">
										<div class="circular"></div>
										<div class="item-box">
											<div class="on"></div>
											<div class="off"></div>					
										</div>
									</div>
								</div>
							</div>
							<div class="apps-container"> ${roles}</div>
						</div>
					</div>
				</div>
				<div id="wt-loading-box">
					<div class="loading"></div>
				</div>
				<div id="wt-maxindex-mask"></div>
				<div id="wt-tips-box">
					<div class="title">提示</div>
					<div class="content"></div>
					<div class="btn-box">
						<button class='cancel'>取消</button>
						<button class='submit'>确定</button>
					</div>
					<div class="logo"><p>@${superVip._CONFIG_.homeUrl.replace('https://','')}</p></div>
					<div class="version"><p>v ${superVip._CONFIG_.version}</p></div>
				</div>
				<div id="wt-notify-box">
					<div class="close"></div>
					<div class="title">通知</div>
					<div class="content"></div>
				</div>
				<div id="wt-video-container">
					<div class="wt-close-btn">
						<i class="van-icon van-icon-close"></i>
						<span style="margin-left: 5px;">退出播放</span>
					</div>
					<div class="wt-video">
						<video id="wt-video" controls></video>
					</div>
					<div class="player-tips">如卡顿最好开梯子进行播放，理论上会流畅些。</div>
				</div>
		    `)
			if (_CONFIG_.user && _CONFIG_.user.avatar) {
				util.logined()
			}
			if(_CONFIG_.titleSwitch == 1){
				$("#wt-set-box .user-box .user-info .switch-box .circular").removeClass('circularLeft')
				$("#wt-set-box .user-box .user-info .switch-box .circular").addClass('circularRight')
				$("#wt-set-box .user-box .user-info .switch-box .on").css("backgroundColor", "#1499d5")
				$("#wt-set-box .user-box .user-info .switch-box .on").addClass('open')
			}
			return new Promise((resolve, reject) => resolve(container));
		}

		bindEvent(container) {
			const vipBox = $(`#wt-${_CONFIG_.vipBoxId}`)
			if (GM_getValue('haijiao_hid_controller', null)) {
				vipBox.css("transform", "translate(125%, -50%)")
				$('#wt-left-show').css("transform", "translate(0, -50%)")
			}

			vipBox.find("#wt-my").on("click", () => {
				if (_CONFIG_.user) {
					$('#wt-mask-box').css('display', 'block')
					$("#wt-set-box .user-box-container").css('display', 'block')
					$("#wt-set-box").removeClass('hid-set-box')
					$("#wt-set-box").addClass('show-set-box')
					$('#wt-set-box .user-box-container .nickname').html(_CONFIG_.user.nickname)
					util.initAppDate()
				} else {
					util.addLogin()
					$('#wt-login-mask').css('display','block')
					$("#wt-login-box").removeClass('hid-set-box')
					$("#wt-login-box").addClass('show-set-box')
					const jsxl_login_code = GM_getValue('jsxl_login_code','')
					if(jsxl_login_code){
						try{
							const user = JSON.parse(jsxl_login_code)
							if(user.u && user.u != 'undefined'){
								$("#wt-login-box input")[0].value = user.u;
							}
							if(user.p && user.p != 'undefined'){
								$("#wt-login-box input")[1].value = user.p;
							}
						}catch(e){}
					}
				}
			})

			vipBox.find("#wt-my-set").on("click", async () => {
				try{ const videos = document.querySelectorAll('video'); videos.forEach(function(video) { video.pause(); }); }catch(e){};
				if(!_CONFIG_.user){ 
					$("#wt-my").click(); return;
				};
				if(_CONFIG_.videoObj && _CONFIG_.videoObj.errMsg){
					util.showTips({ title: _CONFIG_.videoObj.errMsg }); return;
				}
				if(/\/topics\/\d+$/.test(location.href)){
					//hjai11
					const pid = /\/topics\/(\d+)$/.exec(location.href)[1]
					const res = await initAi(pid, true)
					if(!res){
						return
					}
				}
				if (!_CONFIG_.videoObj.url) {
					$('#wt-loading-box').css('display', 'block')
					for (let i = 0; i < 5; i++) {
						await util.sleep(1000)
						if (_CONFIG_.videoObj.url) {
							$('#wt-loading-box').css('display', 'none')
							break
						}
					}
					$('#wt-loading-box').css('display', 'none')
				}
				if (_CONFIG_.videoObj.url && _CONFIG_.videoObj.url != 1) {
					$('#wt-video-container').css('display', 'block')
					$("#wt-hid-box").click()
					if (_CONFIG_.videoObj.type != 0 && !superVip._CONFIG_.videoObj.hjai) {
						if (!_CONFIG_.videoObj.url.startsWith('blob:http')) {
							util.showTips({
								title: location.href + '</br>此视频可能还未被解析，正在解析中请勿操作。。。</br>如解析时长大于1分钟请考虑开梯子再试</br>插件唯一网站' + _CONFIG_.homeUrl.replace('https://',''),
								hidConfirm: true
							})
							await util.sleep(500)
						}
						_CONFIG_.videoObj.url = await get_m3u8_url_haijiao()
						if (!_CONFIG_.videoObj.url.includes('http')) {
							if (_CONFIG_.videoObj.url.includes('通知:') || _CONFIG_.videoObj.url
								.includes('最新版本')) {
								util.showTips({
									title: _CONFIG_.videoObj.url
								})
							} else {
								util.showTips({
									title: _CONFIG_.videoObj.url + '</br>' + location
										.href + '</br>抱歉，解析失败，如有问题请联系发电网站' + _CONFIG_.homeUrl.replace('https://','') +'中售后联系方式'
								})
							}
							return;
						}
						$('#wt-tips-box .btn-box .submit').click()
					}
					
					if(_CONFIG_.videoObj?.playerType == 'mp4'){
						$('.wt-video').empty();
						$('.wt-video').append(`
							<video controls width="100%" height="100%">
								<source src="${_CONFIG_.videoObj?.url}">
							</video>
						`)
						return;
					}
					document.querySelector('#wt-video-container .wt-close-btn span').innerHTML = '退出播放(' + (_CONFIG_.isMobile? _CONFIG_.isMobile[0]: 'Windows') + ')';
					if (_CONFIG_.isMobile && _CONFIG_.isMobile[0] == 'iPhone') {
						$('.wt-video').empty();
						$('.wt-video').append(`
							<video controls width="100%" height="100%">
								<source src="${_CONFIG_.videoObj.url}" type="${superVip._CONFIG_.videoObj.playerType?'video/mp4':'application/x-mpegURL'}">
							</video>
						`)
					} else {
						if(superVip._CONFIG_.videoObj.playerType){
							$('.wt-video').append(`
								<video controls width="100%" height="100%">
									<source src="${_CONFIG_.videoObj.url}" type="video/mp4">
								</video>
							`)
						}else{
							const video = document.querySelector('.wt-video #wt-video');
							_CONFIG_.hls_dp = new Hls();
							_CONFIG_.hls_dp.loadSource(_CONFIG_.videoObj.url);
							_CONFIG_.hls_dp.attachMedia(video);
							_CONFIG_.hls_dp.on(Hls.Events.MANIFEST_PARSED, function() {
								video.play();
							})
						}
					}
				}
				if (!_CONFIG_.videoObj.url || _CONFIG_.videoObj.url == 1) {
					if(_CONFIG_.videoObj.type == 0){
						util.showTips({
							title: location.href +
								'</br>此帖子似乎是免费视频，请登录海角账号后使用海角自带的进行播放'
						})
					}else{
						util.showTips({
							title: location.href +
								'</br>抱歉未检测到帖子视频，请关掉其它插件再试，或苹果用Focus浏览器，安卓用Via浏览器再试'
						})
					}
				}
			})

			$('#wt-video-container div').on('click', function(e) {
				e.stopPropagation()
			})

			$('.wt-close-btn').on('click', function() {
				$('#wt-video-container').css('display', 'none');
				$('.wt-video').empty();
				if (!_CONFIG_.isMobile || _CONFIG_.isMobile[0] != 'iPhone') {
					$('.wt-video').append(`<video id="wt-video" controls></video>`);
				}
				var videos = document.querySelectorAll('video');
				videos.forEach(function(video) {
				    video.pause();
				});
				if (_CONFIG_.hls_dp){
				    _CONFIG_.hls_dp.destroy();
				}
				$("#wt-left-show").click();
			})

			vipBox.find("#wt-my-down").on("click",() => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				if(_CONFIG_.videoObj.downloadUrlSign){
					util.showDownLoadWindow();
					return;
				}
				if (_CONFIG_.videoObj.url) {
					// if(_CONFIG_.user && _CONFIG_.user.stopDownload || (_CONFIG_.user.role.use_download_num == _CONFIG_.user.role.max_download_num) ){
					// 	util.showTips({
					// 		title: '抱歉，今日下载次数' + _CONFIG_.user.role.max_download_num + '次已经用完，请明日再下载'
					// 	})
					// 	return;
					// }
					if (_CONFIG_.videoObj.type == 0 || (_CONFIG_.videoObj.url.endsWith('.m3u8') && !
							_CONFIG_.videoObj.url.includes('preview')) || _CONFIG_.videoObj
						.downloadUrl) {
						// util.showTips({
						// 	title: '为了插件的稳定现已日限下载</br>(当前账号日限' + _CONFIG_.user.role.max_download_num +'次，已使用' + _CONFIG_.user.role.use_download_num +'次，' + superVip._CONFIG_.user.downloadTips +'，每个插件每日各' + _CONFIG_.user.role.max_download_num +'次)，</br>您确定要消耗一次次数来获取视频链接吗(如失败不计数)?',
						// 	doubt: true,
						// 	success: async (confirm) => {
						// 		if (confirm) {
									
						// 		}
						// 	}
						// })
						util.showTips({
							title: '确定要获取视频下载链接吗?',
							doubt: true,
							success: async (confirm) => {
								if (confirm) {
									$('#wt-loading-box').css('display', 'block');
									await util.sleep(300);
									$.post({
										url: (superVip._CONFIG_.user.apiDomain? superVip._CONFIG_.user.apiDomain: superVip._CONFIG_.apiBaseUrl) + '/api/d' + (Math.floor(Math.random() * 2) + 1) + '00/signDownload',
										headers:{
											'luckyToken': _CONFIG_.user.token,
											'Content-Type': 'application/json'
										},
										data: JSON.stringify({
											downloadUrl: _CONFIG_.videoObj.downloadUrl ?_CONFIG_.videoObj.downloadUrl :_CONFIG_.videoObj.url,
											isDownload: _CONFIG_.videoObj.downloadUrl ? 1 : 0,
											videoType: _CONFIG_.videoObj.type,
											hjedd: _CONFIG_.hjedd ? 1 : 0,
											origin: location.origin,
											app: '海角社区',
											
										}),
										timeout: 8000,
										success: function(result) {
											$('#wt-loading-box').css('display', 'none');
											if (result.errCode != 0) {
												util.showTips({
													title: result.errMsg + '</br>' + location.href + '</br>获取下载链接失败，请稍后再试'
												});
												if(result.errMsg.includes('明日再下载')){
													_CONFIG_.user.stopDownload = true;
													_CONFIG_.user.role.use_download_num = _CONFIG_.user.role.max_download_num;
													GM_setValue('jsxl_user', _CONFIG_.user);
												}
											}else{
												if(result.newToken) _CONFIG_.user.token = result.newToken;
												_CONFIG_.user.role.use_download_num = result.useDownloadNum;
												_CONFIG_.videoObj.downloadUrlSign = result.data;
												util.showDownLoadWindow(true, result.errMsg);
												GM_setValue('jsxl_user', _CONFIG_.user);
											}
										},
										error: function(xhr, status, e) {
											$('#wt-loading-box').css('display', 'none')
											util.showTips({
												title: e.message + '</br>' + location.href + '</br>获取下载链接失败，请稍后再试'
											})
										}
									})
								}
							}
						})
						return;
					}
				}

				if (_CONFIG_.videoObj.url && _CONFIG_.videoObj.type == 0) {
					_CONFIG_.videoObj.url = location.origin + _CONFIG_.videoObj.url + (_CONFIG_.videoObj.url.includes('?') ? '&' : '?') + 'type=.m3u8';
				}
				if ((_CONFIG_.videoObj.url && _CONFIG_.videoObj.url.startsWith('http')) && !_CONFIG_.videoObj.url.includes('preview') && _CONFIG_.videoObj.url.includes('.m3u') || _CONFIG_.videoObj.downloadUrl) {
					util.showDownLoadWindow();
				} else {
					util.showTips({
						title: _CONFIG_.videoObj.url + '</br>' + location.href +
							'</br>需等待播放按钮有小绿点或暂不支持下载，请等待修复'
					})
				}
			})

			vipBox.find("#wt-hid-box").on("click", () => {
				vipBox.css("transform", "translate(125%, -50%)");
				$('#wt-left-show').css("transform", "translate(0, -50%)")
				GM_setValue('haijiao_hid_controller', 1)
			})

			$('#wt-left-show').on('click', () => {
				$('#wt-left-show').css("transform", "translate(-60px, -50%)");
				vipBox.css("transform", "translate(0, -50%)")
				GM_setValue('haijiao_hid_controller', '')
			})

			$('#wt-mask-box').on('click', () => {
				$('#wt-mask-box').css('display', 'none')
				$("#wt-set-box").removeClass('show-set-box');
				$("#wt-set-box").addClass('hid-set-box')
				$("#wt-download-box").removeClass('show-set-box');
				$("#wt-download-box").addClass('hid-set-box')
				setTimeout(() => {
					$("#wt-set-box .line-box").css('display', 'none');
					$("#wt-set-box .user-box-container").css('display', 'none')
				}, 500)
			})

			$("#wt-set-box .close").on("click", () => {
				$('#wt-mask-box').click()
			})

			vipBox.find("#wt-my-notify").on("click", () => {
				if (_CONFIG_.showNotify) {
					$('#wt-notify-box').click()
				} else {
					const notify = GM_getValue('notify', '');
					if (notify) {
						util.showNotify({
							title: notify
						})
						GM_setValue('notifyShow', false);
						util.showAndHidTips('wt_my_notify', 'none')
					} else {
						util.showNotify({
							title: '还没有通知信息'
						})
					};
				}
			})

			$("#wt-set-box .user-box .user-info .minfo").on('click', function() {
				util.showTips({
					title: '确定要跳转到插件官网吗?',
					doubt: true,
					success: (res) =>{
						if(res){
							location.href = superVip._CONFIG_.homeUrl
						}
					}
				})
			})
			
			$("#wt-set-box .user-box .user-info .switch-box").on('click', function() {
				if(_CONFIG_.titleSwitch == 1){
					$("#wt-set-box .user-box .user-info .switch-box .circular").removeClass('circularRight')
					$("#wt-set-box .user-box .user-info .switch-box .circular").addClass('circularLeft')
					$("#wt-set-box .user-box .user-info .switch-box .on").css("backgroundColor", "#b7b7b7")
					$("#wt-set-box .user-box .user-info .switch-box .on").addClass('open')
					GM_setValue('titleSwitch', -1)
					_CONFIG_.titleSwitch = -1
				}else{
					$("#wt-set-box .user-box .user-info .switch-box .circular").removeClass('circularLeft')
					$("#wt-set-box .user-box .user-info .switch-box .circular").addClass('circularRight')
					$("#wt-set-box .user-box .user-info .switch-box .on").css("backgroundColor", "#1499d5")
					$("#wt-set-box .user-box .user-info .switch-box .on").addClass('open')
					GM_setValue('titleSwitch', 1)
					_CONFIG_.titleSwitch = 1
				}
				util.showTips({
					title: '刷新页面后生效',
					icon: 'none'
				})
			})

			$('#wt-set-box .logout').on('click', function(e) {
				util.showTips({
					title: '您确定要退出登录吗?',
					doubt: true,
					success: (res) => {
						if (res) {
							util.logouted()
							$('#wt-mask-box').click()
						}
					}
				})
				e.stopPropagation()
			})

			if (!_CONFIG_.user) {
				util.addLogin()
				util.findTargetElement('#wt-my').then(res => {
					setTimeout(() => {
						res.click()
					}, 2500)
				})
			}
			
			if(GM_getValue('notifyShow')){
				util.showAndHidTips('wt_my_notify')
			}
			
			if(_CONFIG_.user.ver != md5x()){
				util.logouted();
			}
		}
	}

	return {
		start: () => {
			_CONFIG_.user = GM_getValue('jsxl_user', '');
			if(!_CONFIG_.user || !_CONFIG_.user.login_date || !superVip._CONFIG_.user.ver || !_CONFIG_.user.role){
				_CONFIG_.user = '';
				GM_setValue('jsxl_user', '');
			}
			new BaseConsumer().parse();
		},
		_CONFIG_
	}
})();

(async function() {
	if(typeof jQuery === 'undefined'){
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
		script.onerror = function(){
			alert('错误，jQuery 资源加载失败，请多次刷新页面试试，如刷新不能解决，请截图此错误给客服');
		}
		document.head.appendChild(script);
	}
	if(typeof Hls === 'undefined'){
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js';
		script.onerror = function(){
			alert('错误，Hls 资源加载失败，请多次刷新页面试试，如刷新不能解决，请截图此错误给客服');
		}
		document.head.appendChild(script);
	}
	if (location.href.includes('tools.thatwind.com')) {
		GM_addStyle(`.top-ad{display: none !important;}`)
		util.findTargetElement('.bx--text-input__field-outer-wrapper input', 10).then(res => {
			$(res).val(Date.now())
			res.dispatchEvent(new Event("input"))
		})
		return
	}
	
	const oldadd = EventTarget.prototype.addEventListener
	EventTarget.prototype.addEventListener = async function(...args) {
		if (args[0] == 'click') {
			if (this.className == 'login-btn' || this.className ==
				'el-button login-form-button el-button--primary') {
				const user = GM_getValue('haijiao_userpwd', '')
				if (user) {
					const e = new Event("input")
					util.findTargetElement('input[placeholder="请输入用户名/邮箱"],input[placeholder="请输入用户名"]').then(res => {
						$(res).val(user.username)
						res.dispatchEvent(e)
						util.findTargetElement('input[type="password"]').then(res => {
							$(res).val(user.pwd)
							res.dispatchEvent(e)
						})
					})
				}
			}
		}
		oldadd.call(this, ...args)
	}
	superVip.start();
})();