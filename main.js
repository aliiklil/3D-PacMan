function main() {
	
	var canvas = document.getElementById('canvas');
	var gl = canvas.getContext('webgl');

	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	var program = gl.createProgram();
	
	//Phong specular
	var phongSpecularVertexShader = gl.createShader(gl.VERTEX_SHADER);
	var phongSpecularFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(phongSpecularVertexShader, document.getElementById("phongSpecularVertexShader").text);
	gl.shaderSource(phongSpecularFragmentShader, document.getElementById("phongSpecularFragmentShader").text);

	gl.compileShader(phongSpecularVertexShader);
	gl.compileShader(phongSpecularFragmentShader);
	
    gl.attachShader(program, phongSpecularVertexShader);
    gl.attachShader(program, phongSpecularFragmentShader);
    gl.linkProgram(program);

       //Use gouraud diffuse vertex and fragment shader
    gl.useProgram(program);
	
	
	
	const numberOfSpheres = 9;
	
	var sphereVertices = [];
	var sphereNormalsForVertices = [];
	var sphereIndices = [];
	
	var latLongCount = 30; // Count of latitudes and longitudes

	for (var i = 0; i <= latLongCount; i++) {	//Create vertices and the indices for the sphere
		for (var j = 0; j <= latLongCount; j++) {
		
			var theta = i * Math.PI / latLongCount;
			var phi = j * 2 * Math.PI / latLongCount;

			sphereVertices.push(Math.sin(theta) * Math.cos(phi));
			sphereVertices.push(Math.cos(theta) * Math.cos(phi));
			sphereVertices.push(Math.sin(phi));
			
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

	sphereNormalsForVertices = sphereVertices.slice(); // The normals and the vertices are the same for the sphere

	// Vertices for drawing the local coordinate system for the selected sphere
	const axisVertices = [
		0,0,0,
		2,0,0,
		0,0,0,
		0,2,0,
		0,0,0,
		0,0,2
	];			

	var ambientColor = [0.3, 0.1, 0.1];
	var diffuseColor = [0.5, 0.5, 0.5];
	var specularColor = [1.0, 1.0, 1.0];
	
	var lightPosition = [0, 10, 0];
	var cameraPosition = [16, 0, 15];
	
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
	var projectionMatrix = new Float32Array(16);
	
	glMatrix.mat4.lookAt(viewMatrix, cameraPosition, [16, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(90), 800 / 600, 0.1, 100);
	
	
	
	//Get location of attributes and set them
    var positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');
    var normalAttribLocation = gl.getAttribLocation(program, 'vertexNormal');

	var sphereVertexBuffer = gl.createBuffer();	
	var axisVertexBuffer = gl.createBuffer();
	
	var sphereNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormalsForVertices), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	

	var sphereIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(normalAttribLocation);
	
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
		

		for (var i = 0; i < numberOfSpheres; i++) { 
		
			//Draw sphere
			gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);
								
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

			gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
			gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
			gl.uniformMatrix4fv(globalRotationMatrixUniformLocation, gl.FALSE, globalRotationMatrix);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, scalingMatrices[i]);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, rotationMatrices[i]);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, translationMatrices[i]);
			gl.uniform3fv(ambientColorUniformLocation, ambientColor);
			gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
			gl.uniform3fv(specularColorUniformLocation, specularColor);
			gl.uniform3fv(lightPositionUniformLocation, lightPosition);
			gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
					
			gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);

			if(allSpheresSelected && !cameraSelected && !lightSelected) {
				//Draw local coordinate system axis for all spheres
				gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axisVertices), gl.STATIC_DRAW);

				gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

				gl.drawArrays(gl.LINES, 0, 6);
			}
			
		}
		
		//Draw local coordinate system axis for selected sphere only
		if(!allSpheresSelected && !cameraSelected && !lightSelected) {
			gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axisVertices), gl.STATIC_DRAW);
			
			gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	
			gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
			gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
			gl.uniformMatrix4fv(globalRotationMatrixUniformLocation, gl.FALSE, globalRotationMatrix);
			gl.uniformMatrix4fv(scalingMatrixUniformLocation, gl.FALSE, scalingMatrices[selectedSphere]);
			gl.uniformMatrix4fv(rotationMatrixUniformLocation, gl.FALSE, rotationMatrices[selectedSphere]);
			gl.uniformMatrix4fv(translationMatrixUniformLocation, gl.FALSE, translationMatrices[selectedSphere]);
			gl.uniform3fv(ambientColorUniformLocation, ambientColor);
			gl.uniform3fv(diffuseColorUniformLocation, diffuseColor);
			gl.uniform3fv(specularColorUniformLocation, specularColor);
			gl.uniform3fv(lightPositionUniformLocation, lightPosition);
			gl.uniform3fv(cameraPositionUniformLocation, cameraPosition);
			
			gl.drawArrays(gl.LINES, 0, 6);
		}
				
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
	
		//Gouraud diffuse
		if(key.keyCode == "85") {
				selectedShader = 0;
		}
		
		//Gouraud specular
		if(key.keyCode == "73") {
				selectedShader = 1;
		}
			
		//Phong diffuse
		if(key.keyCode == "79") {
				selectedShader = 2;
		}
			
		//Phong specular
		if(key.keyCode == "80") {
				selectedShader = 3;
		}
		
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



