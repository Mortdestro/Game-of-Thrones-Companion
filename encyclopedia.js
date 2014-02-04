/**
* Return the full name according to current time in show
*/
function loadCharName(datum) {
	// PREFIX //
	var prefix;
	if (datum.getElementsByTagName("prefixes").length > 0) {
		var prefixes = datum.getElementsByTagName("prefixes")[0].getElementsByTagName("prefix")
		for (i = 0; i < prefixes.length; i++) {
			if (checkRange(prefixes[i])) {
				prefix = prefixes[i].textContent;
				break;
			}
		}
	}

	// FIRST NAME //
	var firstName;
	if (datum.getElementsByTagName("first_names").length > 0) {
		var firstNames = datum.getElementsByTagName("first_names")[0].getElementsByTagName("first_name")
		for (i = 0; i < firstNames.length; i++) {
			if (checkRange(firstNames[i])) {
				firstName = firstNames[i].textContent;
				break;
			}
		}
	}

	// NICKNAME //
	var nickname;
	if (datum.getElementsByTagName("nicknames").length > 0) {
		var nicknames = datum.getElementsByTagName("nicknames")[0].getElementsByTagName("nickname")
		for (i = 0; i < nicknames.length; i++) {
			if (checkRange(nicknames[i])) {
				nickname = nicknames[i].textContent;
				break;
			}
		}
	}

	// HOUSE //
	var house;
	var houseTag = datum.getElementsByTagName("house")[0];
	if (!!houseTag && checkRange(houseTag)) {
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
* Return the house name according to current time in show
*/
function loadHouseName(datum) {
	// HOUSE //
	var houseName;
	var nameTag = datum.getElementsByTagName("house_name")[0];
	if (!!nameTag && checkRange(nameTag)) {
		houseName = nameTag.textContent;
	}
	
	name = "House";
	if (houseName)
		name += " " + houseName;
	
	return name;
}

/**
* Load relevant facts according to current time in show
*/
function loadFacts() {
	// List of most important known facts //
	
	if (subject.getElementsByTagName("facts").length > 0) {
		var facts = subject.getElementsByTagName("facts")[0].getElementsByTagName("fact");
		for (var i = 0; i < facts.length; i++) {
			var fact = facts[i];
			var inRange = checkRange(fact);
			if (inRange) {
				// If the fact is relevant, scan for any links to other pages
				var linkArray = new Array();
				var links = fact.getElementsByTagName('link');
				for (var j = 0; j < links.length; j++) {
					var link = links[j];
					var linkID = link.getAttribute('id');
					var linkType = link.getAttribute('type');
					var name = getName(getDatum(linkID, linkType));
					link = jQuery('<a/>', {"href": "encyclopedia.html?id=" + linkID + "&type=" + linkType}).text(name);
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
	}

	// Stats for quick profile //
	
	if (subject.getElementsByTagName("stats").length > 0) {
		var stats = subject.getElementsByTagName("stats")[0].childNodes;
		for (var i = 0; i < stats.length; i++) {
			var child = stats[i];
			if (child.nodeType == 1 && checkRange(child)) {
				// Add status
				var row = jQuery("<tr/>").appendTo("#statlist");
				switch(child.nodeName) {
				case "stat":
					jQuery("<td/>", {"class": "key"}).text(child.getAttribute("key")).appendTo(row);
					jQuery("<td/>").text(child.textContent).appendTo(row);
					break;
				case "statgroup":
					jQuery("<td/>", {"class": "key"}).text(child.getAttribute("key")).appendTo(row);
					var cell = jQuery("<td/>");
					var list = jQuery("<ul/>", {"class": "statgroup"}).appendTo(cell);
					var statgroup = child.getElementsByTagName("stat");
					for (var j = 0; j < statgroup.length; j++) {
						var stat = statgroup[j];
						if (checkRange(stat))
							jQuery("<li/>").text(stat.textContent).appendTo(list);
					}
					cell.appendTo(row);
					if (list.children("li").length <= 0)
						row.remove();
					break;
				default:
					break;
				}
			}
		}
	}
}