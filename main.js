function main() {
	
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
	
	var pressedUp = false;
	var pressedDown = true;
	var pressedLeft = false;
	var pressedRight = false;
			
	var leftEyeVertices = [
		-0.3500000238418579,
		0.3999999761581421,
		0.9000000953674316,
		-0.20781731605529785,
		0.4989203214645386,
		0.9999942779541016,
		-0.21919190883636475,
		0.4369772672653198,
		1.0454440116882324,
		-0.2504720687866211,
		0.3697164058685303,
		1.0684552192687988,
		-0.2959705591201782,
		0.3067816495895386,
		1.06740140914917,
		-0.3500000238418579,
		0.25781726837158203,
		1.0406560897827148,
		-0.4040294885635376,
		0.23160219192504883,
		0.9914054870605469,
		-0.4495279788970947,
		0.23122775554656982,
		0.9284634590148926,
		-0.4808081388473511,
		0.254963755607605,
		0.8614544868469238,
		-0.49218273162841797,
		0.3010796308517456,
		0.8000059127807617,
		-0.4808081388473511,
		0.36302268505096436,
		0.7545561790466309,
		-0.4495279788970947,
		0.4302835464477539,
		0.7315449714660645,
		-0.4040294885635376,
		0.4932183027267456,
		0.7325987815856934,
		-0.3500000238418579,
		0.5421826839447021,
		0.7593441009521484,
		-0.2959705591201782,
		0.5683977603912354,
		0.8085947036743164,
		-0.2504720687866211,
		0.5687720775604248,
		0.8715367317199707,
		-0.21919190883636475,
		0.5450360774993896,
		0.9385457038879395
	];

	var rightEyeVertices = [
		-0.3500000238418579,
		-0.2999999523162842,
		0.9000000953674316,
		-0.5094282627105713,
		-0.2285773754119873,
		0.8026275634765625,
		-0.5042612552642822,
		-0.3006542921066284,
		0.774162769317627,
		-0.4755765199661255,
		-0.3722519874572754,
		0.7650547027587891,
		-0.42895209789276123,
		-0.4335278272628784,
		0.7752246856689453,
		-0.3699667453765869,
		-0.4746396541595459,
		0.8045940399169922,
		-0.30778658390045166,
		-0.4878089427947998,
		0.8492283821105957,
		-0.252376914024353,
		-0.4722435474395752,
		0.9013767242431641,
		-0.21091341972351074,
		-0.4320716857910156,
		0.9533286094665527,
		-0.19057178497314453,
		-0.37142252922058105,
		0.9973726272583008,
		-0.19573867321014404,
		-0.29934561252593994,
		1.0258374214172363,
		-0.22442352771759033,
		-0.22774791717529297,
		1.0349454879760742,
		-0.2710479497909546,
		-0.16647207736968994,
		1.024775505065918,
		-0.3300333023071289,
		-0.12536025047302246,
		0.9954061508178711,
		-0.39221346378326416,
		-0.11219096183776855,
		0.9507718086242676,
		-0.4476231336593628,
		-0.12775635719299316,
		0.8986234664916992,
		-0.4890866279602051,
		-0.16792821884155273,
		0.8466715812683105
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
		
	var playerEyeNormals = [
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0
	];
	
	var playerEyeColors = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];
		

	
	
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
	
	const dotColors = 
	[
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,

		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,

		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,

		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, 1.0, 0.0
	];
	
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
	
	var latLongCount = 4; // Count of latitudes and longitudes

	var size = 0.9;
	
	for (var i = 0; i <= latLongCount; i++) {	//Create vertices and the indices for the halfSphere
		for (var j = 0; j <= latLongCount; j++) {
		
			var theta = i * Math.PI / latLongCount;
			var phi = j * 2 * Math.PI/2 / latLongCount;

			halfSphereVertices.push(Math.sin(theta) * Math.cos(phi)*size);
			halfSphereVertices.push(Math.cos(theta) * Math.cos(phi)*size);
			halfSphereVertices.push(Math.sin(phi)*size);
			
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
	
	for (var i = 0; i <= latLongCount; i++) {
		for (var j = 0; j <= latLongCount; j++) {
		halfSphereIndices.push(halfSphereVertices.length);
		halfSphereIndices.push(i * (latLongCount + 1) + j + 2 + latLongCount);
		halfSphereIndices.push(i * (latLongCount + 1) + j + 1);
		}
	}
	
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
	
	var playerStanding = false;
	
	var up = false;
	var down = false;
	var left = false;
	var right = false;
		
	var loop = function () {
	
		playerX = parseInt((halfSphereTranslationMatrices[0][14] + 16)/2);
		playerY = parseInt(-(halfSphereTranslationMatrices[0][12] - 18)/2);
		
		plX = parseInt((halfSphereTranslationMatrices[0][14] + 16)/2 - 0.5);
		plY = parseInt(-(halfSphereTranslationMatrices[0][12] - 18)/2 - 0.5);
		
		//console.log("playerX= " + playerX)
		//console.log("playerY= " + playerY)
		
		//console.log("plX= " + plX)
		//console.log("plY= " + plY)
		

		
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
		
		
		
		//Draw ground plane
		gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
		gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, identityMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, groundPlaneRotationMatrix);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, groundPlaneTranslationMatrix);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
		gl.uniform3fv(ambientColorUniformLocation, ambientColor);
		gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
		gl.uniform3fv(specularColorUniformLocation, specularColor);
		gl.uniform3fv(lightPositionUniformLocation, lightPosition);
		gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
		
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
		gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
		gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholePlayerRotationMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, halfSphereRotationMatrices[1]);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, halfSphereTranslationMatrices[1]);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
		gl.uniform3fv(ambientColorUniformLocation, ambientColor);
		gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
		gl.uniform3fv(specularColorUniformLocation, specularColor);
		gl.uniform3fv(lightPositionUniformLocation, lightPosition);
		gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
		
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
		gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
		gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholePlayerRotationMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, halfSphereRotationMatrices[1]);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, halfSphereTranslationMatrices[1]);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
		gl.uniform3fv(ambientColorUniformLocation, ambientColor);
		gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
		gl.uniform3fv(specularColorUniformLocation, specularColor);
		gl.uniform3fv(lightPositionUniformLocation, lightPosition);
		gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
		
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
		
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0.5, 0, 0]);				
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0.5, 0, 0]);	
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [-0.5, 0, 0]);
		}

		if (down) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [-0.5, 0, 0]);				
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [-0.5, 0, 0]);	
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [0.5, 0, 0]);
		}

		if (left) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 0, -0.5]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 0, -0.5]);
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, 0.5]);
		}

		if (right) {
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 0, 0.5]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 0, 0.5]);
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, -0.5]);
		}
		
		
		//Draw halfSpheres
		for(var i = 0; i < 2; i++) {
			gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
			gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
			gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, wholePlayerRotationMatrix);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, halfSphereRotationMatrices[i]);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, halfSphereTranslationMatrices[i]);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
			gl.uniform3fv(ambientColorUniformLocation, ambientColor);
			gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
			gl.uniform3fv(specularColorUniformLocation, specularColor);
			gl.uniform3fv(lightPositionUniformLocation, lightPosition);
			gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
					
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
					
					gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
					gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
					gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, cubeTranslationMatrices[i][j]);
					gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniform3fv(ambientColorUniformLocation, ambientColor);
					gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
					gl.uniform3fv(specularColorUniformLocation, specularColor);
					gl.uniform3fv(lightPositionUniformLocation, lightPosition);
					gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
							
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
					
					gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
					gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
					gl.uniformMatrix4fv(wholePlayerRotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, dotTranslationMatrices[i][j]);
					gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, dotScalingMatrix);
					gl.uniform3fv(ambientColorUniformLocation, ambientColor);
					gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
					gl.uniform3fv(specularColorUniformLocation, specularColor);
					gl.uniform3fv(lightPositionUniformLocation, lightPosition);
					gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
							
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

		dotArray[plY][plX] = 1;
		
		var allDotsEaten = true;
		
		for(var i = 0; i < dotArray.length; i++) {
			for(var j = 0; j < dotArray[0].length; j++) {
				if(dotArray[i][j] == 0) {
					allDotsEaten = false;
					console.log("AAAAAAAAAAAAAAA")
					break;
				}
			}
		}

		
		if(allDotsEaten) {
		
			dotArray  = labyrinth.map(inner => inner.slice());
			
			halfSphereTranslationMatrices[0] = identityMatrix.slice();
			halfSphereTranslationMatrices[1] = identityMatrix.slice();
			
			glMatrix.mat4.translate(halfSphereTranslationMatrices[0], halfSphereTranslationMatrices[0], [0, 1, 0]);
			glMatrix.mat4.translate(halfSphereTranslationMatrices[1], halfSphereTranslationMatrices[1], [0, 1, 0]);
			
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
	
	window.addEventListener("keyup", function(event) {

	});
	
	window.addEventListener("keydown", checkKeyPress, false);
	
	function checkKeyPress(key) {


	
		if(!cameraSelected) {
		
			if (key.keyCode == "38") { //Arrow up
				pressedUp = true;
				pressedDown = false;
				pressedLeft = false;
				pressedRight = false;
			}
			
			if (key.keyCode == "40") { //Arrow down
				pressedUp = false;
				pressedDown = true;
				pressedLeft = false;
				pressedRight = false;
			}
		
			if (key.keyCode == "37") { //Arrow left

				pressedUp = false;
				pressedDown = false;
				pressedLeft = true;
				pressedRight = false;
			}
		
			if (key.keyCode == "39") { //Arrow right
				pressedUp = false;
				pressedDown = false;
				pressedLeft = false;
				pressedRight = true;
			}
			
		}
	}
};



