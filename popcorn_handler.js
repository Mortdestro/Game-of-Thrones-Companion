/*
* Note: The pops check the time for the sake of handling skipping forward/backward.
*/

function doPops(pop, season, episode) {
	if (season == 1) {
		if (episode == 1) {
			winterIsComing(pop);
		}
	}
}

function winterIsComing(pop) {
	pop.code({
		start: 1, // 00:01
		onStart: mapObject.resetPosition
	});

	pop.code({
		start: 10, // 00:10
		onStart: function() {
			if (localStorage.time >= 10 && localStorage.time < 93) {
				return mapObject.setPosition("Castle Black");
			}
		},
		end: 92
	});

	pop.code({
		start: 93, // 01:33
		onStart: function() {
			if (localStorage.time >= 93 && localStorage.time < 446) {
				return mapObject.setPosition("The Haunted Forest");
			}
		},
		end: 445
	});

	pop.code({
		start: 446, // 07:26
		onStart: function() {
			if (localStorage.time >= 446 && localStorage.time < 469) {
				return mapObject.setPosition("King's Landing");
			}
		},
		end: 468
	});

	pop.code({
		start: 469, // 07:49
		onStart: function() {
			if (localStorage.time >= 469 && localStorage.time < 490) {
				return mapObject.setPosition("Winterfell");
			}
		},
		end: 489
	});

	pop.code({
		start: 490, // 08:10
		onStart: function() {
			if (localStorage.time >= 490 && localStorage.time < 505) {
				return mapObject.setPosition("Castle Black");
			}
		},
		end: 504
	});

	pop.code({
		start: 505, // 08:25
		onStart: function() {
			if (localStorage.time >= 505 && localStorage.time < 510) {
				return mapObject.setPosition("King's Landing");
			}
		},
		end: 509
	});

	pop.code({
		start: 510, // 08:30
		onStart: function() {
			if (localStorage.time >= 510 && localStorage.time < 537) {
				return mapObject.setPosition("Pentos");
			}
		},
		end: 536
	});

	pop.code({
		start: 537, // 08:57
		onStart: function() {
			if (localStorage.time >= 537 && localStorage.time < 1094) {
				return mapObject.setPosition("Winterfell");
			}
		},
		end: 1093
	});

	pop.code({
		start: 593, // 9:53
		onStart: function() {
			return infoBar.addLink(getCharacter("EddardStark"));
		},
		end: 1094, // 18:14
		onEnd: function() {
			return infoBar.removeLink("EddardStark");
		}
	});

	pop.code({
		start: 1,
		onStart: function() {
			return updateName("EddardStark");
		},
		end: 660,
		onEnd: function() {
			return updateName("EddardStark");
		}
	});

	pop.code({
		start: 1094, // 18:14
		onStart: function() {
			if (localStorage.time >= 1094 && localStorage.time < 1215) {
				return mapObject.setPosition("King's Landing");
			}
		},
		end: 1214
	});

	pop.code({
		start: 1215, // 20:15
		onStart: function() {
			if (localStorage.time >= 1215 && localStorage.time < 1996) {
				return mapObject.setPosition("Winterfell");
			}
		},
		end: 1995
	});

	pop.code({
		start: 1996, // 33:16
		onStart: function() {
			if (localStorage.time >= 1996 && localStorage.time < 2376) {
				return mapObject.setPosition("Pentos");
			}
		},
		end: 2375
	});

	pop.code({
		start: 2376, // 39:36
		onStart: function() {
			if (localStorage.time >= 2376 && localStorage.time < 3000) {
				return mapObject.setPosition("Winterfell");
			}
		},
		end: 2999
	});

	pop.code({
		start: 3000, // 50:00
		onStart: function() {
			if (localStorage.time >= 3000 && localStorage.time < 3438) {
				return mapObject.setPosition("Pentos");
			}
		},
		end: 3437
	});

	pop.code({
		start: 3438, // 57:18
		onStart: function() {
			if (localStorage.time >= 3438 && localStorage.time < 3631) {
				return mapObject.setPosition("Winterfell");
			}
		},
		end: 3630
	});

	pop.code({
		start: 3631, // 1:00:31
		onStart: mapObject.resetPosition
	});
}