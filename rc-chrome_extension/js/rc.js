// Copyright (c) 2016 bLue
// Github: dreamerblue

$(document).ready(function() {
	$.ajax({
		url: "https://contests.acmicpc.info/contests.json",
		dataType: "json",
		timeout: 5000,
		cache: false,
		success: function (res) {
			$("#loading").animate({opacity: "hide"}, 0);
			var tr = $('<tr></tr>');
			tr.appendTo($("thead"));
			$('<th>OJ</th>').appendTo(tr);
			$('<th class="text-left">&nbsp;&nbsp;Name</th>').appendTo(tr);
			$('<th>Start Time</th>').appendTo(tr);
			// $('<th>Week</th>').appendTo(tr);
			$('<th>Access</th>').appendTo(tr);
			for(var i=0, len=res.length; i<len; ++i) {
				var tr = $('<tr></tr>');
				tr.appendTo($("tbody"));
				$('<td>' + res[i].oj + '</td>').appendTo(tr);
				$('<td class="text-left">&nbsp;&nbsp;<a href="' + res[i].link + '" target="_blank">' + res[i].name + '</a></td>').appendTo(tr);
				$('<td>' + res[i].start_time + '</td>').appendTo(tr);
				// $('<td>' + res[i].week + '</td>').appendTo(tr);
				$('<td>' + res[i].access + '</td>').appendTo(tr);
				var start_time = new Date(res[i].start_time.replace(/-/g,"/"));
				var now_time = new Date();
				var secs = (start_time-now_time)/1000;
				if(secs <= 0)
					tr.addClass("danger");
				else if(Math.floor(secs/3600/24) < 3)
					tr.addClass("info");
			}
			$("#table").animate({opacity: "show"}, 250);
			$("#footer").animate({opacity: "show"}, 250);
		}, error: function () {
			$("#loading").html('<p><strong>Failed to load data</strong></p><button id="refresh" type="button" class="btn btn-info">Reload</button>');
			$("#refresh").click(function(){
				window.location.reload();
			});
		}
	});
});