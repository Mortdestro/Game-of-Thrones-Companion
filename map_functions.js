var mapObject;

function mapInit() {
	var map_img = $("#map_img");
	var window = $("#map");
	var docWidth = $(document).outerWidth();
	var docHeight = $(document).outerHeight();
	var initZoom = .59;
	var initCoords = {x: 758, y: 4261};
	// Create the map
	mapObject = new Map(map_img, window, null, initCoords, initZoom, docWidth * .45, docHeight * .64, 4642, 4642);
}

/**
* Get the coordinates of important locations by name
*/
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

/**
* Move the map to the coordinates of the show's current location
*/
function currentLocation() {
	if (!!mapObject) {
		if (!!mapObject.plotCoords) {
			mapObject.setPosition(mapObject.plotCoords);
		} else {
			mapObject.resetPosition();
		}
	}
}

/**
* A draggable, zoomable map
* 
* param map_img: A jQuery object pointing to a map image to be dragged
* param window: A jQuery object pointing to a "window" to the map
*/
function Map(map_img, window, plotCoords, initCoords, initZoom, windowWidth, windowHeight, mapWidth, mapHeight) {

	// Variables
	this.map_img = map_img;
	this.window = window;
	this.plotCoords = plotCoords;
	this.currCoords = {x: initCoords.x, y: initCoords.y};
	this.initCoords = {x: initCoords.x, y: initCoords.y};
	this.currZoom = this.initZoom = initZoom;
	this.mapWidth = mapWidth;
	this.mapHeight = mapHeight;
	this.windowWidth = windowWidth;
	this.windowHeight = windowHeight;
	this.dragging = 0;
	var parent = this;

	// Functions
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
		stop: endDrag
	});

	this.resize(this.windowWidth, this.windowHeight);
	this.setZoom(this.currZoom);

	/**
	* Adjust properties for when the window is resized
	*/
	function resize(newWidth, newHeight) {
		// Set map window width
		parent.windowWidth = newWidth;
		parent.window.css('width', parent.windowWidth + 'px');
		parent.windowHeight = newHeight;
		parent.window.css('height', parent.windowHeight + 'px');

		// Store map window information
		parent.windowLeft = parent.window.offset().left;
		parent.windowTop = parent.window.offset().top;
		parent.windowWidth = parent.window.outerWidth();
		parent.windowHeight = parent.window.outerHeight();

		// Adjust the actual map
		parent.map_img.css('left', (parent.currCoords.x * parent.currZoom - parent.windowWidth / 2) * -1 + 'px');
		parent.map_img.css('top', (parent.currCoords.y * parent.currZoom - parent.windowHeight / 2) * -1 + 'px');

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
		// console.log("Current coordinates: (" + parent.currCoords.x + ", " + parent.currCoords.y + ")");
		parent.dragging = 0;
	}

	// Draw a cross (to visualize center)
	function drawCross() {
		// TODO: Fill in functionality
	}

	/**
	* Set position by coordinates or by location name
	*/
	function setPosition(coords) {
		if (!coords.x) {
			coords = getPosition(coords);
		}
		if (!parent.dragging) {
			// Readjust for borders //
			// New variable to actually move to; other kept in case of readjustment
			var practCoords = coords;
			if (practCoords.x < 0) // left
				practCoords.x = 0;
			if (practCoords.y < 0) // top
				practCoords.y = 0;
			if (practCoords.x > parent.mapWidth - parent.windowWidth / 2 / parent.currZoom) // right
				practCoords.x = parent.mapWidth - parent.windowWidth / 2 / parent.currZoom;
			if (practCoords.y > parent.mapHeight - parent.windowHeight / 2 / parent.currZoom) // down
				practCoords.y = parent.mapHeight - parent.windowHeight / 2 / parent.currZoom;


			parent.currZoom = 1;
			$('#map_img').animate({left: (coords.x - parent.windowWidth / 2) * -1 + 'px', top: (coords.y - parent.windowHeight / 2) * -1 + 'px', height: parent.mapHeight + 'px', width: parent.mapWidth + 'px'}, 1000);
			parent.currCoords.x = coords.x;
			parent.currCoords.y = coords.y;
		}
		parent.plotCoords = coords;
	}

	/**
	* Reset position to credits
	*/
	function resetPosition() {
		if (!parent.dragging) {
			// Readjust for borders //
			// New variable to actually move to; other kept in case of readjustment
			var practCoords = parent.initCoords;
			if (practCoords.x < 0) // left
				practCoords.x = 0;
			if (practCoords.y < 0) // top
				practCoords.y = 0;
			if (practCoords.x > parent.mapWidth - parent.windowWidth / 2 / parent.currZoom) // right
				practCoords.x = parent.mapWidth - parent.windowWidth / 2 / parent.currZoom;
			if (practCoords.y > parent.mapHeight - parent.windowHeight / 2 / parent.currZoom) // down
				practCoords.y = parent.mapHeight - parent.windowHeight / 2 / parent.currZoom;
			
			$('#map_img').animate({
				left: (practCoords.x * parent.initZoom - parent.windowWidth / 2) * -1 + 'px',
				top: (practCoords.y * parent.initZoom - parent.windowHeight / 2) * -1 + 'px',
				height: parent.mapHeight * parent.initZoom + 'px',
				width: parent.mapWidth * parent.initZoom + 'px'
			}, 1000);
			parent.currZoom = parent.initZoom;
			parent.currCoords.x = parent.initCoords.x;
			parent.currCoords.y = parent.initCoords.y;
		}
		parent.plotCoords = null;
	}

	/**
	* Set the zoom to any given zoom level
	*/
	function setZoom(zoom){
		parent.map_img.css('width', parent.mapHeight * zoom);
		parent.map_img.css('height', parent.mapHeight * zoom);
		parent.currZoom = zoom;
		parent.resetContainment();
	}

	/**
	* Handle zoom event
	*/
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

		
		// Unless it's at the border
		if (parseInt(parent.map_img.css('left')) > 0) // left
			parent.map_img.css('left', "0px");
		if (parseInt(parent.map_img.css('left')) < -1 * parent.mapWidth * parent.currZoom + parent.windowWidth) // right
			parent.map_img.css('left', -1 * parent.mapWidth * parent.currZoom + parent.windowWidth + "px");

		if (parseInt(parent.map_img.css('top')) > 0) // top
			parent.map_img.css('top', "0px");
		if (parseInt(parent.map_img.css('top')) < -1 * parent.mapHeight * parent.currZoom + parent.windowHeight) // bottom
			parent.map_img.css('top', -1 * parent.mapHeight * parent.currZoom + parent.windowHeight + "px");

	}
	
	/**
	* Set containment based on current variables (call when adjusting)
	*/
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