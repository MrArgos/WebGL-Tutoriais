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
    canvas.insertAdjacentText('afterend', 'O canvas encontra-se acima deste texto! - João Costa al59259');
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

    // Verificar se o programa foi conectado corretamente e se pode ser utilizado
    GL.validateProgram(program);
    if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
        console.error("ERRO :: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program));
    }

    // Depois de tudo isto, é necessário dizer que queremos utilizar este program
    GL.useProgram(program);
}


// Função responsável por guardar a posição XYZ e cor RGB de cada um dos vértices do triangulo.
// Esta função é também responsável por copiar essa mesma informação para um buffer que se encontra na GPU.
function PrepareTriangleData() {
    // Variável que guardará os pontos de cada vértice (XYZ) bem como a cor de cada um deles (RGB)
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
        // (target) Tipo de buffer que estamos a utilizar
        GL.ARRAY_BUFFER,
        // (data) Dados que pretendemos passar para o buffer que se encontra na GPU.
        // Importante saber que no CPU os dados do tipo float utilizam 64bits mas na GPU só trabalha com
        // dados de 32bits. O JavaScript permite-nos converter floats de 64 para 32bits utilizando a funcao abaixo
        new Float32Array(triangleArray),
        // (usage) Este parametro indica que os dados que são passados não vão ser alterados dentro da GPU
        GL.STATIC_DRAW
    );
}

// Função responsável por pegar na informação que se encontra no gpuArrayBuffer
// e atribui-la ao vertex shader
function SendDataToShaders() {
    // Buscar a posição de cada uma das variáveeis dos shaders.
    // Se verificares o código dos shaders, é necessário passar informação 
    // para duas varáveis (vertexPosition e vertexColor) 
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor");

    // Esta função utiliza o último buffer que foi feito binding. Como podes ver pela função anterior
    // o último buffer ao qual foi feito bind foi o gpuArrayBuffer, logo ele vai buscar informação a esse
    // buffer e inserir essa informação no Vertex Shader. Vamos inserir os dados para a variável vertexPosition
    GL.vertexAttribPointer(
        // (index) Localização da variável na qual pretendemos inserir a informação. No nosso caso "vertexPosition"
        vertexPositionAttributeLocation,
        // (size) Número de elementos que vão ser usados pela variável. No nosso caso, a variável que vai utilizar
        // estes valores é do tipo vec3 (XYZ) logo são 3 elementos
        3,
        // (type) Tipo de objetos que estão nesse buffer. No nosso caso são FLOATs
        GL.FLOAT,
        // (normalized) Indica se os dados estão ou não normalizados. Para já este parametro pode ser false.
        false,
        // (stride) Indica qual o tamanho de objetos que constituem cada ponto do triângulo em bytes.
        // Cada ponto do triângulo é constituido por 6 valores (XYZ e RGB) e o array que está no buffer
        // é do tipo Float32Array. Float32Array tem uma propriedade que indica qual o nr de bytes que cada
        // elemento deste tipo usa. Basta multiplicar 6 pelo nr de bytes de um elemento.
        6 * Float32Array.BYTES_PER_ELEMENT,
        // (offset) Este parametro indica quantos elementos devem ser ignorados no inicio para chegar aos valores que
        // pretendemos utilizar. No nosso caso queremos utilizar os primeiros 3 elementos. Este valor também
        // é em bytes logo multiplicamps pelo nr de bytes de um Float32Array.
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    // Agora utilizando o mesmo método acima, vamos inserir os dados na variável vertexColor.
    // Se prestares atenção nos parametros desta função é bastante parecido com o método anterior, mudando apenas
    // a varável à qual pretendemos inserir os dados (vertexColor) e o último parâmetro (uma vez que pretendemos
    // ignorar os 3 primeiros valores que representam a posiçao XYZ de cada vértice)
    GL.vertexAttribPointer(
        vertexColorAttributeLocation,           // (index)
        3,                                      // (size)
        GL.FLOAT,                               // (type)
        false,                                  // (normalized)
        6 * Float32Array.BYTES_PER_ELEMENT,     // (stride)
        // (offset) O array tem 6 elementos (XYZRGB), neste caso so pretendemos utilizar os 3 ultimos (valores de cor)
        // por isso o offset é 3, ou seja, saltamos os 3 primeiros elementos do Array.
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    // Agora é necessário ativar os atributos que vão ser utilizados e para isso utilizamos a linha seguinte.
    // Temos de fazer isso para cada uma das variáveis que pretendemos utilizar.
    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(vertexColorAttributeLocation);

    // Indicar o programa a utilizar
    GL.useProgram(program);

    // Indica à GPU que pode desenhar
    GL.drawArrays(
        GL.TRIANGLES,   // (mode) Parâmetro que indica o tipo de objetos a desenhar
        0,              // (first) Qual o primeiro elemento a ser desenhado
        3               // (count) Quantos elementos devem ser desenhados
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