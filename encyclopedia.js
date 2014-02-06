/**
* Return the full name according to current time in show
*/
function loadCharName(datum) {
	// PREFIX //
	var prefix;
	if (datum.getElementsByTagName('prefixes').length > 0) {
		var prefixes = datum.getElementsByTagName('prefixes')[0].getElementsByTagName('prefix')
		for (i = 0; i < prefixes.length; i++) {
			if (checkRange(prefixes[i])) {
				prefix = prefixes[i].textContent;
				break;
			}
		}
	}

	// FIRST NAME //
	var firstName;
	if (datum.getElementsByTagName('first_names').length > 0) {
		var firstNames = datum.getElementsByTagName('first_names')[0].getElementsByTagName('first_name')
		for (i = 0; i < firstNames.length; i++) {
			if (checkRange(firstNames[i])) {
				firstName = firstNames[i].textContent;
				break;
			}
		}
	}

	// NICKNAME //
	var nickname;
	if (datum.getElementsByTagName('nicknames').length > 0) {
		var nicknames = datum.getElementsByTagName('nicknames')[0].getElementsByTagName('nickname')
		for (i = 0; i < nicknames.length; i++) {
			if (checkRange(nicknames[i])) {
				nickname = nicknames[i].textContent;
				break;
			}
		}
	}

	// HOUSE //
	var house;
	var houseTag = datum.getElementsByTagName('house')[0];
	if (!!houseTag && checkRange(houseTag)) {
		house = houseTag.textContent;
	}

	var name = '';
	if (prefix)
		name += prefix + ' ';
	name += firstName;
	if (nickname)
		name += ' "' + nickname + '"';
	if (house)
		name += ' ' + house;

	return name;
}

/**
* Return the house name according to current time in show
*/
function loadHouseName(datum) {
	// HOUSE //
	var houseName;
	var nameTag = datum.getElementsByTagName('house_name')[0];
	if (!!nameTag && checkRange(nameTag)) {
		houseName = nameTag.textContent;
	}

	var name = 'House';
	if (houseName)
		name += ' ' + houseName;

	return name;
}

/**
* Load relevant facts according to current time in show
*/
function loadFacts() {
	// Stats for quick profile //

	if (subject.getElementsByTagName('stats').length > 0) {
		// If there's a stats element in the XML file, iterate through its children
		var stats = subject.getElementsByTagName('stats')[0].childNodes;
		for (var i = 0; i < stats.length; i++) {
			var child = stats[i];
			// If the current child is an element, and is in range
			if (child.nodeType == 1 && checkRange(child)) {
				// Add a new row to the table
				var row = jQuery('<tr/>').appendTo('#statlist');
				// Create a data cell with the key
				jQuery('<td/>', {'class': 'key'}).text(child.getAttribute('key')).appendTo(row);
				switch(child.nodeName) {
				case 'stat':
					// If it's a normal stat, create a cell
					var cell = jQuery('<td/>').appendTo(row);
					// Find any links present
					addChildren(child, cell)
					break;
				case 'statgroup':
					// If it's a list of stats, add a cell with a list in it
					var cell = jQuery('<td/>');
					var list = jQuery('<ul/>', {'class': 'statgroup'}).appendTo(cell);
					var statgroup = child.getElementsByTagName('stat');
					for (var j = 0; j < statgroup.length; j++) {
						var stat = statgroup[j];
						if (checkRange(stat)) {
							// If it's in range, create a new item
							var item = jQuery('<li/>').appendTo(list);
							// Get the links in
							addChildren(stat, item)
						}
					}
					cell.appendTo(row);
					if (list.children('li').length <= 0)
						row.remove();
					break;
				default:
					break;
				}
			}
		}
	}

	// List of most important known facts //

	if (subject.getElementsByTagName('facts').length > 0) {
		var facts = subject.getElementsByTagName('facts')[0].getElementsByTagName('fact');
		for (var i = 0; i < facts.length; i++) {
			var fact = facts[i];
			if (checkRange(fact)) {
				// If the fact is relevant, create a list item
				var item = jQuery('<li/>', {'class': 'fact'}).appendTo('#list');
				// scan for any links to other pages
				addChildren(fact, item)
			}
		}
	}
}

/**
* Return array links for any given section
*/
function addChildren(datum, parent) {
	for (var i = 0; i < datum.childNodes.length; i++) {
		var piece;
		var node = datum.childNodes[i];
		if (node.nodeName === 'link') {
			var linkID = node.getAttribute('id');
			var linkType = node.getAttribute('type');
			var name = (node.textContent != '') ? node.textContent : getName(getDatum(linkID, linkType));
			piece = jQuery('<a/>', {'href': 'encyclopedia.html?id=' + linkID + '&type=' + linkType}).text(name);
		} else {
			piece = node.textContent;
		}
		parent.append(piece);
	}
}