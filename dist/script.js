(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	// record start time
	var startTime;
	var timeoutID;
	var finished = true;

	function display() {
		
		// later record end time
		var endTime = new Date();

		// time difference in ms
		var timeDiff = endTime - startTime;
		
		var milli = timeDiff%1000;

		// strip the miliseconds
		timeDiff /= 1000;

		// get seconds
		var seconds = Math.round(timeDiff % 60);

		// remove seconds from the date
		timeDiff = Math.floor(timeDiff / 60);

		// get minutes
		var minutes = Math.round(timeDiff % 60);

		// remove minutes from the date
		timeDiff = Math.floor(timeDiff / 60);

		// get hours
		var hours = Math.round(timeDiff % 24);

		// remove hours from the date
		timeDiff = Math.floor(timeDiff / 24);

		// the rest of timeDiff is number of days
		var days = timeDiff;
		//console.log(milli%1000);
		$("#game-time").text(seconds+'.'+milli);
		timeoutID = setTimeout(display, 1);
	}

	function startTimer() {
		if (finished) {
			console.log('START');
			startTime = new Date();
			display();
			finished = false;
		}
	}

	function stopTimer() {
		if (!finished) {
			clearTimeout(timeoutID);
			finished = true;
		}
	}

	var settings = {
		height: 20,
		width: 20,
		playerColor: '#E45957',
		speed: 3.8,
		accel: 3,
	}

	var level = {
		number: 1,
		terrainColor: '#CFD8DC',
		gravity: 0.3,
		friction: 0.91,

	}

	var frameWidth = $('#game-frame').width();
	var frameHeight = $('#game-frame').height();
	var startX = 0;
	var staryY = frameHeight / 2 - 20;
	var winZoneX;
	var winZoneY;
	var winZoneWidth;
	var winZoneHeight;
	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		width = frameWidth,
		height = frameHeight,
		player = {
			x: 0,
			y: height / 2 - 20,
			startX: 0,
			startY: height / 2 - 20,
			width: settings.width,
			height: settings.height,
			speed: settings.speed,
			accel: settings.accel,
			velX: 0,
			velY: 0,
			jumping: false,
			grounded: false
		},
		keys = [],
		friction = level.friction,
		gravity = level.gravity;

	var boxes = [];
	var movingPlatforms = [];

	/******** BOUNDS *********/
	
	// Left Bound
	boxes.push({
		type: 'bound--L',
		isMobile: false,
		x: 0,
		y: 0,
		width: 10,
		height: height
	});
	// Bottom Bound
	boxes.push({
		type: 'bound--B',
		isMobile: false,
		x: 0,
		y: height - 10,
		width: width,
		height: 50
	});
	// Top Bound
	boxes.push({
		type: 'bound--T',
		isMobile: false,
		x: 0,
		y: 0,
		width: width,
		height: 10
	});

	//Right Bound
	boxes.push({
		type: 'bound--R',
		isMobile: false,
		x: width - 10,
		y: 0,
		width: 50,
		height: height
	});

	/******** PLATFORMS *********/
	
	boxes.push({
		type: 'startBlock',
		isMobile: false,
		x: 0,
		y: height / 2,
		width: 200,
		height: height / 2
	});

	boxes.push({
		type: 'platform--S',
		isMobile: false,
		x: width / 2,
		y: height / 2,
		width: 50,
		height: 10,
		winZone: false,
	});
	boxes.push({
		type: 'platform--M',
		isMobile: false,
		x: width / 3.1,
		y: height / 2,
		width: 70,
		height: 10,
		winZone: false,
	});
	movingPlatforms.push({
		type: 'platform--S',
		isMobile: true,
		x: width / 2 + 100,
		y: height / 2 - 50,
		width: 50,
		height: 10,
		winZone: false,
	});
	boxes.push({
		type: 'platform--S',
		isMobile: false,
		x: width / 2 + 200,
		y: height / 2 - 100,
		width: 50,
		height: 10,
		winZone: false,
	});
	
	boxes.push({
		type: 'platform--S',
		isMobile: false,
		x: width / 2 + 300,
		y: height / 2 - 150,
		width: 50,
		height: 10,
		winZone: true,
	});

	function reset() {
		stopTimer();
		finished = true;
		
		player.x = 0;
		player.y = height / 2 - 20;

		console.log('blah' + finished);
	}

	canvas.width = width;
	canvas.height = height;

	function update() {
		// check keys
		if (keys[38] || keys[32] || keys[87]) {
			startTimer();
			// up arrow or space
			finished = false;
			if (!player.jumping && player.grounded) {
				player.jumping = true;
				player.grounded = false;
				player.velY = -player.speed * 2;
			}
		}
		if (keys[39] || keys[68]) {
			startTimer();
			// right arrow
			finished = false;
			
			if (player.velX < player.speed) {
				player.velX += player.accel;

			}
		}
		if (keys[37] || keys[65]) {
			startTimer();
			// left arrow
			finished = false;
			
			if (player.velX > -player.speed) {
				player.velX -= player.accel;

			}
		}
		if (keys[8]) {
			// delete 
			reset();

		}

		player.velX *= friction;
		player.velY += gravity;

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = level.terrainColor;
		ctx.beginPath();

		var reversed = false;
		player.grounded = false;
		for (var i = 0; i < boxes.length; i++) {
			
			// Special draw for mobile platforms
			ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
			/*
			if(boxes[i].isMobile) {
				var vDir = -1;
				
				//console.log(reversed);
				
				//falling
				if(boxes[i].y == 100){
					vDir = 1;
					boxes[i].y++;
				} 
				//
				if(boxes[i].y == 400){
					boxes[i].y--;
					vDir = -1;
					
				} 
				
				
				// Draw the rectangle
				ctx.rect(boxes[i].x, boxes[i].y  += vDir, boxes[i].width, boxes[i].height);
				
			} else {
				
			}
			*/
			
			if (boxes[i].winZone) {
				
				winZoneX = boxes[i].x;
				winZoneY = boxes[i].y-boxes[i].height;
				winZoneWidth = boxes[i].width;
				winZoneHeight = boxes[i].height;
				//ctx.fillStyle = '#333';
				//ctx.rect(winZoneX, winZoneY, winZoneWidth, winZoneHeight);
			}

			var dir = colCheck(player, boxes[i]);

			if (dir === "l" || dir === "r") {
				player.velX = 0;
				player.jumping = false;
				
			} else if (dir === "b") {
				player.grounded = true;
				player.jumping = false;
			} else if (dir === "t") {
				player.velY *= -1;
				
				//if(player.x > boxes[0].width) {
					
				//}
			}

		}

		if (player.grounded) {
			player.velY = 0;
		}
		//  && player.x < winZoneX+winZoneWidth && player.y > winZoneY && player.Y < winZoneY-winZoneHeight
		
		//&& Math.abs(player.velX)< 0.000000001  && Math.abs(player.velY)< 0.000000001
		
		if(player.x > winZoneX - (player.width)/2 && player.y < winZoneY && player.y > winZoneY - 20 ) {
			reset();
		}

		if (player.y > frameHeight * 0.9) {
			reset();
		}

		player.x += player.velX;
		player.y += player.velY;

		ctx.fill();
		ctx.fillStyle = settings.playerColor;
		ctx.fillRect(player.x, player.y, player.width, player.height);
		
		

		//console.log(player.velX, player.velY);
		requestAnimationFrame(update);
	}
			
	//TweenMax.to(movingPlatforms, 1, {y:100, repeat:-1, yoyo:true});
	var animating = false;
	var index = 0;
	function colCheck(shapeA, shapeB) {
		// get the vectors to check against
		var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
			vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
			// add the half widths and half heights of the objects
			hWidths = (shapeA.width / 2) + (shapeB.width / 2),
			hHeights = (shapeA.height / 2) + (shapeB.height / 2),
			colDir = null;

		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
			index++;
			
			if(!animating) {
				animating = true;
				//console.log(index+': '+shapeB.type);
				setTimeout(function(s) { 
					
						animating = false;
						
					 
				}, 500);
			}
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = hWidths - Math.abs(vX),
				oY = hHeights - Math.abs(vY);
			if (oX >= oY) {
				if (vY > 0) {
					colDir = "t";
					shapeA.y += oY;
					
				} else {
					colDir = "b";
					shapeA.y -= oY;
					
				}
			} else {
				if (vX > 0) {
					colDir = "l";
					shapeA.x += oX;
				} else {
					colDir = "r";
					shapeA.x -= oX;
				}
			}
		}
		return colDir;
	}

	document.body.addEventListener("keydown", function(e) {
		keys[e.keyCode] = true;
	});

	document.body.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
	});

	window.addEventListener("load", function() {
		update();
	});

})();