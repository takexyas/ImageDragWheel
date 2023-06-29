// グローバル変数

var wheelValue = 100;		// マウスホイールの値

// inframe座標とマウスポインタ座標の差分
// (inframeからのマウスポインタ座標の相対位置)
// 画像Y座標
var top_dif;
// 画像X座標
var left_dif;
// outframe座標(ブラウザからの相対位置)
var outframe_pos;

// divタグ用
var inframe;
var outframe;

// 画像の大きさ
var image_width = 400;
var image_height =300;

// 初期にセットする位置
var image_left_offset = 0;
var image_top_offset  = 0;


// マウスホイールイベント
function eventWheel(event) {
	var count;			// ホイールカウント
	var width;			// 幅
	var height;			// 高さ
	var pos;			// inframe座標

	// ホイールの数値取得
	count = wheelCount(event);
	// 正数の場合
	if ((wheelValue + count) > 0) {
		// ホイールの現在値を計算
		wheelValue += count;
		// 幅と高さ
		width  = Math.floor(image_width  * wheelValue / 100);
		height = Math.floor(image_height * wheelValue / 100);

		// 画像の拡大・縮小
		document.getElementById('img').width  = width;
		document.getElementById('img').height = height;
		document.getElementById('info').innerHTML = wheelValue + '% (' + width + ' x ' + height + ')';

		// 画像の位置を修正
		// outframe座標を取得(ブラウザからの相対位置)
		outframe_pos = getElementPos(outframe);
		// inframe座標を取得(ブラウザからの相対位置)
		var pos = getElementPos(inframe);

		// マウスポインタの位置が中心になるようにinframeの位置を調整
		// pos.x - outframe_pos.x			現在のinframe位置(outframeからの相対位置)
		// event.clientX - outframe_pos.x	現在のマウスポインタ位置(outframeからの相対位置)
		// count / 100.0					拡大(+)・縮小(-)の割合
		// Math.round(～)					マウスポインタ位置から値を調整
		inframe.style.left = ( (pos.x - outframe_pos.x) - Math.round((event.clientX - outframe_pos.x) * (count / 100.0)) ) + 'px';
		inframe.style.top  = ( (pos.y - outframe_pos.y) - Math.round((event.clientY - outframe_pos.y) * (count / 100.0)) ) + 'px';
	}

	// DOMイベントハンドリング制御（抑制）の呼出
	stopDefaultAndPropagation(event);
}

// マウスホイールカウント
function wheelCount(event) {
	// IE / Opera
	if (event.wheelDelta) {
		return event.wheelDelta / -120;
	// Firefox
	} else if (event.detail) {
		return event.detail / 3;
	}
	return 0;
}

// DOMイベントハンドリング制御（抑制）
function stopDefaultAndPropagation(event) {
	// バブリング伝搬の抑制
	// Firefox
	if(event.stopPropagation) {
		event.stopPropagation();
	// IE
	} else if(window.event) {
		window.event.cancelBubble = true;
	}

	// デフォルトイベントアクションの抑制
	// Firefox
	if(event.preventDefault) {
		event.preventDefault();
	// IE
	} else if(window.event) {
		window.event.returnValue = false;
	}
}

// ドラッグ開始処理
function dragStart(event) {
	// outframe座標を取得(ブラウザからの相対位置)
	outframe_pos = getElementPos(outframe);
	// inframe座標を取得(ブラウザからの相対位置)
	var pos = getElementPos(inframe);

	// inframe座標とマウスポインタ座標の差分
	// (inframeからのマウスポインタ座標の相対位置)
	left_dif = event.clientX - pos.x;
	top_dif = event.clientY - pos.y;

	// ドキュメント全体にイベントリスナーをセット
	addListener(document, 'mousemove', moveElement, false);
	addListener(document, 'mouseup', dragEnd, false);

	// DOMイベントハンドリング制御（抑制）の呼出
	stopDefaultAndPropagation(event);
	return false;
}

