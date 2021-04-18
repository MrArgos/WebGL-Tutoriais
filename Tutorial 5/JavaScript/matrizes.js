/**
 * Devolve um 2D array com matriz de translação pedida
 * @param {float} x - Valor para a translação X
 * @param {float} y - Valor para a translação Y
 * @param {float} z - Valor para a translação Z 
 */
function CriarMatrizTranslacao(x,y,z) {
    // Matriz Translação final
    return[
        [1,  0,  0,  x],
        [0,  1,  0,  y],
        [0,  0,  1,  z],
        [0,  0,  0,  1]
    ];
}

/**
 * Devolve um 2D array com matriz de escala pedida
 * @param {float} x Valor para a escala X
 * @param {float} y Valor para a escala Y
 * @param {float} z Valor para a escala Z 
 */
function CriarMatrizEscala(x,y,z) {
    // Matriz de escala final
    return[
        [x,  0,  0,  0],
        [0,  y,  0,  0],
        [0,  0,  z,  0],
        [0,  0,  0,  1]
    ];
}

/**
 * @param {float} angulo ângulo em graus para rodar no eixo X
 */
function CriarMatrizRotacaoX(angulo) {
    // Seno e cosseno são calculados em radianos, logo é necessário converter de graus para radianos
    var radianos = angulo * Math.PI/180;
    
    // Matriz final de rotaçao no eixo X
    return[
        [1,      0,                         0,                      0],
        [0,      Math.cos(radianos),       -Math.sin(radianos),     0],
        [0,      Math.sin(radianos),        Math.cos(radianos),     0],
        [0,      0,                         0,                      1]
    ];
}

/**
 * @param {float} angulo ângulo em graus para rodar no eixo Y
 */
 function CriarMatrizRotacaoY(angulo) {
    var radianos = angulo * Math.PI/180;
    
    // Matriz final de rotaçao no eixo Y
    return[
        [Math.cos(radianos),       0,       Math.sin(radianos),      0],
        [0,                        1,       0,                       0],
        [-Math.sin(radianos),      0,       Math.cos(radianos),      0],
        [0,                        0,       0,                       1]
    ];
}

/**
 * @param {float} angulo ângulo em graus para rodar no eixo Z
 */
function CriarMatrizRotacaoZ(angulo) {
    var radianos = angulo * Math.PI/180;
    
    // Matriz final de rotaçao no eixo Z
    return[
        [Math.cos(radianos),      -Math.sin(radianos),      0,      0],
        [Math.sin(radianos),       Math.cos(radianos),      0,      0],
        [0,                        0,                       1,      0],
        [0,                        0,                       0,      1]
    ];
}
