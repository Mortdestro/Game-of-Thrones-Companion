/**
* Layout the info bar at the bottom
*/
function infoInit() {
	wrapper = $("#info-wrapper");
	slider = $("#info");
	infoBar = new InfoBar(wrapper, slider);
}

function InfoBar(wrapperObj, sliderObj) {	
	// Variables for later abstraction
	this.width;
	this.height;
	this.horizontal = true;

	this.wrapperObj = wrapperObj;
	this.sliderObj = sliderObj;
	var parent = this;

	this.addLink = addLink;
	this.removeLink = removeLink;
	this.resize = resize;
	this.getLinkById = getLinkById;

	this.resize();

	function resize() {
		// TODO: change 28 to a variable
		var sliderTop = parent.wrapperObj.offset().top + 28;
		var sliderLeft = parent.wrapperObj.offset().left;
		var wrapperWidth = parent.wrapperObj.outerWidth();
		var sliderWidth = 0;

		// Adjust width of each link
		parent.sliderObj.children(".link").each(function () {
			var datId = $(this).attr("id");
			var h4 = $("#" + datId + "_h4");
			var img = $("#" + datId + "_img");

			var imgHeight;
			var linkWidth;
			if (parent.sliderObj.height() > 90) {
				imgHeight = "calc(100% - " + h4.height() + "px)";
				linkWidth = Math.max(h4.outerWidth(true), img.outerWidth(true));
			} else {
				imgHeight = "100%";
				linkWidth = h4.outerWidth(true) + img.outerWidth(true);
			}

			img.css("height", imgHeight);
			$(this).css("width", linkWidth + "px");
		});
		i = 1;
		parent.sliderObj.children(".link").each(function () {
			sliderWidth += parseInt($(this).outerWidth(true));
			// console.log(i + ": " + $(this).outerWidth(true));
			i++;
		});
		// console.log("sliderWidth: " + sliderWidth);
		if (sliderWidth < 0) {
			sliderWidth = 0;
		}

		parent.sliderObj.css("width", sliderWidth + "px");
		var leftmost = wrapperWidth - sliderWidth < 0 ? sliderLeft - sliderWidth + wrapperWidth : sliderLeft;
		var rightmost = wrapperWidth - sliderWidth < 0 ? sliderLeft : sliderLeft - sliderWidth + wrapperWidth;
		$("#info").draggable({addClasses: true, start: function(event, ui) {
			$(this).addClass('noclick');
		}, containment: [leftmost, sliderTop, rightmost, sliderTop]});
	}

	/**
	* Add a link onto the info list at the bottom
	* param datum: XML Object pointing to a particular datum
	*/
	function addLink(datum, type) {
		if (!!(datum.getElementsByTagName("id"))) {
			// Get the id
			var datId = datum.getElementsByTagName("id")[0].textContent;
			/*/ Temporarily increase the width of the info div (fixes a bug)
			$("#info").css("width", "+=1000px");*/
			// Add a div for the link
			var linkDiv = jQuery("<div/>", {"id": datId, "class": "link"}).appendTo(parent.sliderObj);
			// Add click functionality
			linkDiv.click(function() {
				if ($(this).parent().hasClass('noclick')) {
					// If the info is being dragged, remove the class (when mouse button is released)
					$(this).parent().removeClass('noclick');
				}
				else {
					// If it's not being dragged, pause the video
					$("#video").get(0).pause();
					// And open the window in a new page/tab, with the id passed in as a query
					newWindow = window.open("encyclopedia.html?id=" + $(this).attr('id') + "&type=" + type, "_blank");
				}
			});

			// Add hover functionality
			linkDiv.hover(function(e) {
				// Style and add
				var linkWidth = parseInt($(this).outerWidth());
				var linkHeight = parseInt($(this).outerWidth());
				var box = jQuery('<div/>', {'id': 'hover-' + $(this).attr('id'), 'class': 'hover-box'});
				box.appendTo($(this));
				box.css('left', (linkWidth + 10) + 'px');
				box.css('top',  '15%');

				// Fill information in
				var list = jQuery('<ul/>', {'class': 'hover-list'}).appendTo(box);
				var items = getDatum($(this).attr('id'), type).getElementsByTagName('hover_items')[0].getElementsByTagName('item');
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (checkRange(item)) {
						jQuery('<li/>').text(item.textContent.trim()).appendTo(list);
					}
				}
			}, function() {
				$(this).children('.hover-box')[0].remove();
			});

			var datName = getName(datum);

			// Create a paragraph with the character's name
			linkDiv.append(jQuery("<h4/>", {"id": datId + "_h4"})).children("h4").append(datName);
			// Create an image, use the id as the source
			var linkImg = jQuery("<img/>", {"id": datId + "_img", "class": "link_img", "src": "images/" + type + "_images/" + datId + "_small.jpg"}).appendTo(linkDiv);
			// Once the image is loaded
			linkImg.load(function () {
				parent.resize();
			});
		}
	}

	/**
	* Return the link for the given ID
	*/
	function getLinkById(id) {
		return parent.sliderObj.children("#" + id);
	}

	function removeLink(id) {
		$("#" + id).remove();
		parent.resize();
	}
}

/**
* Find a datum in an XML document
*/
function getDatum(id, type) {
	var data = xmlDoc.getElementsByTagName(type + "s")[0].getElementsByTagName(type);
	// Note: iterates through local data (in XML), not global array
	for (var i = 0; i < data.length; i++) {
		var datum = data[i];
		var datId = datum.getElementsByTagName("id")[0].textContent;
		if (datId == id) {
			return datum;
		}
	}
}

/**
* Get the display name for a particular piece of data
*/
function getName(datum) {
	var names = datum.getElementsByTagName("names")[0].getElementsByTagName("name");
	var datName;
	for (var i = 0; i < names.length; i++) {
		var name = names[i];
		if (checkRange(name)) {
			return name.textContent.trim();
		}
	}
}

/**
* Update the name of a CLF
*/
function updateName(id, type) {
	var datum = getDatum(id, type);
	var name = getName(datum);
	var link = infoBar.getLinkById(id).children("h4")[0];
	if (!!link && !(link.textContent === name)) {
		link.textContent = name;
	}
}

/**
* Check to make sure the audience knows a piece of information
*/
function checkRange(fact) {
	inRange = true;
	season = parseInt(localStorage.season);
	episode = parseInt(localStorage.episode);
	time = parseInt(localStorage.time);

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