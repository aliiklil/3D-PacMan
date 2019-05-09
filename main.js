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
				glMatrix.mat4.translate(cubeTranslationMatrices[i][j], cubeTranslationMatrices[i][j], [2*(labyrinth.length-1-i)-15.5, 1, 2*j-15.5]);
			}
		}
	}
	
	console.log(cubeTranslationMatrices)

	
	
	var sphereVertices = [];
	var sphereNormals = [];
	var sphereColors = [];
	var sphereIndices = [];
	
	var latLongCount = 30; // Count of latitudes and longitudes

	for (var i = 0; i <= latLongCount; i++) {	//Create vertices and the indices for the sphere
		for (var j = 0; j <= latLongCount; j++) {
		
			var theta = i * Math.PI / latLongCount;
			var phi = j * 2 * Math.PI / latLongCount;

			sphereVertices.push(Math.sin(theta) * Math.cos(phi));
			sphereVertices.push(Math.cos(theta) * Math.cos(phi));
			sphereVertices.push(Math.sin(phi));
			
			sphereColors.push(1, 1, 0);
			
			if (i < latLongCount && j < latLongCount) {
			
				sphereIndices.push(i * (latLongCount + 1) + j);
				sphereIndices.push(i * (latLongCount + 1) + j + 1);
				sphereIndices.push(i * (latLongCount + 1) + j + 1 + latLongCount);
				
				sphereIndices.push(i * (latLongCount + 1) + j + 2 + latLongCount);
				sphereIndices.push(i * (latLongCount + 1) + j + 1);
				sphereIndices.push(i * (latLongCount + 1) + j + 1 + latLongCount);
				
			}
		}
	}

	sphereNormals = sphereVertices.slice(); // The normals and the vertices are the same for the sphere

	var ambientColor = [0.5, 0.5, 0.5];
	var diffuseColor = [0.5, 0.5, 0.5];
	var specularColor = [0.1, 0.1, 0.1];
	
	var lightPosition = [0, 20, -20];
	var cameraPosition = [0, 20, 0];
	
	//Create uniform matrices
	var globalRotationMatrix = new Float32Array(16);
	glMatrix.mat4.identity(globalRotationMatrix);

	var sphereRotationMatrix = new Float32Array(16);
	var sphereTranslationMatrix = new Float32Array(16);
	
	glMatrix.mat4.identity(sphereRotationMatrix);
	glMatrix.mat4.identity(sphereTranslationMatrix);
	glMatrix.mat4.translate(sphereTranslationMatrix, sphereTranslationMatrix, [-1.5, 0, -1.5]);
	
	var viewMatrix = new Float32Array(16);
	var projectionMatrix = new Float32Array(16);
	
	glMatrix.mat4.lookAt(viewMatrix, cameraPosition, [0.01, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(90), 800 / 600, 0.1, 100);
	

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

	var loop = function () {
		
		gl.clearColor(0.9, 0.9, 0.9, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		
		var rotationMatrixUniformLocation = gl.getUniformLocation(program, 'rotationMatrix');
		var translationMatrixUniformLocation = gl.getUniformLocation(program, 'translationMatrix');
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
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, groundPlaneRotationMatrix);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, groundPlaneTranslationMatrix);
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
		
		
		
		
		
		
		
		
		
		
		

		//Draw sphere			
		gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, sphereRotationMatrix);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, sphereTranslationMatrix);
		gl.uniform3fv(ambientColorUniformLocation, ambientColor);
		gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
		gl.uniform3fv(specularColorUniformLocation, specularColor);
		gl.uniform3fv(lightPositionUniformLocation, lightPosition);
		gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
				
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereColors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);
		
		gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);


		
		
		//Draw cubes
		for(var i = 0; i < labyrinth.length; i++) {
			for(var j = 0; j < labyrinth[0].length; j++) {
				if(labyrinth[i][j] == 1) {
					
					gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
					gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
					gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, identityMatrix);
					gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, cubeTranslationMatrices[i][j]);
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
	
		if(cameraSelected) {
			//Translation of camera
			if (key.keyCode == "39") { //Arrow right
				glMatrix.mat4.translate(viewMatrix, viewMatrix, [-0.1, 0, 0]);
			}
			if (key.keyCode == "37") { //Arrow left
			glMatrix.mat4.translate(viewMatrix, viewMatrix, [0.1, 0, 0]);
			}
			if (key.keyCode == "38") { //Arrow up
				glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, -0.1, 0]);
			}
			if (key.keyCode == "40") { //Arrow down
				glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0.1, 0]);
			}
			if (key.keyCode == "188") { //Comma
				glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, -0.1]);
			}
			if (key.keyCode == "190") { //Point
				glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, 0.1]);
			}
		}
	
	
		
		//Translation
		if(!cameraSelected) {
			if (key.keyCode == "39") { //Arrow right
				glMatrix.mat4.translate(sphereTranslationMatrix, sphereTranslationMatrix, [0, 0, 0.1]);
			}
			if (key.keyCode == "37") { //Arrow left
				glMatrix.mat4.translate(sphereTranslationMatrix, sphereTranslationMatrix, [0, 0, -0.1]);
			}
			if (key.keyCode == "38") { //Arrow up
				glMatrix.mat4.translate(sphereTranslationMatrix, sphereTranslationMatrix, [0.1, 0, 0]);
			}
			if (key.keyCode == "40") { //Arrow down
			glMatrix.mat4.translate(sphereTranslationMatrix, sphereTranslationMatrix, [-0.1, 0, 0]);
			}
		}

	}
};



