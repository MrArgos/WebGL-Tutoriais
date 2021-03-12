var canvas = document.createElement('canvas');

canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

// Variavel que guarda a localizacao da variavel 'transformationMatrix' do vertexShader (shader.js)
var finalMatrixLocation;

// Variavel que guarda a rotacao que deve ser aplicada ao objeto
var rotationAngle = 0;

function PrepareCanvas() {
    
    GL.clearColor(0.65,0.65,0.65,1);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);
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

    // Guarda a localizacao da variavel 'transformationMatrix' do vertexShader
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
}

// Funcao responsavel pela animação(no nosso caso rodar ao triangulo)
function loop()
{
    // Fazer resize ao canvas de modo a ajustar-se ao tamanho do browser
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 45;
    GL.viewport(0,0,canvas.width,canvas.height);

    // Dizer qual o programa a utilizar
    GL.useProgram(program);

    // a cada fram é necessario limpar os buffers de profundidade e de cor
    GL.clearColor(0.65, 0.65, 0.65, 1);
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    // Inicializacao da variavel que guarda a combinacao de matrizes que vaos er passadas para o vertexShader
    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    // A matriz final vai ser igual à multiplicaçao da matriz de translacao com a matriz final.
    // Esta matriz faz uma translacao de 0.5 unidades no eixo do X, 0.5 no eixo do Y e 0.0 em Z.
    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5,0.5,0), finalMatrix);

    // A matriz final vai ser igual a multiplicacao da matriz de escala com a matriz final.
    // Esta matriz faz uma modificacao na escala de 0.25 unidades em X, 0.25 em Y e 0.25 em Z
    // Isto quer dizer que o objeto vai ficar 4 vezes mais pequeno, sendo que para um objeto ter escala 
    // normal devera ter 1 unidade em todos os eixos
    finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25), finalMatrix);

    // A matriz dinal vai ser igual a multiplicacao da matriz de rotacao no eixo Y com a matriz final.
    // Esta matriz faz uma rotacao rotationAngle no eixo do Y
    finalMatrix = math.multiply(CriarMatrizRotacaoY(rotationAngle), finalMatrix);

    // Agora que ja temos a matriz final de transformacao, temos de converter de 2D array para um array
    // de uma dimensao. Para isso utilizamos o codigo a baixo.
    var newarray= [];
    for (let i = 0; i < finalMatrix.length; i++) {
        newarray = newarray.concat(finalMatrix[i]);
    }

    // Depois de termos o array de uma dimensao, temos de enviar essa matriz para o vertexShader.
    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);

    // Agora temos de mandar desenhar os triangulos
    GL.drawArrays(GL.TRIANGLES,0,3);

    // A cada frame é preciso atualizar o angulo de rotaçao
    rotationAngle += 1;

    // O código abaixo indica que no proximo frame tem que chamar a funcao
    // passada por parametro. No nosso caso é a mesma funçao, criando um loop de animacao
    requestAnimationFrame(loop);
}

function Start() {
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();

    // Quando acabar de preparar tudo chama a funcao loop
    loop();
}