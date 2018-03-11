function preZeroFill(num, size) {
	if (num >= Math.pow(10, size)) {
		return num.toString();
	}
	else {
		var str = Array(size + 1).join('0') + num;
		return str.slice(str.length - size);
	}
}

function formatTimeStr(t) {
	return t.getFullYear() + '-' + preZeroFill(t.getMonth()+1, 2) + '-' + preZeroFill(t.getDate(), 2) +
		' ' + preZeroFill(t.getHours(), 2) + ':' + preZeroFill(t.getMinutes(), 2) + ':' + preZeroFill(t.getSeconds(), 2);
}

function formatTimeTZ(str, timezone) {
	var t = new Date(str + timezone);
	var tz = parseInt(new Date().getTimezoneOffset()/-60);
	if(tz >= 0) tz = '+' + tz;
	return {
		time: formatTimeStr(t),
		tz: tz,
	}
}

$(function () {
	$.ajax({
		url: "https://contests.acmicpc.info/contests.json",
		dataType: "json",
		timeout: 10000,
		cache: false,
		success: function (json) {
			json.forEach(function (contest) {
				var tbody = $('#contests-table').find('tbody');
				tbody.append('<tr></tr>');
				var tr = tbody.find('tr:last');
				tr.append('<td></td>');
				tr.find('td:last').text(contest['oj']);
				tr.append('<td class="text-left padding-md"><a target="_blank"></a></td>');
				tr.find('td:last a').text(contest['name']);
				tr.find('td:last a').attr('href', contest['link']);
				var starTime = formatTimeTZ(contest['start_time'], '+8');
				tr.append('<td><span class="start_time"></span><sup class="tz"></sup></td>');
				tr.find('td:last .start_time').text(starTime['time']);
				tr.find('td:last .tz').text('UTC' + starTime['tz']);
				tr.append('<td></td>');
				tr.find('td:last').text(contest['week']);
				var startTime = new Date(contest['start_time'].replace(/-/g, '/'));
				var nowTime = new Date();
				var secs = (startTime - nowTime) / 1000;
				if(secs <= 0) {
					tr.addClass('danger');
				}
				else if(Math.floor(secs / 3600 / 24) < 3) {
					tr.addClass('info');
				}
			});
			$('#loading').animate({opacity: 'hide'}, 0);
			$('#contests-table').animate({opacity: 'show'}, 250);
			$('#footer').animate({opacity: 'show'}, 250);
		}, error: function () {
			$('#loading').html('<p>Failed to load data</p>' +
				'<button id="refresh" type="button" class="btn btn-info">Reload</button>');
			$('#refresh').click(function () {
				window.location.reload();
			});
		}
	});
});
