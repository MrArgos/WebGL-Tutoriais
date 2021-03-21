/**
 * Função que devolve a matriz de visualização
 * @param {float[3]} rightVector Array direita da câmara
 * @param {float[3]} upVector Array cima da câmara
 * @param {float[3]} forwardVector Array frente da câmara
 * @param {float[3]} centerPoint Array com a posição da câmara em coordenadas mundo
 */
function MatrizVisualizacao(rightVector, upVector, forwardVector, centerPoint) {
    return [
        [rightVector[0],    rightVector[1],     rightVector[2],     -math.multiply(rightVector,centerPoint)],
        [upVector[0],       upVector[1],        upVector[2],        -math.multiply(upVector,centerPoint)],
        [forwardVector[0],  forwardVector[1],   forwardVector[2],   -math.multiply(forwardVector,centerPoint)],
        [0,                 0,                  0,                  1]
    ];
}

/**
 * Função que devolve a matriz de projeção ortográfica
 * @param {float} width Comprimento da câmara que deve ser renderizada
 * @param {float} height Altura da câmara que deve ser renderizada
 * @param {float} nearPlane Plano de corte anterior da câmara
 * @param {float} farPlane Plano de corte posterior da câmara
 */
function MatrizOrtografica(width, height, nearPlane, farPlane) {
    var matrizOrtografica = [
        [1/width,   0,          0,                              0],
        [0,         1/height,   0,                              0],
        [0,         0,          1/((farPlane/2)-nearPlane),     -nearPlane/((farPlane/2)-nearPlane)],
        [0,         0,          0,                              1]
    ];

    return math.multiply(matrizOrtografica, CriarMatrizTranslacao(0,0,-(nearPlane + farPlane / 2)));
}

/**
 * Função que devolve a matriz de projeção em perspetiva
 * @param {float} distance Disância do centro a que a imagem deve ser renderizada
 * @param {float} width Comprimento da câmara
 * @param {float} height Altura da câmara
 * @param {float} nearPlane Plano de corte anterior da câmara
 * @param {float} farPlane Plano de corte posterior da câmara
 */
function MatrizPerspetiva(distance, width, height, nearPlane, farPlane) {
    return [
        [distance/width,    0,                  0,                                  0],
        [0,                 distance/height,    0,                                  0],
        [0,                 0,                  farPlane/(farPlane-nearPlane),      -nearPlane*farPlane/(farPlane-nearPlane)],
        [0,                 0,                  1,                                  0]
    ];
}

/**
 * @param {float} minX Valor mínimo do volume canónico no eixo do X
 * @param {float} maxX Valor máximo do volume canónico no eixo do X
 * @param {float} minY Valor mínimo do volume canónico no eixo do Y
 * @param {float} maxY Valor máximo do volume canónico no eixo do Y
 */
function MatrizViewport(minX, maxX, minY, maxY) {
    return [
        [(maxX - minX)/2,   0,                  0,      (maxX + minX)/2],
        [0,                 (maxY - minY)/2,    0,      (maxY + minY)/2],
        [0,                 0,                  1,      0],
        [0,                 0,                  0,      1]
    ];
}