var codigoVertexShader = [
    'precision mediump float;',
    'attribute vec3 vertexPosition;',
    'attribute vec3 vertexColor;',
    'varying vec3 fragColor;',

    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;',    // Matriz de Visualização
    'uniform mat4 projectionMatrix;',       // Matriz de Projeção
    'uniform mat4 viewportMatrix;',         // Matriz de Viewport

    'void main(){',
    '   fragColor = vertexColor;',
    // Depois da transformação geométrica é necessário multiplicar pelas matrizes de visualização, projeção e viewport
    '   gl_Position = vec4(vertexPosition, 1.0) * transformationMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;',
    '}'
].join('\n');

var codigoFragmentShader = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    'void main(){',
    '   gl_FragColor = vec4(fragColor,1.0);',
    '}'
].join('\n');