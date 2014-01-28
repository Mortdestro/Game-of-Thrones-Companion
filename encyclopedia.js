// Return the text of the node, if it's in range
function getText(parentNode, nodeName) {
	var node = parentNode.getElementsByTagName(nodeName)[0];
	if (!!node && checkRange(node))
		return node.textContent;
	else
		return "";
}

function loadFacts() {
	for (i = 0; i < facts.length; i++) {
		fact = facts[i];
		var inRange = checkRange(fact);
		if (inRange) {
			// Add fact to the list
			link = fact.getElementsByTagName('link')[0];
			if (!!link) {
				console.log(fact.childNodes[0]);
				console.log(link.getAttribute('id'));
				console.log(fact.childNodes[1]);
				console.log(fact.childNodes[2]);
			}
			jQuery("<li/>", {"class": fact}).text(fact.textContent).appendTo("#list");
		}
	}
}

// Check to make sure the audience knows it
function checkRange(fact) {
	inRange = true;
	startSeason = parseInt(fact.getAttribute("startSeason"));
	startEpisode = parseInt(fact.getAttribute("startEpisode"));
	startTime = parseInt(fact.getAttribute("startTime"));
	endSeason = parseInt(fact.getAttribute("endSeason"));
	endEpisode = parseInt(fact.getAttribute("endEpisode"));
	endTime = parseInt(fact.getAttribute("endTime"));
	
	if (!!(startSeason)) {
		// If we have a start time, see if we're after it
		if (startSeason > season) {
			inRange = false;
		} else if (startEpisode > episode) {
			inRange = false;
		} else if (startTime > time) {
			inRange = false;
		}
	}
	if (!!(endSeason)) {
		// If we have an end time, see if we're before it
		if (endSeason < season) {
			inRange = false;
		} else if (endEpisode < episode) {
			inRange = false;
		} else if (endTime <= time) {
			inRange = false;
		}
	}
	
	return inRange;
}