// ドラッグ終了時の処理
function dragEnd(event) {
	// デフォルトイベントアクションの抑制
	if (event.preventDefault) {
		event.preventDefault();
	}

	// イベントリスナーを外す
	removeListener(document, 'mousemove', moveElement, false);
	removeListener(document, 'mouseup', dragEnd, false);

	// DOMイベントハンドリング制御（抑制）の呼出
	stopDefaultAndPropagation(event);
	return false;
}


// ドラッグ中の処理
function moveElement(event) {
	// inframeの移動
	// event				移動後のマウスポインタ座標(ブラウザからの相対位置)
	// left_dif, top_dif	移動前inframe座標と移動前マウスポインタ座標の差分
	//						(移動前inframeからの移動前マウスポインタ座標の相対位置)
	// outframe_pos			outframe座標(ブラウザからの相対位置)
	// (event - ～_dif)		移動後のinframe座標(ブラウザからの相対位置)
	// 移動後のinframe座標を求める(outframeからの相対位置)
	inframe.style.left = ((event.clientX - left_dif) - outframe_pos.x) + 'px';
	inframe.style.top  = ((event.clientY - top_dif)  - outframe_pos.y) + 'px';

	// DOMイベントハンドリング制御（抑制）の呼出
	stopDefaultAndPropagation(event);
	return false;
}

// 要素の位置を取得
// 戻り値はX座標とY座標の入ったオブジェクト
function getElementPos(element) {
	// 座標を入れ込むオブジェクトの生成
	var obj = new Object();

	// X座標とY座標を計算
	obj.x = element.offsetLeft;
	obj.y = element.offsetTop;
	// 親オブジェクトがある間
	while(element.offsetParent) {
		// 親オブジェクトに行き計算
		element = element.offsetParent;
		obj.x += element.offsetLeft;
		obj.y += element.offsetTop;
	}
	// オブジェクトを返す
	return obj;
}

// 対象のノード情報を取得
function getTargetNode(event) {
	var targetNode;			// ノード

	// IE以外
	if(event.target) {
		targetNode = event.target;
	// IE
	} else {
		targetNode = event.srcElement;
	}

	// 戻り値
	return targetNode;
}

// DOMイベントハンドラ定義
function setListeners(event) {
	outframe = document.getElementById('outframe');
	inframe  = document.getElementById('inframe');

	// 画像タグ作成
	var img = document.createElement('img');
	// 属性の設定
	img.width = image_width;
	img.height = image_height;
	img.id = 'img';
	img.src = 'piano_cat.jpg';

	// 子ノード追加
	inframe.appendChild(img);

	// 内部のdivタグに座標を設定
	inframe.style.left = image_left_offset + 'px';
	inframe.style.top  = image_top_offset  + 'px';

	// ドラッグ開始
	addListener(inframe, 'mousedown', dragStart, false);

	// マウスホイール
	addListener(outframe, 'mousewheel', eventWheel, false);
}


// DOMイベントリスナー解除
function removeListener(element, eventType, func, capture) {
	// IE以外
	if (element.removeEventListener) {
		element.removeEventListener(eventType, func, capture);
		// マウスホイールの場合
		if (eventType == 'mousewheel') {
			// Firefox用に解除
			element.removeEventListener('DOMMouseScroll', func, capture);
		}
	// IE
	} else if (element.detachEvent) {
		element.detachEvent('on' + eventType, func);
	// 対応できないブラウザ
	} else {
		alert('Ajax未対応ブラウザです。(DOMイベントリスナー解除失敗)');
		return false;
	}
}

// DOMイベントリスナー定義
function addListener(element, eventType, func, capture) {
	// IE以外
	if (element.addEventListener) {
		element.addEventListener(eventType, func, capture);
		// マウスホイールの場合
		if (eventType == 'mousewheel') {
			// Firefox用に追加で定義
			element.addEventListener('DOMMouseScroll', func, capture);
		}
	// IE
	} else if (element.attachEvent) {
		element.attachEvent('on' + eventType, func);
	// 対応できないブラウザ
	} else {
		alert('Ajax未対応ブラウザです。(DOMイベントリスナー定義失敗)');
		return false;
	}
}

// HTMLロード後にイベントリスナー登録
addListener(window, 'load', setListeners, false);
