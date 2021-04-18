var codigoVertexShader = [
    'precision mediump float;',
    'attribute vec3 vertexPosition;',
    //'attribute vec3 vertexColor;',
    'attribute vec2 texCoords;',
    //'varying vec3 fragColor;',
    'varying vec2 fragTexCoords;',

    'uniform mat4 transformationMatrix;',
    'uniform mat4 visualizationMatrix;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 viewportMatrix;',

    'void main(){',
    '   fragTexCoords = texCoords;',
    '   gl_Position = vec4(vertexPosition, 1.0) * transformationMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;',
    '}'
].join('\n');

var codigoFragmentShader = [
    'precision mediump float;',
    //'varying vec3 fragColor;',
    'varying vec2 fragTexCoords;',
    'uniform sampler2D sampler;',
    'void main(){',
    '   gl_FragColor = texture2D(sampler, fragTexCoords);',
    '}'
].join('\n');
