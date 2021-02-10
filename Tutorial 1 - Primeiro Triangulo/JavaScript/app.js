// A primeira coisa necessária é um elemento HTML do tipo canvas
var canvas = document.createElement('canvas');

// Em primeiro lugar temos de especificar o tamanho do canvas
// O tamanho do canvas vai ser o tamanho da janela (window)
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

// Para podermos trabalhar sobre WebGL é necessário termos a Bibliotaca Gráfica
// GL significa Graphic Library

var GL = canvas.getContext('webgl');

// Cirar o vertex shader. Este shader é chamado por cada vértice do objeto
// de modo a indicar quala posição do vértice
var vertexShader = GL.createShader(GL.VERTEX_SHADER);

// Criar o fragment shader. Este shader é chamado para todos os pixeis do objeto
// de modo a dar cor ao objeto.
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);


// Criar o programa que utilizará os shaders.
var program = GL.createProgram();

// Criar um buffer que está localizado na GPU para receber os pontos que
// os shaders irão utilizar.

var gpuArrayBuffer = GL.createBuffer();

// Função responsável por preparar o canvas
function PrepareCanvas() {
    
    // Indica a cor de fundo
    GL.clearColor(0.65,0.65,0.65,1);

    // Limpa is buffers de profundidade e de cir para aplicar a cor atribuida acima
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

    // Adiciona o canvas ao body do documento
    document.body.appendChild(canvas);

    // Depois do canvas adicionar um pequeno texto a dizer
    // que o canvas se encontraacima do texto
    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto!');
}

// Função responsável por preparar os shaders
function PrepareShaders() {
    // Atribui o código que está no ficheiro "shaders.js" ao vertexShader.
    GL.shaderSource(vertexShader, codigoVertexShader);

    // Atribui o código que está no ficheiro "shaders.js" ao fragmentShader.
    GL.shaderSource(fragmentShader, codigoFragmentShader);

    // Compila o shader passado por parâmetro
    GL.compileShader(vertexShader);
    GL.compileShader(fragmentShader);

    // Depois de compilados os shaders é necessário verificar se occoreu algum erro
    // durante a compilação. Para o fragment shader usamos o código abaixo.
    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do vertex shader lançou uma excepção!",
        GL.getShaderInfoLog(vertexShader));
    }

    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do fragment shader lançou uma excepção!",
        GL.getShaderInfoLog(fragmentShader));
    }
}

// Função responsável por preparar o Programa que irá correr sobre a GPU
function PrepareProgram() {
    // Depois de teres os shaders criados e compilados é necessário dizeres ao program
    // para utilizar esses mesmos shaders. Para isso utilizamos o código seguinte.
    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);

    // Agora que já tribuiste os shaders, é necessário dizeres à GPU que acabaste de
    // configurar o program. Uma boa prática é verificar se existe algum erro no program.
    GL.linkProgram(program);
    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
        console.error("ERRO :: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program));
    }

    GL.validateProgram(program);
    if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
        console.error("ERRO :: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program));
    }

    // Depois de tudo isto, é necessário dizer que queremos utilizar este program. Para isso
    // utilizamos o seguinte código
    GL.useProgram(program);
}


// Função responsável por guardar a posição XYZ e cor RGB de cada um dos vértices do triangulo.
// Esta função é também responsável por copiar essa mesma informação para um buffer que se encontra na GPU.
function PrepareTriangleData() {
    // Variável que quardará os ponstes de cada vértice (XYZ) bem como a cor de cada um deles (RGB)
    // Nesta variável, cada vértice é constituido por 6 elementos.
    // A área do canvas vai de -1 a 1 tanto em altura como em largura
    // com centro no meio da área do canvas. O código RGB tem valores entre 0.0 e 1.0
    var triangleArray = [
        //   X        Y       Z       R       G       B                          3
            -0.5,    -0.5,    0.0,    1.0,    0.0,    0.0, // Vértice 1 ->      / \
             0.5,    -0.5,    0.0,    0.0,    1.0,    0.0, // Vértice 2 ->     /   \
             0.0,     0.5,    0.0,    0.0,    0.0,    1.0  // vértice 3 ->    1 - - 2
    ];

    // Indicar à GPU que o gpuArrayBuffer é do tipo ARRAY_BUFFER
    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);

    // copia o array que acabamos de criar (triangleArray)
    // para o buffer que está localizado na GPU (gpuArrayBuffer)
    GL.bufferData(
        // Tipo de buffer que estamos a utilizar
        GL.ARRAY_BUFFER,
        // Dados que pretendemos passar para o buffer que se encontra na GPU.
        // Importante saber que no cPU os dados do tipo float utilizam 64bits mas na GPU só trabalha com
        // dados de 32bits. O JavaScript permite-nos converter floats de 64 para 32bits utilizando a funcao abaixo
        new Float32Array(triangleArray),
        // Este parametro indica que os dados que são passados não vão ser alterados dentro da GPU
        GL.STATIC_DRAW
    );
}

// Função responsável por pegar na informação que se encontra no gpuArrayBuffer
// e atribui-la ao vertex shader

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

    GL.useProgram(program);

    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );
}


// Função chamada quando a página é carregada na totalidade
function Start() {
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
}