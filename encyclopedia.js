/**
* Return the full name according to current time in show
*/
function loadName(datum) {
	// PREFIX //
	var prefix;
	var prefixes = datum.getElementsByTagName("prefixes")[0].getElementsByTagName("prefix")
	for (i = 0; i < prefixes.length; i++) {
		if (checkRange(prefixes[i])) {
			prefix = prefixes[i].textContent;
			break;
		}
	}

	// FIRST NAME //
	var firstName;
	var firstNames = datum.getElementsByTagName("first_names")[0].getElementsByTagName("first_name")
	for (i = 0; i < firstNames.length; i++) {
		if (checkRange(firstNames[i])) {
			firstName = firstNames[i].textContent;
			break;
		}
	}

	// NICKNAME //
	var nickname;
	var nicknames = datum.getElementsByTagName("nicknames")[0].getElementsByTagName("nickname")
	for (i = 0; i < nicknames.length; i++) {
		if (checkRange(nicknames[i])) {
			nickname = nicknames[i].textContent;
			break;
		}
	}

	// HOUSE //
	var house;
	var houseTag = datum.getElementsByTagName("house")[0];
	if (checkRange(houseTag)) {
		house = houseTag.textContent;
	}

	var name = "";
	if (prefix)
		name += prefix + " ";
	name += firstName;
	if (nickname)
		name += " \"" + nickname + "\"";
	if (house)
		name += " " + house;

	return name;
}

/**
* Load relevant facts according to current time in show
*/
function loadFacts() {
	// Iterate through the facts listed in the XML file
	var facts = character.getElementsByTagName("facts")[0].getElementsByTagName("fact");
	for (var i = 0; i < facts.length; i++) {
		var fact = facts[i];
		var inRange = checkRange(fact);
		if (inRange) {
			// If the fact is relevant, scan for any links to other pages
			var linkArray = new Array();
			var links = fact.getElementsByTagName('link');
			for (var j = 0; j < links.length; j++) {
				var link = links[j];
				var name = getName(getCharacter(link.getAttribute('id')));
				link = jQuery('<a/>', {"href": "encyclopedia.html?id=" + link.getAttribute('id')}).text(name);
				linkArray.push(link);
			}
			var list = jQuery("<li/>", {"class": "fact"});
			var j;
			for (j = 0; j < linkArray.length; j++) {
				list.append(fact.childNodes[j]).append(linkArray[j]);
			}
			list.append(fact.childNodes[j]);
			list.appendTo("#list");
		}
	}

	var stats = character.getElementsByTagName("stats")[0].getElementsByTagName("stat");
	for (var i = 0; i < stats.length; i++) {
		var stat = stats[i];
		if (checkRange(stat)) {
			// Add status
			var row = jQuery("<tr/>").appendTo("#statlist");
			jQuery("<td/>", {"class": "key"}).text(stat.getAttribute("key")).appendTo(row);
			jQuery("<td/>").text(stat.textContent).appendTo(row);
		}
	}
}