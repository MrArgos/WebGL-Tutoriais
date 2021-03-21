// Código correspondente ao vertex shader
var codigoVertexShader = [
    'precision mediump float;', // indica qual a precisao do tipo float
    'attribute vec3 vertexPosition;', // Variavel readonly do tipo vec3 que indica a posiçao de um vertice
    'attribute vec3 vertexColor;', // readonly vec3 que indica a cor de um vertice
    'varying vec3 fragColor;', // Variavel que serve de interface entre o vertex shader e o fragment shader
    'void main(){', // Dizemos ao fragmnet shader qual a cor do vertice
    '   fragColor = vertexColor;',
    // gl_Position é uma variavel própria do Shader que indica a posição do vértice
    // Esta variável é do tipo vec4 e a variável vertexPosition é do tipo vec3
    // Por esta razão temos que colocar 1.0 como último elemento
    '   gl_Position = vec4(vertexPosition, 1.0);',
    '}'
].join('\n');

// código correspondete ao fragment shader

var codigoFragmentShader = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    'void main(){',
    // gl_FragColor é uma variável própria do Shader que indica qual a cor do vértice
    // Esta variável é do tipo vec4 e a variável fragColor é do tipo vec3.
    // Por esta razão temos de colocar 1.0 como último elemento
    '   gl_FragColor = vec4(fragColor,1.0);',
    '}'
].join('\n');