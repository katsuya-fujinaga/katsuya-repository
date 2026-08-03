function CountdownTimer(elemClass, timeLimit, limitMessage, msgClass) {
	this.initialize.apply(this, arguments);
}

CountdownTimer.prototype = {

	/**
	 * Constructor
	 */
	initialize: function (elemClass, timeLimit, limitMessage, msgClass) {
		this.elem = $("." + elemClass);
		this.timeLimit = timeLimit;
		this.limitMessage = limitMessage;
		this.msgClass = msgClass;
	},

	/**
	 * カウントダウン
	 */
	countDown: function (limitMessage) {
		var timer;
		var limitMessage;
		var today = new Date()
		var days = Math.floor((this.timeLimit - today) / (24 * 60 * 60 * 1000));
		var hours = Math.floor(((this.timeLimit - today) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
		var mins = Math.floor(((this.timeLimit - today) % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60;
		var secs = Math.floor(((this.timeLimit - today) % (24 * 60 * 60 * 1000)) / 1000) % 60 % 60;
		var milis = Math.floor(((this.timeLimit - today) % (24 * 60 * 60 * 1000)) / 10) % 100;
		var me = this;

		if ((this.timeLimit - today) > 0) {
			timer = '公開終了まで <br class="tbunder">' + days + '<span class="unit">日</span>' + this.addZero(hours) + '<span class="unit">時間</span>' + this.addZero(mins) + '<span class="unit">分</span>' + this.addZero(secs) + '<span class="unit">秒</span>'/* + this.addZero(milis)*/
			//this.elem.innerHTML = timer;

			$(this.elem).html(timer);

			tid = setTimeout(function () { me.countDown(); }, 10);

		} else {
//			location.href = "";
			
			$(this.elem).html(limitMessage);
			if (this.msgClass) {
				this.elem.setAttribute('class', this.msgClass);
			}
			return;
		}
	},

	/**
	 * ゼロを付与
	 */
	addZero: function (num) {
		num = '00' + num;
		str = num.substring(num.length - 2, num.length);

		return str;
	}
}

function cdTimer1() {
	// 設定項目 ここから---------------------------------------------
	// タグ要素のID名
	var elemClass = 'sampleA';

	// 期限日を設定
	var year = 2023;			// 年
	var month = 7;				// 月
	var day = 2;				// 日

	// 期限終了後のメッセージ
	var limitMessage = '無料登録期間は終了しました';

	// メッセージのスタイルクラス名（変更しない場合は空欄）
	var msgClass = 'msg_1';
	// 設定項目 ここまで---------------------------------------------


	var timeLimit = new Date(year, month - 1, day);
	var timer = new CountdownTimer(elemClass, timeLimit, limitMessage, msgClass);
	timer.countDown(limitMessage);
}
