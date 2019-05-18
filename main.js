function main() {
	
	var pointSound = document.getElementById("pointSound");
	var loseSound = document.getElementById("loseSound");
	var winSound = document.getElementById("winSound");
	var jumpSound = document.getElementById("jumpSound");
	var backgroundMusic = document.getElementById("background_music");

	var backgroundMusicStarted = false;
	
	var canvas = document.getElementById('canvas');
	var gl = canvas.getContext('webgl');

	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	var program = gl.createProgram();
	
	var phongSpecularVertexShader = gl.createShader(gl.VERTEX_SHADER);
	var phongSpecularFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(phongSpecularVertexShader, document.getElementById("phongSpecularVertexShader").text);
	gl.shaderSource(phongSpecularFragmentShader, document.getElementById("phongSpecularFragmentShader").text);

	gl.compileShader(phongSpecularVertexShader);
	gl.compileShader(phongSpecularFragmentShader);
	
    gl.attachShader(program, phongSpecularVertexShader);
    gl.attachShader(program, phongSpecularFragmentShader);
    gl.linkProgram(program);

    gl.useProgram(program);
	
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	
	var pointCounter = 0;
	
	var enemyHalfSphereRotationMatrix = new Float32Array(16);
	enemyHalfSphereRotationMatrix = identityMatrix.slice();
	glMatrix.mat4.rotate(enemyHalfSphereRotationMatrix, enemyHalfSphereRotationMatrix, glMatrix.glMatrix.toRadian(-90), [1, 0, 0]);
	
	var enemyHalfSphereTranslationMatrices = [];
	enemyHalfSphereTranslationMatrices.push(identityMatrix.slice());
	enemyHalfSphereTranslationMatrices.push(identityMatrix.slice());

	var enemyCylinderTranslationMatrices = [];
	enemyCylinderTranslationMatrices.push(identityMatrix.slice())
	enemyCylinderTranslationMatrices.push(identityMatrix.slice())
	
	var wholeEnemyRotationMatrices = [];
	wholeEnemyRotationMatrices.push(identityMatrix.slice());
	wholeEnemyRotationMatrices.push(identityMatrix.slice());

	var enemy1StartX = 8;
	var enemy1StartY = 8;
	glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [enemy1StartX, 0, enemy1StartY]);
	glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [enemy1StartX, 1, enemy1StartY]);
		
	var enemy2StartX = -12;
	var enemy2StartY = -6;
	glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [enemy2StartX, 0, enemy2StartY]);
	glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [enemy2StartX, 1, enemy2StartY]);

	var enemy1Up = false;
	var enemy1Down = false;
	var enemy1Left = false;
	var enemy1Right = false;
	
	var enemy2Up = false;
	var enemy2Down = false;
	var enemy2Left = false;
	var enemy2Right = false;

	var cylinderVertices = [
		0, 0, 0,
		1, 0, 0,
		0.92, 0, 0.38,
		0.7, 0, 0.7,
		0.38, 0, 0.92,
		0, 0, 1,
		-0.38, 0, 0.92,
		-0.7, 0, 0.7,
		-0.92, 0, 0.38,
		-1, 0, 0,
		-0.92, 0, -0.38,
		-0.7, 0, -0.7,
		-0.38, 0, -0.92,
		0, 0, -1,
		0.38, 0, -0.92,
		0.7, 0, -0.7,
		0.92, 0, -0.38,
		
		0, 1, 0,
		1, 1, 0,
		0.92, 1, 0.38,
		0.7, 1, 0.7,
		0.38, 1, 0.92,
		0, 1, 1,
		-0.38, 1, 0.92,
		-0.7, 1, 0.7,
		-0.92, 1, 0.38,
		-1, 1, 0,
		-0.92, 1, -0.38,
		-0.7, 1, -0.7,
		-0.38, 1, -0.92,
		0, 1, -1,
		0.38, 1, -0.92,
		0.7, 1, -0.7,
		0.92, 1, -0.38
	];
	
	var cylinderIndices = [
		0, 1, 2,
		0, 2, 3,
		0, 3, 4,
		0, 4, 5,
		0, 5, 6,
		0, 6, 7,
		0, 7, 8,
		0, 8, 9,
		0, 9, 10,
		0, 10, 11,
		0, 11, 12,
		0, 12, 13,
		0, 13, 14,
		0, 14, 15,
		0, 15, 16,
		0, 16, 1,
	
		17, 18, 19,
		17, 19, 20,
		17, 20, 21,
		17, 21, 22,
		17, 22, 23,
		17, 23, 24,
		17, 24, 25,
		17, 25, 26,
		17, 26, 27,
		17, 27, 28,
		17, 28, 29,
		17, 29, 30,
		17, 30, 31,
		17, 31, 32,
		17, 32, 33,
		17, 33, 18,
		
		18, 1, 2,
		19, 2, 3,
		20, 3, 4,
		21, 4, 5,
		22, 5, 6,
		23, 6, 7,
		24, 7, 8,
		25, 8, 9,
		26, 9, 10,
		27, 10, 11,
		28, 11, 12,
		29, 12, 13,
		30, 13, 14,
		31, 14, 15,
		32, 15, 16,
		33, 16, 1,
		
		2, 18, 19,
		3, 19, 20,
		4, 20, 21,
		5, 21, 22,
		6, 22, 23,
		7, 23, 24,
		8, 24, 25,
		9, 25, 26,
		10, 26, 27,
		11, 27, 28,
		12, 28, 29,
		13, 29, 30,
		14, 30, 31,
		15, 31, 32,
		16, 32, 33,
		1, 33, 18
	];

	var cylinderColors = []
	
	for(var i = 0; i < cylinderVertices.length; i++) {
		cylinderColors.push([])
		cylinderColors[0].push(1.0, 0.0, 0.0);
	}
	
	for(var i = 0; i < cylinderVertices.length; i++) {
		cylinderColors.push([])
		cylinderColors[1].push(0.0, 1.0, 0.0);
	}
	
	var cylinderNormals = cylinderVertices.slice();
	
	var pressedUp = false;
	var pressedDown = false;
	var pressedLeft = false;
	var pressedRight = false;
			
	var leftEyeVertices = [
		-0.3500000238418579, 0.3999999761581421, 0.9000000953674316,
		-0.20781731605529785, 0.4989203214645386, 0.9999942779541016,
		-0.21919190883636475, 0.4369772672653198, 1.0454440116882324,
		-0.2504720687866211, 0.3697164058685303, 1.0684552192687988,
		-0.2959705591201782, 0.3067816495895386, 1.06740140914917,
		-0.3500000238418579, 0.25781726837158203, 1.0406560897827148,
		-0.4040294885635376, 0.23160219192504883, 0.9914054870605469,
		-0.4495279788970947, 0.23122775554656982, 0.9284634590148926,
		-0.4808081388473511, 0.254963755607605, 0.8614544868469238,
		-0.49218273162841797, 0.3010796308517456, 0.8000059127807617,
		-0.4808081388473511, 0.36302268505096436, 0.7545561790466309,
		-0.4495279788970947, 0.4302835464477539, 0.7315449714660645,
		-0.4040294885635376, 0.4932183027267456, 0.7325987815856934,
		-0.3500000238418579, 0.5421826839447021, 0.7593441009521484,
		-0.2959705591201782, 0.5683977603912354, 0.8085947036743164,
		-0.2504720687866211, 0.5687720775604248, 0.8715367317199707,
		-0.21919190883636475, 0.5450360774993896, 0.9385457038879395
	];

	var rightEyeVertices = [
		-0.3500000238418579, -0.2999999523162842, 0.9000000953674316,
		-0.5094282627105713, -0.2285773754119873, 0.8026275634765625,
		-0.5042612552642822, -0.3006542921066284, 0.774162769317627,
		-0.4755765199661255, -0.3722519874572754, 0.7650547027587891,
		-0.42895209789276123, -0.4335278272628784, 0.7752246856689453,
		-0.3699667453765869, -0.4746396541595459, 0.8045940399169922,
		-0.30778658390045166, -0.4878089427947998, 0.8492283821105957,
		-0.252376914024353, -0.4722435474395752, 0.9013767242431641,
		-0.21091341972351074, -0.4320716857910156, 0.9533286094665527,
		-0.19057178497314453, -0.37142252922058105, 0.9973726272583008,
		-0.19573867321014404, -0.29934561252593994, 1.0258374214172363,
		-0.22442352771759033, -0.22774791717529297, 1.0349454879760742,
		-0.2710479497909546, -0.16647207736968994, 1.024775505065918,
		-0.3300333023071289, -0.12536025047302246, 0.9954061508178711,
		-0.39221346378326416, -0.11219096183776855, 0.9507718086242676,
		-0.4476231336593628, -0.12775635719299316, 0.8986234664916992,
		-0.4890866279602051, -0.16792821884155273, 0.8466715812683105
	];
		
	var playerEyeIndices = [
		0, 1, 2,
		0, 2, 3,
		0, 3, 4,
		0, 4, 5,
		0, 5, 6,
		0, 6, 7,
		0, 7, 8,
		0, 8, 9,
		0, 9, 10,
		0, 10, 11,
		0, 11, 12,
		0, 12, 13,
		0, 13, 14,
		0, 14, 15,
		0, 15, 16,
		0, 16, 1
	];
		
	var playerEyeNormals = [];
	for(var i = 0; i < playerEyeIndices.length; i++) {
		playerEyeNormals.push(0, 1, 0);
	}
	
	var playerEyeColors = [];
	for(var i = 0; i < leftEyeVertices.length; i++) {
		playerEyeColors.push(0, 0, 0);
	}
	
	var groundPlaneVertices = [
		16, 0, 16,
		16, 0, -16,
		-16, 0, -16,
		-16, 0, 16
	];
		
	var groundPlaneNormals = [
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0
	];
	
	var groundPlaneColors = [
		0.8, 0.8, 0.8,
		0.8, 0.8, 0.8,
		0.8, 0.8, 0.8,
		0.8, 0.8, 0.8
	];
	
	var groundPlaneIndices = [
		0, 1, 3,
		3, 1, 2
	];
	
	var groundPlaneRotationMatrix = new Float32Array(16);
	var groundPlaneTranslationMatrix = new Float32Array(16);
	
	glMatrix.mat4.identity(groundPlaneRotationMatrix);
	glMatrix.mat4.identity(groundPlaneTranslationMatrix);

	var labyrinth = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
		[1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
		[1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
		[1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
		[1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	];
	
	const cubeVertices =
	[
		1.0, 1.0, 1.0,   
		1.0, 1.0, -1.0,  
		-1.0, 1.0, -1.0,   
		-1.0, 1.0, 1.0,   
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0, 
		-1.0, 1.0, 1.0,  
		-1.0, -1.0, 1.0,  
		1.0, -1.0, 1.0,    
		1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,   
		-1.0, -1.0, 1.0,  
		1.0, -1.0, -1.0, 
		1.0, 1.0, -1.0,  
		1.0, 1.0, 1.0,    
		1.0, -1.0, 1.0,  
		-1.0, -1.0, 1.0,   
		-1.0, 1.0, 1.0,   
		1.0, 1.0, 1.0,   
		1.0, -1.0, 1.0,   
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,   
		1.0, -1.0, -1.0
	];
	
	const cubeNormals = cubeVertices.slice();
					
	const cubeColors = 
	[
		0.0, 0.5, 0.9,
		0.0, 0.5, 0.9,
		0.0, 0.5, 0.9,
		0.0, 0.5, 0.9,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.5,
		0.9, 0.0, 0.6,
		0.9, 0.0, 0.6,
		0.9, 0.0, 0.6,
		0.9, 0.0, 0.6,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.5,
		0.0, 0.2, 0.8,
		0.0, 0.2, 0.8,
		0.0, 0.2, 0.8,
		0.0, 0.2, 0.8,
		0.0, 0.0, 0.3,
		0.0, 0.0, 0.3,
		0.0, 0.0, 0.3,
		0.0, 0.0, 0.3
	];
	
	const cubeIndices =
	[
		0, 1, 2,
		0, 2, 3,
		5, 4, 6,
		6, 4, 7,
		8, 9, 10,
		8, 10, 11,
		13, 12, 14,
		15, 14, 12,
		16, 17, 18,
		16, 18, 19,
		21, 20, 22,
		22, 20, 23
	];
	
	var cubeTranslationMatrices = [];

	for(var i = 0; i < labyrinth.length; i++) {
		cubeTranslationMatrices.push([]);
		for(var j = 0; j < labyrinth[0].length; j++) {
			 cubeTranslationMatrices[i].push(identityMatrix.slice());
		}
	}
	
	for(var i = 0; i < labyrinth.length; i++) {
		for(var j = 0; j < labyrinth[0].length; j++) {
			if(labyrinth[i][j] == 1) {
				glMatrix.mat4.translate(cubeTranslationMatrices[i][j], cubeTranslationMatrices[i][j], [2*(labyrinth.length-1-i)-14, 1, 2*j-14]);
			}
		}
	}

	
	var dotArray  = labyrinth.map(inner => inner.slice());
	dotArray[8][7] = 1;
	
	var dotColors = [];
	for(var i = 0; i < cubeVertices.length; i++) {
		dotColors.push(1.0, 1.0, 0.0);
	}
	
	var dotTranslationMatrices = [];
	var dotScalingMatrix = identityMatrix.slice();
	glMatrix.mat4.scale(dotScalingMatrix, dotScalingMatrix, [0.1, 0.1, 0.1]);
	
	for(var i = 0; i < labyrinth.length; i++) {
		dotTranslationMatrices.push([]);
		for(var j = 0; j < labyrinth[0].length; j++) {
			 dotTranslationMatrices[i].push(identityMatrix.slice());
		}
	}
	
	for(var i = 0; i < labyrinth.length; i++) {
		for(var j = 0; j < labyrinth[0].length; j++) {
			if(labyrinth[i][j] == 0) {
				glMatrix.mat4.translate(dotTranslationMatrices[i][j], dotTranslationMatrices[i][j], [2*(labyrinth.length-1-i)-14, 1, 2*j-14]);
			}
		}
	}
	
	var halfSphereVertices = [];
	var halfSphereNormals = [];
	var halfSphereColors = [];
	var halfSphereIndices = [];
	
	var latLongCount = 5; // Count of latitudes and longitudes
	
	for (var i = 0; i <= latLongCount; i++) {	//Create vertices and the indices for the halfSphere
		for (var j = 0; j <= latLongCount; j++) {
		
			var theta = i * Math.PI / latLongCount;
			var phi = j * 2 * Math.PI/2 / latLongCount;

			halfSphereVertices.push(Math.sin(theta) * Math.cos(phi));
			halfSphereVertices.push(Math.cos(theta) * Math.cos(phi));
			halfSphereVertices.push(Math.sin(phi));
			
			halfSphereColors.push(1, 1, 0);
			
			if (i < latLongCount && j < latLongCount) {
				halfSphereIndices.push(i * (latLongCount + 1) + j);
				halfSphereIndices.push(i * (latLongCount + 1) + j + 1);
				halfSphereIndices.push(i * (latLongCount + 1) + j + 1 + latLongCount);
				
				halfSphereIndices.push(i * (latLongCount + 1) + j + 2 + latLongCount);
				halfSphereIndices.push(i * (latLongCount + 1) + j + 1);
				halfSphereIndices.push(i * (latLongCount + 1) + j + 1 + latLongCount);
			}
		}
	}
	
	halfSphereVertices.push(0, 0, 0);
	halfSphereColors.push(0, 0, 0);

	halfSphereNormals = halfSphereVertices.slice(); // The normals and the vertices are the same for the halfSphere

	var ambientColor = [0.5, 0.5, 0.5];
	var diffuseColor = [0.5, 0.5, 0.5];
	var specularColor = [0.1, 0.1, 0.1];
	
	var lightPosition = [0, 20, -20];
	var cameraPosition = [0, 15, 0];
	
	//Create uniform matrices
	var globalRotationMatrix = new Float32Array(16);
	glMatrix.mat4.identity(globalRotationMatrix);

	var halfSphereRotationMatrices = [];
	var halfSphereTranslationMatrices = [];
	
	for(var i = 0; i < 2; i++) {
		halfSphereRotationMatrices.push(identityMatrix.slice());
		halfSphereTranslationMatrices.push(identityMatrix.slice());
	}
	
	glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 1, 0]);
	glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 1, 0]);
	glMatrix.mat4.rotate(halfSphereRotationMatrices[0], halfSphereRotationMatrices[0], glMatrix.glMatrix.toRadian(90), [1, 0, 0]);
	glMatrix.mat4.rotate(halfSphereRotationMatrices[1], halfSphereRotationMatrices[1], glMatrix.glMatrix.toRadian(-90), [1, 0, 0]);
	
	var viewMatrix = new Float32Array(16);
	var projectionMatrix = new Float32Array(16);
	
	var shearMatrix = new Float32Array(16);
	shearMatrix = identityMatrix.slice();
	
	shearMatrix[4] = 0.4;
	shearMatrix[6] = -0.4;
	
	glMatrix.mat4.lookAt(viewMatrix, cameraPosition, [0, 0, 0], [1, 0, 0]);
	glMatrix.mat4.multiply(viewMatrix, viewMatrix, shearMatrix)
	glMatrix.mat4.ortho(projectionMatrix, -15, 15, -15, 15, 0.1, 100);
	//glMatrix.mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(90), 800 / 600, 0.1, 100);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');
	gl.enableVertexAttribArray(positionAttribLocation);
	
	var normalAttribLocation = gl.getAttribLocation(program, 'vertexNormal');
	gl.enableVertexAttribArray(normalAttribLocation);
	
	var colorAttribLocation = gl.getAttribLocation(program, 'vertexColor');
	gl.enableVertexAttribArray(colorAttribLocation);
	
	var vertexBuffer = gl.createBuffer();	
	var normalBuffer = gl.createBuffer();
	var colorBuffer = gl.createBuffer();
	var indexBuffer = gl.createBuffer();
	
	var cameraSelected = false;
	
	var mouthOpeningCounter = 0;
	var mouthOpening = true;
	glMatrix.mat4.rotate(halfSphereRotationMatrices[1], halfSphereRotationMatrices[1], glMatrix.glMatrix.toRadian(45), [0, 1, 0]);

	var wholePlayerRotationMatrix = identityMatrix.slice();

	var lastPlayerX;
	var lastPlayerY;
	var playerX;
	var playerY;
	var plX;
	var plY;
	
	var playerSpeed = 0.4;
	
	var playerStanding = false;
	
	var up = false;
	var down = false;
	var left = false;
	var right = false;
	
	var jumping = false;
	var jumpingProgress = 0;
	var jumpingUp = false;
	var jumpingDown = false;

	var lastEnemy1X;
	var lastEnemy1Y;
	var enemy1X;
	var enemy1Y;
	var en1X;
	var en1Y;
		
	var lastEnemy2X;
	var lastEnemy2Y;
	var enemy2X;
	var enemy2Y;
	var en2X;
	var en2Y;
		
	var loop = function () {
	
		playerX = parseInt((halfSphereTranslationMatrices[0][14] + 16)/2);
		playerY = parseInt(-(halfSphereTranslationMatrices[0][12] - 18)/2);
		
		plX = parseInt((halfSphereTranslationMatrices[0][14] + 16)/2 - 0.5);
		plY = parseInt(-(halfSphereTranslationMatrices[0][12] - 18)/2 - 0.5);
				
		if(lastPlayerX != playerX || lastPlayerY != playerY || (!up && !down && !left && !right)) {	
			if(pressedUp && labyrinth[plY-1][plX] == 0) {
				up = true;
				down = false;	
				left = false;
				right = false;
				wholePlayerRotationMatrix = identityMatrix.slice();
				glMatrix.mat4.rotate(wholePlayerRotationMatrix, wholePlayerRotationMatrix, glMatrix.glMatrix.toRadian(180), [0, 1, 0]);
			}
			if(pressedDown && labyrinth[plY+1][plX] == 0) {
				up = false;
				down = true;	
				left = false;
				right = false;
				wholePlayerRotationMatrix = identityMatrix.slice();
				glMatrix.mat4.rotate(wholePlayerRotationMatrix, wholePlayerRotationMatrix, glMatrix.glMatrix.toRadian(0), [0, 1, 0]);
				
			}
			if(pressedLeft && labyrinth[plY][plX-1] == 0) {
				up = false;
				down = false;	
				left = true;
				right = false;
				wholePlayerRotationMatrix = identityMatrix.slice();
				glMatrix.mat4.rotate(wholePlayerRotationMatrix, wholePlayerRotationMatrix, glMatrix.glMatrix.toRadian(270), [0, 1, 0]);
				
			}
			if(pressedRight && labyrinth[plY][plX+1] == 0) {
				up = false;
				down = false;	
				left = false;
				right = true;
				wholePlayerRotationMatrix = identityMatrix.slice();
				glMatrix.mat4.rotate(wholePlayerRotationMatrix, wholePlayerRotationMatrix, glMatrix.glMatrix.toRadian(90), [0, 1, 0]);
			}
		}

		
		if(lastPlayerX != playerX || lastPlayerY != playerY) {	
			if(up && labyrinth[plY-1][plX] == 1) {
				up = false;
			}
			if(down && labyrinth[plY+1][plX] == 1) {
				down = false;
			}
			if(left && labyrinth[plY][plX-1] == 1) {
				left = false;
			}
			if(right && labyrinth[plY][plX+1] == 1) {
				right = false;
			}
		}

		
		lastPlayerX = playerX;
		lastPlayerY = playerY;
		
		gl.clearColor(0.9, 0.9, 0.9, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		
		var wholePlayerRotationMatrixUniformLocation = gl.getUniformLocation(program, 'wholePlayerRotationMatrix');
		var rotationMatrixUniformLocation = gl.getUniformLocation(program, 'rotationMatrix');
		var translationMatrixUniformLocation = gl.getUniformLocation(program, 'translationMatrix');
		var scalingMatrixUniformLocation = gl.getUniformLocation(program, 'scalingMatrix');
		var viewMatrixUniformLocation = gl.getUniformLocation(program, 'viewMatrix');
		var projectionMatrixUniformLocation = gl.getUniformLocation(program, 'projectionMatrix');
		var ambientColorUniformLocation = gl.getUniformLocation(program, 'ambientColor');
		var diffuseColorUniformLocation = gl.getUniformLocation(program, 'diffuseColor');
		var specularColorUniformLocation = gl.getUniformLocation(program, 'specularColor');
		var lightPositionUniformLocation = gl.getUniformLocation(program, 'lightPosition');
		var cameraPositionUniformLocation = gl.getUniformLocation(program, 'cameraPosition');
		
		gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
		
		gl.uniform3fv(ambientColorUniformLocation, ambientColor);
		gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
		gl.uniform3fv(specularColorUniformLocation, specularColor);
		gl.uniform3fv(lightPositionUniformLocation, lightPosition);
		gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);

		//Draw ground plane
		gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, identityMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, groundPlaneRotationMatrix);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, groundPlaneTranslationMatrix);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundPlaneVertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundPlaneNormals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundPlaneColors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(groundPlaneIndices), gl.STATIC_DRAW);

		gl.drawElements(gl.TRIANGLES, groundPlaneIndices.length, gl.UNSIGNED_SHORT, 0);
		
		
		//Draw left eye
		gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholePlayerRotationMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, halfSphereRotationMatrices[1]);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, halfSphereTranslationMatrices[1]);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(leftEyeVertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeNormals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeColors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(playerEyeIndices), gl.STATIC_DRAW);

		gl.drawElements(gl.TRIANGLES, playerEyeIndices.length, gl.UNSIGNED_SHORT, 0);
		
		
		
		//Draw right eye
		gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholePlayerRotationMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, halfSphereRotationMatrices[1]);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, halfSphereTranslationMatrices[1]);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rightEyeVertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeNormals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeColors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(playerEyeIndices), gl.STATIC_DRAW);

		gl.drawElements(gl.TRIANGLES, playerEyeIndices.length, gl.UNSIGNED_SHORT, 0);
		
		mouthOpeningCounter++;
		
		if(mouthOpeningCounter == 10) {
			mouthOpeningCounter = 0;
			if(mouthOpening) {
				mouthOpening = false;
			} else {
				mouthOpening = true;
			}
		}
		
		if (mouthOpening) {
			glMatrix.mat4.rotate(halfSphereRotationMatrices[1], halfSphereRotationMatrices[1], -0.1, [0, 1, 0]);
		} else {		
			glMatrix.mat4.rotate(halfSphereRotationMatrices[1], halfSphereRotationMatrices[1], 0.1, [0, 1, 0]);
		}
		
		if (up) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [playerSpeed, 0, 0]);				
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [playerSpeed, 0, 0]);	
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [-playerSpeed, 0, 0]);
		}
		if (down) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [-playerSpeed, 0, 0]);				
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [-playerSpeed, 0, 0]);	
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [playerSpeed, 0, 0]);
		}
		if (left) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 0, -playerSpeed]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 0, -playerSpeed]);
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, playerSpeed]);
		}
		if (right) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 0, playerSpeed]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 0, playerSpeed]);
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, -playerSpeed]);
		}
		
		//Draw halfSpheres
		for(var i = 0; i < 2; i++) {
			gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
			gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholePlayerRotationMatrix);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, halfSphereRotationMatrices[i]);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, halfSphereTranslationMatrices[i]);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
					
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(halfSphereVertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(halfSphereNormals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(halfSphereColors), gl.STATIC_DRAW);
			gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(halfSphereIndices), gl.STATIC_DRAW);
			
			gl.drawElements(gl.TRIANGLES, halfSphereIndices.length, gl.UNSIGNED_SHORT, 0);
		}

		
		
		//Draw cubes
		for(var i = 0; i < labyrinth.length; i++) {
			for(var j = 0; j < labyrinth[0].length; j++) {
				if(labyrinth[i][j] == 1) {
					
					gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, cubeTranslationMatrices[i][j]);
					gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
							
					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
					gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
					
					gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
					gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
					
					gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);
					gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
					
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
					
				}
			}
		}
		
		
		
		
		
		//Draw dots
		for(var i = 0; i < dotArray.length; i++) {
			for(var j = 0; j < dotArray[0].length; j++) {
				if(dotArray[i][j] == 0) {
					
					gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, dotTranslationMatrices[i][j]);
					gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, dotScalingMatrix);
							
					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
					gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
					
					gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
					gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
					
					gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotColors), gl.STATIC_DRAW);
					gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
					
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
					
					gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
					
				}
			}
		}

		if(!jumping && dotArray[plY][plX] == 0) {
			dotArray[plY][plX] = 1;
			pointCounter++;
			document.getElementById("pointCounter").innerHTML = pointCounter;
			pointSound.playbackRate=7;
			pointSound.play();
		}
		
		var allDotsEaten = true;
		
		for(var i = 0; i < dotArray.length; i++) {
			for(var j = 0; j < dotArray[0].length; j++) {
				if(dotArray[i][j] == 0) {
					allDotsEaten = false;
					break;
				}
			}
		}

		
		if(!jumping && allDotsEaten) {
			dotArray  = labyrinth.map(inner => inner.slice());
			dotArray[8][7] = 1;
			
			halfSphereTranslationMatrices[0] = identityMatrix.slice();
			halfSphereTranslationMatrices[1] = identityMatrix.slice();
			
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 1, 0]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 1, 0]);
			
			glMatrix.mat4.lookAt(viewMatrix, cameraPosition, [0, 0, 0], [1, 0, 0]);
			glMatrix.mat4.multiply(viewMatrix, viewMatrix, shearMatrix)
			
			enemyCylinderTranslationMatrices[0] = identityMatrix.slice();
			enemyHalfSphereTranslationMatrices[0] = identityMatrix.slice();
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [enemy1StartX, 0, enemy1StartY]);
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [enemy1StartX, 1, enemy1StartY]);
			
			enemyHalfSphereTranslationMatrices[1] = identityMatrix.slice();
			enemyCylinderTranslationMatrices[1] = identityMatrix.slice();
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [enemy2StartX, 0, enemy2StartY]);
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [enemy2StartX, 1, enemy2StartY]);
			
			pressedUp = false;
			pressedDown = false;
			pressedLeft = false;
			pressedRight = false;
			
			up = false;
			down = false;
			right = false;
			left = false;
			
			jumpingUp = false;
			jumpingDown = false;
			jumpingProgress = 0;
			jumping = false;
			
			pointCounter = 0;
			document.getElementById("pointCounter").innerHTML = pointCounter;
			
			backgroundMusicStarted = false;
			backgroundMusic.currentTime = 0;
			backgroundMusic.pause();
			
			winSound.play();
		}
		
		
		
		if(jumping) {

			jumpingProgress = jumpingProgress + Math.PI/10;
			
			if(jumpingUp) {		
				glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, Math.sin(jumpingProgress)*0.75, 0]);
				glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, Math.sin(jumpingProgress)*0.75, 0]);
			} else if (jumpingDown) {
				glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, -Math.sin(jumpingProgress)*0.75, 0]);
				glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, -Math.sin(jumpingProgress)*0.75, 0]);
			}
			
			if(jumpingUp && jumpingProgress == Math.PI) {
				jumpingUp = false;
				jumpingDown = true;
				jumpingProgress = 0;
			}
			
			if(jumpingDown && jumpingProgress == Math.PI) {
				jumpingUp = false;
				jumpingDown = false;
				jumpingProgress = 0;
				jumping = false;
			}
						
		}
		

		
		enemy1X = parseInt((enemyHalfSphereTranslationMatrices[0][14] + 16)/2);
		enemy1Y = parseInt(-(enemyHalfSphereTranslationMatrices[0][12] - 18)/2);
		
		en1X = parseInt((enemyHalfSphereTranslationMatrices[0][14] + 16)/2 - 0.5);
		en1Y = parseInt(-(enemyHalfSphereTranslationMatrices[0][12] - 18)/2 - 0.5);
		
		var changeDirection = false;
		
		if(enemy1Up && labyrinth[en1Y-1][en1X] == 1) {
			changeDirection = true;
		}
		if(enemy1Down && labyrinth[en1Y+1][en1X] == 1) {
			changeDirection = true;
		}
		if(enemy1Left && labyrinth[en1Y][en1X-1] == 1) {
			changeDirection = true;
		}
		if(enemy1Right && labyrinth[en1Y][en1X+1] == 1) {
			changeDirection = true;
		}
		
		var numberOfPossibleDirections = 0
		
		if(labyrinth[en1Y-1][en1X] == 0) {
			numberOfPossibleDirections++;
		}
		if(labyrinth[en1Y+1][en1X] == 0) {
			numberOfPossibleDirections++;
		}
		if(labyrinth[en1Y][en1X-1] == 0) {
			numberOfPossibleDirections++;
		}
		if(labyrinth[en1Y][en1X+1] == 0) {
			numberOfPossibleDirections++;
		}
		if(numberOfPossibleDirections >= 3) {
				changeDirection = true;
		}
			
		if(changeDirection && (lastEnemy1X != enemy1X || lastEnemy1Y != enemy1Y)) {	
		
			var newDirectionFound = false;
			
			while(!newDirectionFound) {
			
				var randomDirection = Math.floor(Math.random() * Math.floor(4));

				if(randomDirection == 0 && labyrinth[en1Y-1][en1X] == 0) {
					enemy1Up = true;
					enemy1Down = false;
					enemy1Left = false;
					enemy1Right = false;
					wholeEnemyRotationMatrices[0] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[0], wholeEnemyRotationMatrices[0], glMatrix.glMatrix.toRadian(180), [0, 1, 0]);
					newDirectionFound = true;
				} else if(randomDirection == 1 && labyrinth[en1Y+1][en1X] == 0) {
					enemy1Up = false;
					enemy1Down = true;
					enemy1Left = false;
					enemy1Right = false;
					wholeEnemyRotationMatrices[0] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[0], wholeEnemyRotationMatrices[0], glMatrix.glMatrix.toRadian(0), [0, 1, 0]);
					newDirectionFound = true;
				} else if(randomDirection == 2 && labyrinth[en1Y][en1X-1] == 0) {
					enemy1Up = false;
					enemy1Down = false;
					enemy1Left = true;
					enemy1Right = false;
					wholeEnemyRotationMatrices[0] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[0], wholeEnemyRotationMatrices[0], glMatrix.glMatrix.toRadian(-90), [0, 1, 0]);
					newDirectionFound = true;
				} else if(randomDirection == 3 && labyrinth[en1Y][en1X+1] == 0) {
					enemy1Up = false;
					enemy1Down = false;
					enemy1Left = false;
					enemy1Right = true;
					wholeEnemyRotationMatrices[0] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[0], wholeEnemyRotationMatrices[0], glMatrix.glMatrix.toRadian(90), [0, 1, 0]);
					newDirectionFound = true;
				}
			}
		}
		
		if(enemy1Up) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [0.2, 0, 0]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [0.2, 0, 0]);
		} else if(enemy1Down) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [-0.2, 0, 0]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [-0.2, 0, 0]);
		} else if(enemy1Left) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [0, 0, -0.2]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [0, 0, -0.2]);
		} else if(enemy1Right) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [0, 0, 0.2]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [0, 0, 0.2]);
		}
		
		lastEnemy1X = enemy1X;
		lastEnemy1Y = enemy1Y;
		
		
		
		
		
		
		enemy2X = parseInt((enemyHalfSphereTranslationMatrices[1][14] + 16)/2);
		enemy2Y = parseInt(-(enemyHalfSphereTranslationMatrices[1][12] - 18)/2);
		
		en2X = parseInt((enemyHalfSphereTranslationMatrices[1][14] + 16)/2 - 0.5);
		en2Y = parseInt(-(enemyHalfSphereTranslationMatrices[1][12] - 18)/2 - 0.5);
		
		var changeDirection = false;
		
		if(enemy2Up && labyrinth[en2Y-1][en2X] == 1) {
			changeDirection = true;
		}
		if(enemy2Down && labyrinth[en2Y+1][en2X] == 1) {
			changeDirection = true;
		}
		if(enemy2Left && labyrinth[en2Y][en2X-1] == 1) {
			changeDirection = true;
		}
		if(enemy2Right && labyrinth[en2Y][en2X+1] == 1) {
			changeDirection = true;
		}
		
		var numberOfPossibleDirections = 0
		
		if(labyrinth[en2Y-1][en2X] == 0) {
			numberOfPossibleDirections++;
		}
		if(labyrinth[en2Y+1][en2X] == 0) {
			numberOfPossibleDirections++;
		}
		if(labyrinth[en2Y][en2X-1] == 0) {
			numberOfPossibleDirections++;
		}
		if(labyrinth[en2Y][en2X+1] == 0) {
			numberOfPossibleDirections++;
		}
		if(numberOfPossibleDirections >= 3) {
				changeDirection = true;
		}
			
		if(changeDirection && (lastEnemy2X != enemy2X || lastEnemy2Y != enemy2Y)) {	
		
			var newDirectionFound = false;
			
			while(!newDirectionFound) {
			
				var randomDirection = Math.floor(Math.random() * Math.floor(4));

				if(randomDirection == 0 && labyrinth[en2Y-1][en2X] == 0) {
					enemy2Up = true;
					enemy2Down = false;
					enemy2Left = false;
					enemy2Right = false;
					wholeEnemyRotationMatrices[1] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[1], wholeEnemyRotationMatrices[1], glMatrix.glMatrix.toRadian(180), [0, 1, 0]);
					newDirectionFound = true;
				} else if(randomDirection == 1 && labyrinth[en2Y+1][en2X] == 0) {
					enemy2Up = false;
					enemy2Down = true;
					enemy2Left = false;
					enemy2Right = false;
					wholeEnemyRotationMatrices[1] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[1], wholeEnemyRotationMatrices[1], glMatrix.glMatrix.toRadian(0), [0, 1, 0]);
					newDirectionFound = true;
				} else if(randomDirection == 2 && labyrinth[en2Y][en2X-1] == 0) {
					enemy2Up = false;
					enemy2Down = false;
					enemy2Left = true;
					enemy2Right = false;
					wholeEnemyRotationMatrices[1] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[1], wholeEnemyRotationMatrices[1], glMatrix.glMatrix.toRadian(-90), [0, 1, 0]);
					newDirectionFound = true;
				} else if(randomDirection == 3 && labyrinth[en2Y][en2X+1] == 0) {
					enemy2Up = false;
					enemy2Down = false;
					enemy2Left = false;
					enemy2Right = true;
					wholeEnemyRotationMatrices[1] = identityMatrix.slice();
					glMatrix.mat4.rotate(wholeEnemyRotationMatrices[1], wholeEnemyRotationMatrices[1], glMatrix.glMatrix.toRadian(90), [0, 1, 0]);
					newDirectionFound = true;
				}
			}
		}
		
		if(enemy2Up) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [0.2, 0, 0]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [0.2, 0, 0]);
		} else if(enemy2Down) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [-0.2, 0, 0]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [-0.2, 0, 0]);
		} else if(enemy2Left) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [0, 0, -0.2]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [0, 0, -0.2]);
		} else if(enemy2Right) {
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [0, 0, 0.2]);
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [0, 0, 0.2]);
		}
		
		lastEnemy2X = enemy2X;
		lastEnemy2Y = enemy2Y;
	
		for(var i = 0; i < 2; i++) {
		
			//Draw cylinder for enemy
			gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
			gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
			gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholeEnemyRotationMatrices[i]);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, identityMatrix);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, enemyCylinderTranslationMatrices[i]);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
					
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderNormals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderColors[i]), gl.STATIC_DRAW);
			gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), gl.STATIC_DRAW);
			
			gl.drawElements(gl.TRIANGLES, cylinderIndices.length, gl.UNSIGNED_SHORT, 0);
			
			
			//Draw halfsphere for enemy
			gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
			gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
			gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholeEnemyRotationMatrices[i]);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, enemyHalfSphereRotationMatrix);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, enemyHalfSphereTranslationMatrices[i]);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
					
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(halfSphereVertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(halfSphereNormals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderColors[i]), gl.STATIC_DRAW);
			gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(halfSphereIndices), gl.STATIC_DRAW);
			
			gl.drawElements(gl.TRIANGLES, halfSphereIndices.length, gl.UNSIGNED_SHORT, 0);
			
			//Draw left eye for enemy
			gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholeEnemyRotationMatrices[i]);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, enemyHalfSphereRotationMatrix);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, enemyHalfSphereTranslationMatrices[i]);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(leftEyeVertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeNormals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeColors), gl.STATIC_DRAW);
			gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(playerEyeIndices), gl.STATIC_DRAW);

			gl.drawElements(gl.TRIANGLES, playerEyeIndices.length, gl.UNSIGNED_SHORT, 0);
			

			//Draw right eye for enemy
			gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholeEnemyRotationMatrices[i]);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, enemyHalfSphereRotationMatrix);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, enemyHalfSphereTranslationMatrices[i]);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rightEyeVertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeNormals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(playerEyeColors), gl.STATIC_DRAW);
			gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(playerEyeIndices), gl.STATIC_DRAW);

			gl.drawElements(gl.TRIANGLES, playerEyeIndices.length, gl.UNSIGNED_SHORT, 0);
				
		}
		
		if(!jumping && ((plX == en1X && plY == en1Y) || (plX == en2X && plY == en2Y))) {
			dotArray  = labyrinth.map(inner => inner.slice());
			dotArray[8][7] = 1;
			
			halfSphereTranslationMatrices[0] = identityMatrix.slice();
			halfSphereTranslationMatrices[1] = identityMatrix.slice();
			
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 1, 0]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 1, 0]);
			
			glMatrix.mat4.lookAt(viewMatrix, cameraPosition, [0, 0, 0], [1, 0, 0]);
			glMatrix.mat4.multiply(viewMatrix, viewMatrix, shearMatrix)
			
			enemyCylinderTranslationMatrices[0] = identityMatrix.slice();
			enemyHalfSphereTranslationMatrices[0] = identityMatrix.slice();
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[0], enemyCylinderTranslationMatrices[0], [enemy1StartX, 0, enemy1StartY]);
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[0], enemyHalfSphereTranslationMatrices[0], [enemy1StartX, 1, enemy1StartY]);
			
			enemyHalfSphereTranslationMatrices[1] = identityMatrix.slice();
			enemyCylinderTranslationMatrices[1] = identityMatrix.slice();
			glMatrix.mat4.translate(enemyCylinderTranslationMatrices[1], enemyCylinderTranslationMatrices[1], [enemy2StartX, 0, enemy2StartY]);
			glMatrix.mat4.translate(enemyHalfSphereTranslationMatrices[1], enemyHalfSphereTranslationMatrices[1], [enemy2StartX, 1, enemy2StartY]);
			
			pressedUp = false;
			pressedDown = false;
			pressedLeft = false;
			pressedRight = false;
			
			up = false;
			down = false;
			right = false;
			left = false;
			
			jumpingUp = false;
			jumpingDown = false;
			jumpingProgress = 0;
			jumping = false;
			
			pointCounter = 0;
			document.getElementById("pointCounter").innerHTML = pointCounter;
			
			backgroundMusicStarted = false;
			backgroundMusic.currentTime = 0;
			backgroundMusic.pause();
			
			loseSound.play();
		}
				
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
	document.onkeydown = function(event) {
		var key_press = String.fromCharCode(event.keyCode);
		
		if(event.keyCode == 67) {
			if(cameraSelected)
				cameraSelected = false;
			else
				cameraSelected = true;
		}
		
	}
		
	window.addEventListener("keydown", checkKeyPress, false);
	
	function checkKeyPress(key) {

		if(cameraSelected) {
			if (key.keyCode == "39") { //Arrow right
					glMatrix.mat4.translate(viewMatrix, viewMatrix, [-0.1, 0, 0]);
					cameraPosition = [cameraPosition[0] + 0.1, cameraPosition[1], cameraPosition[2]];
				}
				if (key.keyCode == "37") { //Arrow left
					glMatrix.mat4.translate(viewMatrix, viewMatrix, [0.1, 0, 0]);
					cameraPosition = [cameraPosition[0] - 0.1, cameraPosition[1], cameraPosition[2]];
				}
				if (key.keyCode == "38") { //Arrow up
					glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, -0.1, 0]);
					cameraPosition = [cameraPosition[0], cameraPosition[1] + 0.1, cameraPosition[2]];
				}
				if (key.keyCode == "40") { //Arrow down
					glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0.1, 0]);
					cameraPosition = [cameraPosition[0], cameraPosition[1] - 0.1, cameraPosition[2]];
				}
				if (key.keyCode == "188") { //Comma
					glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, -0.1]);
					cameraPosition = [cameraPosition[0], cameraPosition[1], cameraPosition[2] + 0.1];
				}
				if (key.keyCode == "190") { //Point
					glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, 0.1]);
					cameraPosition = [cameraPosition[0], cameraPosition[1], cameraPosition[2] - 0.1];
				}
		}
	
		if(!cameraSelected) {
		
			if (key.keyCode == "38" && !jumping) { //Arrow up
				pressedUp = true;
				pressedDown = false;
				pressedLeft = false;
				pressedRight = false;
			}
			
			if (key.keyCode == "40" && !jumping) { //Arrow down
				pressedUp = false;
				pressedDown = true;
				pressedLeft = false;
				pressedRight = false;
			}
		
			if (key.keyCode == "37" && !jumping) { //Arrow left

				pressedUp = false;
				pressedDown = false;
				pressedLeft = true;
				pressedRight = false;
			}
		
			if (key.keyCode == "39" && !jumping) { //Arrow right
				pressedUp = false;
				pressedDown = false;
				pressedLeft = false;
				pressedRight = true;
			}
		
			if (key.keyCode == "32" && !jumping) { //Space bar
				jumping = true;
				jumpingUp = true;
				jumpSound.play();
			}

			if (key.keyCode == "38" || key.keyCode == "40" || key.keyCode == "37" || key.keyCode == "37" || key.keyCode == "39" || key.keyCode == "32" || !backgroundMusicStarted) { 
				backgroundMusicStarted = true;
				backgroundMusic.volume = 0.5;
				backgroundMusic.play();
			}
			
		}
	}
};