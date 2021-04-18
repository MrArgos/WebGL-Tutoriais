var canvas = document.createElement('canvas');

canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();
var finalMatrixLocation;
var rotationAngle = 0;
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;
var vertexPosition;
var vertexIndex;
var gpuIndexBuffer = GL.createBuffer();

// guardar na memoria da GPU a textura a ser utilizada
var boxTexture = GL.createTexture();

function PrepareCanvas() {
    
    GL.clearColor(0.65,0.65,0.65,1);
    GL.clear(GL.DEPTH_BUFFER_BIT || GL.COLOR_BUFFER_BIT);

    GL.enable(GL.DEPTH_TEST);
    GL.enable(GL.CULL_FACE);

    document.body.appendChild(canvas);
    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto!');
}

function PrepareShaders() {
    GL.shaderSource(vertexShader, codigoVertexShader);
    GL.shaderSource(fragmentShader, codigoFragmentShader);
    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do vertex shader lançou uma excepção!",
        GL.getShaderInfoLog(vertexShader));
    }

    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do fragment shader lançou uma excepção!",
        GL.getShaderInfoLog(fragmentShader));
    }
}

function PrepareProgram() {
    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);

    GL.linkProgram(program);
    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
        console.error("ERRO :: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program));
    }

    GL.validateProgram(program);
    if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
        console.error("ERRO :: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program));
    }

    GL.useProgram(program);
}


function PrepareTriangleData() {
    vertexPosition = [
        //  X       Y       Z       U       V
        // Frente
            0,      0,      0,      0,      0,
            0,      1,      0,      0,      1,
            1,      1,      0,      1,      1,
            1,      0,      0,      1,      0,

        // Direita
            1,      0,      0,      0,      0,
            1,      1,      0,      1,      0,
            1,      1,      1,      1,      1,
            1,      0,      1,      0,      1,

        // Trás
            1,      0,      1,      1,      0,
            1,      1,      1,      1,      1,
            0,      1,      1,      0,      1,
            0,      0,      1,      0,      0,

        // Esquerda
            0,      0,      1,      0,      1,
            0,      1,      1,      1,      1,
            0,      1,      0,      1,      0,
            0,      0,      0,      0,      0,

        // Cima
            0,      1,      0,      0,      0,
            0,      1,      1,      0,      1,
            1,      1,      1,      1,      1,
            1,      1,      0,      1,      0,

        // Baixo
            1,      0,      0,      0,      0,
            1,      0,      1,      0,      1,
            0,      0,      1,      0,      1,
            0,      0,      0,      0,      0,
    ];

    vertexIndex = [
        // Frente
        0, 2, 1,
        0, 3, 2,

        // Direita
        4, 6, 5,
        4, 7, 6,
        
        // Trás
        8, 10, 9,
        8, 11, 10,

        // Esquerda
        12, 14, 13,
        12, 15, 14,

        // Cima
        16, 18, 17,
        16, 19, 18,

        // Baixo
        20, 22, 21,
        20, 23, 22,
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(vertexPosition),
        GL.STATIC_DRAW
    );

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(vertexIndex),
        GL.STATIC_DRAW
    );

    // Fazer bind à textura
    GL.bindTexture(GL.TEXTURE_2D, boxTexture);
    // Fazer Clmap à boarda do eixo do U
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    // Fazer Clamp à borda do eixo do V
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    // como escalar textura. (TEXTURE_MIN_FILTER) para diminuir e (TEXTURE_MAG_FILTER) para aumentar
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    // passar imagem que está no documento
    GL.texImage2D(
        GL.TEXTURE_2D,  // Tipo da Textura
        0,              // Detalhe da imagem (default 0)
        GL.RGBA,        // Tipo de imagem
        GL.RGBA,        // Tipo de textura que vai ser aplicada à imagem
        GL.UNSIGNED_BYTE,   // Tipo de valores da textura
        document.getElementById('boxImage') // imagem que deve ser passada para o sampler
    );
}

function SendDataToShaders() {
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var texCoordAttributeLocation = GL.getAttribLocation(program, "texCoords");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        texCoordAttributeLocation,
        2,
        GL.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(texCoordAttributeLocation);

    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');
    projectionMatrixLocation = GL.getUniformLocation(program, 'projectionMatrix');
    viewportMatrixLocation = GL.getUniformLocation(program, 'viewportMatrix');
}

function loop()
{
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 45;
    GL.viewport(0,0,canvas.width,canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65, 0.65, 0.65, 1);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoY(rotationAngle), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizTranslacao(0,-0.1,1), finalMatrix);
    

    var newarray= [];
    for (let i = 0; i < finalMatrix.length; i++) {
        newarray = newarray.concat(finalMatrix[i]);
    }

    var visualizationMatrix = MatrizVisualizacao([1,0,0],[0,1,0],[0,0,1],[0,0,0]);
    var newVisualizationMatrix = [];
    for (i = 0; i < visualizationMatrix.length; i++) {
        newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
    }

    var projectionMatrix = MatrizPerspetiva(10,4,3,0.1,100);
    var newProjectionMatrix = [];
    for (i = 0; i < projectionMatrix.length; i++) {
        newProjectionMatrix = newProjectionMatrix.concat(projectionMatrix[i]);
    }

    var viewportMatrix = MatrizViewport(-1,1,-1,1);
    var newViewportMatrix = [];
    for (i = 0; i < viewportMatrix.length; i++) {
        newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);
    GL.uniformMatrix4fv(visualizationMatrixLocation, false, newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false, newProjectionMatrix);
    GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);

    GL.drawElements(GL.TRIANGLES,vertexIndex.length,GL.UNSIGNED_SHORT,0);
    rotationAngle += 1;
    requestAnimationFrame(loop);
}

function Start() {
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();

    loop();
}
