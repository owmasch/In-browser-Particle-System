var canvas = document.createElement("canvas");;
var ctx = canvas.getContext('2d');

var emitters = [], fields = [], particles = [];

var maxParticles, emissionRate, canvasHeight,
	canvasWidth, minimumSpeed, maximumSpeed,
	objectSize, play, fieldsOn, count, windiness;

function toggleIntro(simulation) {
	document.getElementById("intro").style.display = "none";
	outerDiv = document.getElementsByClassName("jumbotron")[0];
	
	outerDiv.appendChild(canvas);
	canvas.height = canvasHeight;
	canvas.width = canvasWidth;
	canvas.style.display = "inline-block";
	canvas.style.border = "2px solid grey";
	
	simulation;
}

function rain() {
	maxParticles = 2000;
	emissionRate = 15;
	particleSize = 1;
	canvasHeight = 400;
	canvasWidth = 600;
	minimumSpeed = 2.25;
	maximumSpeed = 3.5;
	objectSize = 3;
	fieldsOn = false;
	
	//Creates an emitter that emits particles down.
	//	Located at (x: 0, y: 0)
	//	Outputs at angle PI/2 (270 degrees)
	//	Particle spread of PI/32
	emitters = [new Emitter(new Vector(0, 0), Vector.fromAngle(Math.PI/2, 1), Math.PI/32)];
	
	if(fieldsOn) {
		for(var i = 0; i < canvasHeight * 2; i += 20) {
		fields.push(new Field(new Vector(- 100, i), -50));
		}
	}
	
	
	play = true;
	loop();
}
function snow() {
	emitters = [new Emitter(new Vector(0, 0), Vector.fromAngle(Math.PI/2, 1), Math.PI/4)];
	maxParticles = 1000;
	emissionRate = 10;
	particleSize = 1;
	canvasHeight = 400;
	canvasWidth = 600;
	minimumSpeed = .1;
	maximumSpeed = 2;
	objectSize = 3;
	play = true;
	loop();
}

function addNewParticles() {
	//if we're at a max... stop.
	if(particles.length > maxParticles) {
		return;
	}
	
	//For each emitter
	for(var i = 0; i < emitters.length; i++) {
		//For [emissionRate], emit a particle
		for(var j = 0; j < emissionRate; j++) {
			particles.push(emitters[i].emitParticle());
		}
	
	}
}

function plotParticles(boundsX, boundsY) {
	//Particles within bounds
	var currentParticles = [];
	
	for(var i = 0; i < particles.length; i++) {
		var particle = particles[i];
		var pos = particle.position;
		
		//Check if out of bounds and if so move on without adding it to the new list.
		if(pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) {
			continue;
		}
		// Update velocities and accelerations to account for fields.
		particle.submitToFields(fields);
		
		//Move the particle
		particle.move();
		
		//Add this particle to the list of current particles
		currentParticles.push(particle);
	}
	particles = currentParticles;
}

function drawParticles() {
	//Set the color of our particles.
	ctx.fillStyle = 'rgb(0,0,255)';
	
	// For each particle
	for(var i = 0; i < particles.length; i++) {
		var position = particles[i].position;
		
		ctx.fillRect(position.x, position.y, particleSize, particleSize);
	}
}

// `object` is a field or emitter, something that has a drawColor and position
// Used to make emitters or fields appear as circles.
function drawCircle(object) {
	ctx.fillStyle = object.drawColor;
	ctx.beginPath();
	ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

function loop() {
	clear();
	update();
	draw();
	queue();
}

function clear() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function update() {
	addNewParticles();
	plotParticles(canvasWidth, canvasHeight);
}

function draw(){
	drawParticles();
	fields.forEach(drawCircle);
	//Shows emitters.
	//emitters.forEach(drawCircle);
}

function queue() {
	if(play) {
		window.requestAnimationFrame(loop);
	}
	else {
		//pause
	}
}