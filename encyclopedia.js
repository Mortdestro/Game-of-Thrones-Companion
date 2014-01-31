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
			link = fact.getElementsByTagName('link')[0];
			if (!!link) {
				console.log(fact.childNodes[0]);
				console.log(link.getAttribute('id'));
				console.log(fact.childNodes[1]);
				console.log(fact.childNodes[2]);
			}
			// Add fact to the list
			jQuery("<li/>", {"class": fact}).text(fact.textContent).appendTo("#list");
		}
	}
}