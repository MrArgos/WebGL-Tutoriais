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

// Localização das variáveis matrizes de visualização, projeção e viewport
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

function PrepareCanvas() {
    
    GL.clearColor(0.65,0.65,0.65,1);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);
    document.body.appendChild(canvas);
    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto! - João Costa al59259');
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
    var triangleArray = [
        //   X        Y       Z       R       G       B                          3
            -0.5,    -0.5,    0.0,    1.0,    0.0,    0.0, // Vértice 1 ->      / \
             0.5,    -0.5,    0.0,    0.0,    1.0,    0.0, // Vértice 2 ->     /   \
             0.0,     0.5,    0.0,    0.0,    0.0,    1.0  // vértice 3 ->    1 - - 2
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);

    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(triangleArray),
        GL.STATIC_DRAW
    );
}

function SendDataToShaders() {
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        vertexColorAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(vertexColorAttributeLocation);

    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');

    // Buscar a localização das variáveis ao vertexShader
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

    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5,0.5,0), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoY(rotationAngle), finalMatrix);

    /* Desafios Tutorial 2
    // Desafio 1
    finalMatrix = math.multiply(CriarMatrizEscala(3,3,3), finalMatrix);
    // Desafio 2
    finalMatrix = math.multiply(CriarMatrizTranslacao(-0.25,-0.75,0), finalMatrix);
    // Desafio 3
    finalMatrix = math.multiply(CriarMatrizRotacaoX(rotationAngle), finalMatrix);
    */

    // Foi adicionada esta transformação para podermos mexer na posição do objeto no eixo do Z
    finalMatrix = math.multiply(CriarMatrizTranslacao(0,0,1), finalMatrix);

    var newarray= [];
    for (let i = 0; i < finalMatrix.length; i++) {
        newarray = newarray.concat(finalMatrix[i]);
    }

    /* Utilizando a função MatrizVisualizacao vamos passar os parametros normais dos eixos e colocar
       a câmara no x=0, y=0 e z=0 do mundo. 
       Mais uma vez, é necessário converter o array de 2 dimensões para um array de 1 dimensão.
    */
    var visualizationMatrix = MatrizVisualização([1,0,0],[0,1,0],[0,0,1],[0,0,0]);
    var newVisualizationMatrix = [];
    for (i = 0; i < visualizationMatrix.length; i++) {
        newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
    }

    /* Utilizando a função MatrizPerspetiva vamos passar os parametros de distancia=10, comprimento da 
       camara de 4 unidades, altura 3 unidades, plano anterior de 0.1 unidades e plano posterior de 100 unidades. 
       Mais uma vez, é necessário converter o array de 2 dimensões para um array de 1 dimensão.
    */
    var projectionMatrix = MatrizPerspetiva([10,4,3,0.1,100]);
    var newProjectionMatrix = [];
    for (i = 0; i < projectionMatrix.length; i++) {
        newProjectionMatrix = newProjectionMatrix.concat(projectionMatrix[i]);
    }

    /* Utilizando a função MatrizViewport vamos passar os parametros do volume canónico do webGL.
       O volume canónico do webGL tem os valores de x, y, z compreendidos entre -1 e 1. 
       Mais uma vez, é necessário converter o array de 2 dimensões para um array de 1 dimensão.
    */
       var viewportMatrix = MatrizViewport(-1,1,-1,1);
       var newViewportMatrix = [];
       for (i = 0; i < viewportMatrix.length; i++) {
           newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
       }

    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);

    // Passar os arrays relativos às matrizes de visualização, projeção e viewport para o vertexShader
    GL.uniformMatrix4fv(visualizationMatrixLocation, false, newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false, newProjectionMatrix);
    GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);

    GL.drawArrays(GL.TRIANGLES,0,3);
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