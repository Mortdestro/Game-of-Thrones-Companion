var characters = new Array();
var infoTop;
var infoLeft;
var infoWidth;
var wrapperWidth;

// Layout the info bar at the bottom
function infoInit() {
	// Top of wrapper plus 28 pixels (for label)
	infoTop = $("#info-wrapper").offset().top + 28;
	infoLeft = $("#info-wrapper").offset().left;
	wrapperWidth = $("#info-wrapper").outerWidth();
	infoWidth = 0;
	i = 1;
	$("#info").children(".character").each(function () {
		infoWidth += parseInt($(this).outerWidth(true));
		console.log(i + ": " + $(this).outerWidth(true));
		i++;
	});
	if (infoWidth < 0) {
		infoWidth = 0;
	}
	$("#info").css("width", infoWidth + "px");
	leftMost = wrapperWidth - infoWidth < 0 ? infoLeft - infoWidth + wrapperWidth : infoLeft;
	rightMost = wrapperWidth - infoWidth < 0 ? infoLeft : infoLeft - infoWidth + wrapperWidth;
	$("#info").draggable({addClasses: true, start: function(event, ui) {
        $(this).addClass('noclick');
    }, containment: [leftMost, infoTop, rightMost, infoTop]});
}

// Find a character in the XML document
function getCharacter(id) {
	var characters = xmlDoc.getElementsByTagName("characters")[0].getElementsByTagName("character");
	// Note: iterates through local characters (in XML), not global array
	for (i = 0; i < characters.length; i++) {
		character = characters[i];
		charId = character.getElementsByTagName("id")[0].textContent;
		if (charId == id) {
			console.log("Character: " + charId);
			return character;
		}
	}
}

// Add a character onto the info list at the bottom
function addCharacter(character) {
	if (!!(character.getElementsByTagName("id"))) {
		// If the character has an id (is in the XML correctly)
		// Add the character to the array
		index = characters.push(character) - 1;
		// Get the id
		charId = character.getElementsByTagName("id")[0].textContent;
		// Temporarily increase the width of the info div (fixes a bug)
		$("#info").css("width", "+=1000px");
		// Add a div for the character
		var charDiv = jQuery("<div/>", {"id": charId, "class": "character"}).appendTo("#info");
		// Add the click functionality
		charDiv.click(function() {
			if ($(this).parent().hasClass('noclick')) {
				// If the info is being dragged, remove the class (when mouse button is released)
				$(this).parent().removeClass('noclick');
			}
			else {
				// If it's not being dragged, pause the video
				$("#video").get(0).pause();
				// And open the window in a new page/tab, with the id passed in as a query
				newWindow = window.open("character_page.html?id=" + $(this).attr('id'), "_blank");
			}
		});
		
		// Get the name TODO: Iterate through list of names //
		charName = character.getElementsByTagName("name")[0].textContent;
		
		// Create a paragraph with the character's name
		charDiv.append(jQuery("<p/>", {"id": charId + "_p"})).children("p").append(charName);
		var imgHeight;
		if ($("#info").height() > 90) {
			imgHeight = "calc(100% - " + $("#" + charId + "_p").height() + "px)";
		} else {
			imgHeight = "100%";
		}
		console.log(imgHeight);
		// Create an image, use the id as the source
		var charImg = jQuery("<img/>", {"id": charId + "_img", "class": "char_img", "src": "character_images/" + charId + "_small.jpg"}).appendTo(charDiv);
		charImg.css("height", imgHeight);
		// Once the image is loaded
		charImg.load(function () {
			// Add the width of the character div to the info div
			$("#info").css("width", "+=" + charDiv.outerWidth(true) + "px");
			// Take off the 1000 extra pixels
			$("#info").css("width", "-=1000px");
			// Store the new width
			infoWidth = parseInt($("#info").css("width"));
			// Determine the new bounds of info bar dragging
			leftMost = wrapperWidth - infoWidth < 0 ? infoLeft - infoWidth + wrapperWidth : infoLeft;
			rightMost = wrapperWidth - infoWidth < 0 ? infoLeft : infoLeft - infoWidth + wrapperWidth;
			// Set the new drag containment
			$("#info").draggable("option", "containment", [leftMost, infoTop, rightMost, infoTop]);
		});
	}
}

function removeCharacter(id) {
	$("#" + id).remove();
}