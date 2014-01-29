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
	function addLink(datum) {
		if (!!(datum.getElementsByTagName("id"))) {
			// Get the id
			var datId = datum.getElementsByTagName("id")[0].textContent;
			/*/ Temporarily increase the width of the info div (fixes a bug)
			$("#info").css("width", "+=1000px");*/
			// Add a div for the link
			var linkDiv = jQuery("<div/>", {"id": datId, "class": "link"}).appendTo(parent.sliderObj);
			// Add the click functionality
			linkDiv.click(function() {
				if ($(this).parent().hasClass('noclick')) {
					// If the info is being dragged, remove the class (when mouse button is released)
					$(this).parent().removeClass('noclick');
				}
				else {
					// If it's not being dragged, pause the video
					$("#video").get(0).pause();
					// And open the window in a new page/tab, with the id passed in as a query
					newWindow = window.open("encyclopedia.html?id=" + $(this).attr('id'), "_blank");
				}
			});
			
			// Get the name 
			// TODO: Iterate through list of names
			datName = datum.getElementsByTagName("name")[0].textContent;
			
			// Create a paragraph with the character's name
			linkDiv.append(jQuery("<h4/>", {"id": datId + "_h4"})).children("h4").append(datName);
			// Create an image, use the id as the source
			var linkImg = jQuery("<img/>", {"id": datId + "_img", "class": "link_img", "src": "character_images/" + datId + "_small.jpg"}).appendTo(linkDiv);
			// Once the image is loaded
			linkImg.load(function () {
				parent.resize();
			});
		}
	}

	function removeLink(id) {
		$("#" + id).remove();
		parent.resize();
	}
}

/**
* Find a character in the XML document
*/
function getCharacter(id) {
	var characters = xmlDoc.getElementsByTagName("characters")[0].getElementsByTagName("character");
	// Note: iterates through local characters (in XML), not global array
	for (i = 0; i < characters.length; i++) {
		character = characters[i];
		charId = character.getElementsByTagName("id")[0].textContent;
		if (charId == id) {
			// console.log("Character: " + charId);
			return character;
		}
	}
}

