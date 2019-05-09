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
	
	var groundPlaneVertices = [
		32, 0, 32,
		32, 0, -32,
		-32, 0, -32,
		-32, 0, 32
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
	
	const numberOfSpheres = 1;
	
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
	
	var lightPosition = [0, 20, 0];
	var cameraPosition = [0, 30, 0];
	
	//Create uniform matrices
	var globalRotationMatrix = new Float32Array(16);
	glMatrix.mat4.identity(globalRotationMatrix);
	
	var scalingMatrices = [];
	var rotationMatrices = [];
	var translationMatrices = [];
	
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	
	for(var i = 0; i < numberOfSpheres; i++) {
		scalingMatrices.push(identityMatrix.slice());
		rotationMatrices.push(identityMatrix.slice());
		translationMatrices.push(identityMatrix.slice());
	}
	
	for(var i = 0; i < numberOfSpheres; i++) {
		glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [4*i, 0, 0]);
	}

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

	
	

	
	

	
	var selectedSphere = 0;
	var allSpheresSelected = false;
	var cameraSelected = false;
	var lightSelected = false;
	var capsLock = false;
	
	var loop = function () {
		
		gl.clearColor(0.9, 0.9, 0.9, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);
		
		var globalRotationMatrixUniformLocation = gl.getUniformLocation(program, 'globalRotationMatrix');
		var scalingMatrixUniformLocation = gl.getUniformLocation(program, 'scalingMatrix');
		var rotationMatrixUniformLocation = gl.getUniformLocation(program, 'rotationMatrix');
		var translationMatrixUniformLocation = gl.getUniformLocation(program, 'translationMatrix');
		var viewMatrixUniformLocation = gl.getUniformLocation(program, 'viewMatrix');
		var projectionMatrixUniformLocation = gl.getUniformLocation(program, 'projectionMatrix');
		var ambientColorUniformLocation = gl.getUniformLocation(program, 'ambientColor');
		var diffuseColorUniformLocation = gl.getUniformLocation(program, 'diffuseColor');
		var specularColorUniformLocation = gl.getUniformLocation(program, 'specularColor');
		var lightPositionUniformLocation = gl.getUniformLocation(program, 'lightPosition');
		var cameraPositionUniformLocation = gl.getUniformLocation(program, 'cameraPosition');
						
		gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
		gl.uniformMatrix4fv(globalRotationMatrixUniformLocation, gl.FALSE, globalRotationMatrix);
		gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, scalingMatrices[0]);
		gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, rotationMatrices[0]);
		gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, translationMatrices[0]);
		gl.uniform3fv(ambientColorUniformLocation, ambientColor);
		gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
		gl.uniform3fv(specularColorUniformLocation, specularColor);
		gl.uniform3fv(lightPositionUniformLocation, lightPosition);
		gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
				
		//Draw sphere
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


		//Draw ground plane
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
		

		
		
		
		
	
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
	document.onkeydown = function(event) {
		var key_press = String.fromCharCode(event.keyCode);
		if(event.keyCode == 67) {
			if(cameraSelected) {
				cameraSelected = false;
			} else { 
				cameraSelected = true;
				lightSelected = false;
			}
				
		}
		
		if(event.keyCode == 76) {
			if(lightSelected) {
				lightSelected = false;
			} else {
				lightSelected = true;
				cameraSelected = false;
			}
		}
		
		if(key_press == "0") {
			if(allSpheresSelected) {
				allSpheresSelected = false;
			} else {
				allSpheresSelected = true;
				lightSelected = false;
				cameraSelected = false;
			}
		}
		if(key_press == "1") {
			selectedSphere = 0;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "2") {
			selectedSphere = 1;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "3") {
			selectedSphere = 2;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "4") {
			selectedSphere = 3;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "5") {
			selectedSphere = 4;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}	
		if(key_press == "6") {
			selectedSphere = 5;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "7") {
			selectedSphere = 6;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "8") {
			selectedSphere = 7;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}
		if(key_press == "9") {
			selectedSphere = 8;
			allSpheresSelected = false;
			lightSelected = false;
			cameraSelected = false;
		}	
		
	}
	
	window.addEventListener("keyup", function(event) {
		  if (event.getModifierState("CapsLock")) {
			capsLock = true;
		  } else {
			capsLock = false;
		  }
	});
	
	window.addEventListener("keydown", checkKeyPress, false);
	
	function checkKeyPress(key) {

		
		if(lightSelected) {
			//Translation of camera
			if (key.keyCode == "39") { //Arrow right
				lightPosition = [lightPosition[0] + 1, lightPosition[1], lightPosition[2]];
			}
			if (key.keyCode == "37") { //Arrow left
				lightPosition = [lightPosition[0] - 1, lightPosition[1], lightPosition[2]];
			}
			if (key.keyCode == "38") { //Arrow up
				lightPosition = [lightPosition[0], lightPosition[1] + 1, lightPosition[2]];
			}
			if (key.keyCode == "40") { //Arrow down
				lightPosition = [lightPosition[0], lightPosition[1] - 1, lightPosition[2]];
			}
			if (key.keyCode == "188") { //Comma
				lightPosition = [lightPosition[0], lightPosition[1], lightPosition[2] + 1];
			}
			if (key.keyCode == "190") { //Point
				lightPosition = [lightPosition[0], lightPosition[1], lightPosition[2] - 1];
			}
		}
	
		if(cameraSelected) {
			//Translation of camera
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
	
		if(!allSpheresSelected && !cameraSelected && !lightSelected) {
			//Translation
			if (key.keyCode == "39") { //Arrow right
				glMatrix.mat4.translate(translationMatrices[selectedSphere], translationMatrices[selectedSphere], [0.1, 0, 0]);
			}
			if (key.keyCode == "37") { //Arrow left
				glMatrix.mat4.translate(translationMatrices[selectedSphere], translationMatrices[selectedSphere], [-0.1, 0, 0]);
			}
			if (key.keyCode == "38") { //Arrow up
				glMatrix.mat4.translate(translationMatrices[selectedSphere], translationMatrices[selectedSphere], [0, 0.1, 0]);
			}
			if (key.keyCode == "40") { //Arrow down
				glMatrix.mat4.translate(translationMatrices[selectedSphere], translationMatrices[selectedSphere], [0, -0.1, 0]);
			}
			if (key.keyCode == "188") { //Comma
				glMatrix.mat4.translate(translationMatrices[selectedSphere], translationMatrices[selectedSphere], [0, 0, 0.1]);
			}
			if (key.keyCode == "190") { //Point
				glMatrix.mat4.translate(translationMatrices[selectedSphere], translationMatrices[selectedSphere], [0, 0, -0.1]);
			}

			//Scaling
			if(key.keyCode == "88" || key.keyCode == "89" || key.keyCode == "90") {
				if (capsLock && key.keyCode == "88") { //X key
					glMatrix.mat4.scale(scalingMatrices[selectedSphere], scalingMatrices[selectedSphere], [1.1, 1, 1]);
				}
				if (!capsLock && key.keyCode == "88") { //x key
					glMatrix.mat4.scale(scalingMatrices[selectedSphere], scalingMatrices[selectedSphere], [0.9, 1, 1]);
				}
				if (capsLock && key.keyCode == "89") { //Y key
					glMatrix.mat4.scale(scalingMatrices[selectedSphere], scalingMatrices[selectedSphere], [1, 1.1, 1]);
				}
				if (!capsLock && key.keyCode == "89") { //y key
					glMatrix.mat4.scale(scalingMatrices[selectedSphere], scalingMatrices[selectedSphere], [1, 0.9, 1]);
				}
				if (capsLock && key.keyCode == "90") { //Z key
					glMatrix.mat4.scale(scalingMatrices[selectedSphere], scalingMatrices[selectedSphere], [1, 1, 1.1]);
				}
				if (!capsLock && key.keyCode == "90") { //z key
					glMatrix.mat4.scale(scalingMatrices[selectedSphere], scalingMatrices[selectedSphere], [1, 1, 0.9]);
				}				
			}
		
			//Rotation
			if(key.keyCode == "87" || key.keyCode == "83" || key.keyCode == "69" || key.keyCode == "81" || key.keyCode == "68" || key.keyCode == "65") {						
				if (key.keyCode == "87") { //w key		
					glMatrix.mat4.rotate(rotationMatrices[selectedSphere], rotationMatrices[selectedSphere], -0.1, [1, 0, 0]);
				}				
				if (key.keyCode == "83") { //s key				
					glMatrix.mat4.rotate(rotationMatrices[selectedSphere], rotationMatrices[selectedSphere], 0.1, [1, 0, 0]);
				}				
				if (key.keyCode == "81") { //e key		
					glMatrix.mat4.rotate(rotationMatrices[selectedSphere], rotationMatrices[selectedSphere], -0.1, [0, 1, 0]);
				}				
				if (key.keyCode == "69") { //q key				
					glMatrix.mat4.rotate(rotationMatrices[selectedSphere], rotationMatrices[selectedSphere], 0.1, [0, 1, 0]);
				}
				if (key.keyCode == "68") { //d key		
					glMatrix.mat4.rotate(rotationMatrices[selectedSphere], rotationMatrices[selectedSphere], -0.1, [0, 0, 1]);
				}				
				if (key.keyCode == "65") { //a key				
					glMatrix.mat4.rotate(rotationMatrices[selectedSphere], rotationMatrices[selectedSphere], 0.1, [0, 0, 1]);
				}						
			}
		}
		
		if(allSpheresSelected && !cameraSelected && !lightSelected) {
			//Translation
			if(key.keyCode == "39" || key.keyCode == "37" || key.keyCode == "38" || key.keyCode == "40" || key.keyCode == "188" || key.keyCode == "190") {
				for(var i = 0; i < numberOfSpheres; i++) {
					if (key.keyCode == "39") { //Arrow right
							glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [0.1, 0, 0]);
					}
					if (key.keyCode == "37") { //Arrow left
							glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [-0.1, 0, 0]);				
					}
					if (key.keyCode == "38") { //Arrow up
							glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [0, 0.1, 0]);				
					}
					if (key.keyCode == "40") { //Arrow down
							glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [0, -0.1, 0]);				
					}
					if (key.keyCode == "188") { //Comma			
							glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [0, 0, 0.1]);
					}
					if (key.keyCode == "190") { //Point
							glMatrix.mat4.translate(translationMatrices[i], translationMatrices[i], [0, 0, -0.1]);
					}
				}
			}
			
			//Scaling
			if(key.keyCode == "88" || key.keyCode == "89" || key.keyCode == "90") {
				for(var i = 0; i < numberOfSpheres; i++) {
					if (capsLock && key.keyCode == "88") { //X key
						glMatrix.mat4.scale(scalingMatrices[i], scalingMatrices[i], [1.1, 1, 1]);	
					}
					if (!capsLock && key.keyCode == "88") { //x key
						glMatrix.mat4.scale(scalingMatrices[i], scalingMatrices[i], [0.9, 1, 1]);
					}
					if (capsLock && key.keyCode == "89") { //Y key
						glMatrix.mat4.scale(scalingMatrices[i], scalingMatrices[i], [1, 1.1, 1]);
					}
					if (!capsLock && key.keyCode == "89") { //y key
						glMatrix.mat4.scale(scalingMatrices[i], scalingMatrices[i], [1, 0.9, 1]);
					}
					if (capsLock && key.keyCode == "90") { //Z key
						glMatrix.mat4.scale(scalingMatrices[i], scalingMatrices[i], [1, 1, 1.1]);
					}
					if (!capsLock && key.keyCode == "90") { //z key
						glMatrix.mat4.scale(scalingMatrices[i], scalingMatrices[i], [1, 1, 0.9]);
					}
				}
			}

			//Rotation
			if(key.keyCode == "87" || key.keyCode == "83" || key.keyCode == "69" || key.keyCode == "81" || key.keyCode == "68" || key.keyCode == "65") {
				if (key.keyCode == "87") { //w key		
					glMatrix.mat4.rotate(globalRotationMatrix, globalRotationMatrix, -0.1, [1, 0, 0]);
				}
				if (key.keyCode == "83") { //s key				
					glMatrix.mat4.rotate(globalRotationMatrix, globalRotationMatrix, 0.1, [1, 0, 0]);
				}
				if (key.keyCode == "81") { //e key		
					glMatrix.mat4.rotate(globalRotationMatrix, globalRotationMatrix, -0.1, [0, 1, 0]);
				}
				if (key.keyCode == "69") { //q key				
					glMatrix.mat4.rotate(globalRotationMatrix, globalRotationMatrix, 0.1, [0, 1, 0]);
				}
				if (key.keyCode == "68") { //d key		
					glMatrix.mat4.rotate(globalRotationMatrix, globalRotationMatrix, -0.1, [0, 0, 1]);
				}
				if (key.keyCode == "65") { //a key				
					glMatrix.mat4.rotate(globalRotationMatrix, globalRotationMatrix, 0.1, [0, 0, 1]);
				}			
			}
		}
	}
};



