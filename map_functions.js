var mapObject;

function mapInit() {
	var map_img = $("#map_img");
	var docWidth = $(document).outerWidth();
	var initZoom = .59;
	// var initCoords = {x: 758, y: 4261};
	var initCoords = {x: 1000, y: 1000};
	// Create the map
	mapObject = new map(map_img, null, initCoords, initZoom, docWidth * .45, 4642, 4642);
}

// Get the coordinates of important locations by name
function getPosition(name) {
	var coordinates;
	if (name == "Winterfell") {
		coordinates = {x: 728, y: 1170};
	} else if (name == "King's Landing") {
		coordinates = {x: 954, y: 2303};
	} else if (name == "Pentos") {
		coordinates = {x: 1557, y: 2270};
	} else if (name == "The Haunted Forest") {
		coordinates = {x: 990, y: 692};
	} else if (name == "Castle Black") {
		coordinates = {x: 943, y: 755};
	}
	return coordinates;
}

// Move the map to the coordinates of the show's current location
function currentLocation() {
	if (!!mapObject) {
		if (!!mapObject.plotCoords) {
			mapObject.setPosition(mapObject.plotCoords);
		} else {
			mapObject.resetPosition();
		}
	}
}

function map(map_img, plotCoords, initCoords, initZoom, windowWidth, mapWidth, mapHeight) {
	this.map_img = map_img;
	this.plotCoords = plotCoords;
	this.currCoords = {x: initCoords.x, y: initCoords.y};
	this.initCoords = {x: initCoords.x, y: initCoords.y};
	this.currZoom = this.initZoom = initZoom;
	this.mapWidth = mapWidth;
	this.mapHeight = mapHeight;
	this.dragging = 0;
	var parent = this;

	this.resize = resize;
	this.setPosition = setPosition;
	this.resetPosition = resetPosition;
	this.setZoom = setZoom;
	this.zoom = zoom;
	this.resetContainment = resetContainment;
	
	// Set the draggability of the map
	this.map_img.draggable({
		addClasses: true,
		start: startDrag,
		stop: endDrag,
		containment: [
			this.windowLeft - (this.mapWidth * this.currZoom) + this.windowWidth,
			this.windowTop - (this.mapHeight * this.currZoom) + this.windowHeight,
			this.windowLeft,
			this.windowTop
		]
	});

	this.resize(windowWidth);

	// Adjust properties for when the window is resized
	function resize(windowWidth) {
		// Set map window width
		$("#map").css('width', windowWidth + 'px');

		// Store map window information
		this.windowLeft = $("#map").offset().left;
		this.windowTop = $("#map").offset().top;
		this.windowWidth = $("#map").outerWidth();
		this.windowHeight = $("#map").outerHeight();

		// Adjust the actual map
		this.map_img.css('left', (this.currCoords.x * this.currZoom - this.windowWidth / 2) * -1 + 'px');
		this.map_img.css('top', (this.currCoords.y * this.currZoom - this.windowHeight / 2) * -1 + 'px');
		
		// Readjust for borders
		if (parseInt(parent.map_img.css('left')) > 0) // left
			parent.map_img.css('left', "0px");
		if (parseInt(parent.map_img.css('top')) > 0) // top
			parent.map_img.css('top', "0px");
		if (parseInt(parent.map_img.css('left')) < -1 * parent.mapWidth * parent.currZoom + parent.windowWidth) // right
			parent.map_img.css('left', -1 * parent.mapWidth * parent.currZoom + parent.windowWidth + "px");
		if (parseInt(parent.map_img.css('top')) < -1 * parent.mapHeight * parent.currZoom + parent.windowHeight) // down
			parent.map_img.css('top', -1 * parent.mapHeight * parent.currZoom + parent.windowHeight + "px");

		parent.resetContainment();
	}
	
	//Set zooming function
	this.map_img.mousewheel(this.zoom);

	function startDrag(){
		// Track when we drag
		parent.dragging = 1;
	}

	function endDrag(){
		// Update currCoords with the new coordinates
		parent.currCoords.x = (parseInt(parent.map_img.css('left')) * -1 + parent.windowWidth / 2) / parent.currZoom;
		parent.currCoords.y = (parseInt(parent.map_img.css('top')) * -1 + parent.windowHeight / 2) / parent.currZoom;
		console.log("Current coordinates: (" + parent.currCoords.x + ", " + parent.currCoords.y + ")");
		parent.dragging = 0;
	}

	// Draw a cross (to visualize center)
	function drawCross() {
		// TODO: Fill in functionality
	}

	// Set position by coordinates or by location name
	function setPosition(coords) {
		if (!dragging) {
			currZoom = 1;
			if (!coords.x) {
				coords = getPosition(coords);
			}
			$('#map_img').animate({left: (coords.x - parent.windowWidth / 2) * -1 + 'px', top: (coords.y - parent.windowHeight / 2) * -1 + 'px', height: parent.mapHeight + 'px', width: parent.mapWidth + 'px'}, 1000);
			parent.currCoords.x = coords.x;
			parent.currCoords.y = coords.y;
			//$("#map_img").draggable("option", "containment", [parent.windowLeft - 4642 + parent.windowWidth, parent.windowTop - 4642 + parent.windowHeight, parent.windowLeft, parent.windowTop]);
			parent.resetContainment();
		}
		plotCoords = coords;
	}

	// Reset position to credits
	function resetPosition() {
		if (!parent.dragging) {
			$('#map_img').animate({
				left: (parent.initCoords.x * parent.initZoom - parent.windowWidth / 2) * -1 + 'px',
				top: (parent.initCoords.y * parent.initZoom - parent.windowHeight / 2) * -1 + 'px',
				height: parent.mapHeight * parent.initZoom + 'px',
				width: parent.mapWidth * parent.initZoom + 'px'
			}, 1000);
			parent.currZoom = parent.initZoom;
			parent.currCoords.x = parent.initCoords.x;
			parent.currCoords.y = parent.initCoords.y;
			parent.resetContainment();
		}
		parent.plotCoords = null;
	}

	// Set the zoom to any given zoom level
	function setZoom(zoom){
		parent.map_img.css('width', parent.mapHeight * zoom);
		parent.map_img.css('height', parent.mapHeight * zoom);
/* 		$("#map_img").draggable("option", "containment", [
			parent.windowLeft - parent.mapHeight * zoom + parent.windowWidth,
			parent.windowTop - parent.mapHeight * zoom + parent.windowHeight,
			parent.windowLeft,
			parent.windowTop
		]); */
		parent.currZoom = zoom;
		parent.resetContainment();
	}

	// Handle zoom stuff
	function zoom(e) {
		e.preventDefault();

		// Determine up or down
		var delta = 0;
		var down = false;
		if (event.wheelDelta) {
			delta = event.wheelDelta / 120; 
		} else if (event.detail) {
			delta = -event.detail / 3;
		}
		if (delta < 0) {
			down = true;
		}

		var MIN_ZOOM = .11;
		var MAX_ZOOM = 1.88;

		// Actually zoom
		if (down && parent.currZoom - .02 >= MIN_ZOOM) {
			parent.setZoom(parent.currZoom - .02);
		} else if (!down && parent.currZoom + .02 <= MAX_ZOOM){
			parent.setZoom(parent.currZoom + .02);
		}
		// Keep centered
		parent.map_img.css('left', (parent.currCoords.x * parent.currZoom - parent.windowWidth / 2) * -1 + 'px');
		parent.map_img.css('top', (parent.currCoords.y * parent.currZoom - parent.windowHeight / 2) * -1 + 'px');

		// Unless we're at the border
		if (parseInt(parent.map_img.css('left')) > 0) // left
			parent.map_img.css('left', "0px");
		if (parseInt(parent.map_img.css('top')) > 0) // top
			parent.map_img.css('top', "0px");
		if (parseInt(parent.map_img.css('left')) < -1 * parent.mapWidth * parent.currZoom + parent.windowWidth) // right
			parent.map_img.css('left', -1 * parent.mapWidth * parent.currZoom + parent.windowWidth + "px");
		if (parseInt(parent.map_img.css('top')) < -1 * parent.mapHeight * parent.currZoom + parent.windowHeight) // bottom
			parent.map_img.css('top', -1 * parent.mapHeight * parent.currZoom + parent.windowHeight + "px");
	}
	
	// Set containment based on current variables (call when adjusting)
	function resetContainment() {
		if (parent.mapWidth * parent.currZoom > parent.windowWidth) {
			// if the map is wider than the map window
			if (parent.mapHeight * parent.currZoom > parent.windowHeight) {
				// and the map is taller than the map window
				parent.map_img.draggable("option", "containment", [
					parent.windowLeft - parent.mapHeight * parent.currZoom + parent.windowWidth, // left
					parent.windowTop - parent.mapHeight * parent.currZoom + parent.windowHeight, // top
					parent.windowLeft, // right
					parent.windowTop // bottom
				]);
			} else {
				// or else if the map window is at least as tall as the map
				parent.map_img.draggable("option", "containment", [
					parent.windowLeft - parent.mapHeight * parent.currZoom + parent.windowWidth, // left
					parent.windowTop, // top
					parent.windowLeft, // right
					parent.windowTop + (parent.windowHeight - parent.mapHeight * parent.currZoom) // bottom
				]);
			}
		} else {
			// or else if the map window is at least as wide as the map
			if (parent.mapHeight * parent.currZoom > parent.windowHeight) {
				// and the map is taller than the map window
				parent.map_img.draggable("option", "containment", [
					parent.windowLeft,  // left
					parent.windowTop - parent.mapHeight * parent.currZoom + parent.windowHeight, // top
					parent.windowLeft + (parent.windowWidth - parent.mapWidth * parent.currZoom), // right
					parent.windowTop // bottom
				]);
			} else {
				// or else if the map window is at least as tall as the map
				parent.map_img.draggable("option", "containment", [
					parent.windowLeft,  // left
					parent.windowTop, // top
					parent.windowLeft + (parent.windowWidth - parent.mapWidth * parent.currZoom), // right
					parent.windowTop + (parent.windowHeight - parent.mapHeight * parent.currZoom) // bottom
				]);
			}
		}
	}
}