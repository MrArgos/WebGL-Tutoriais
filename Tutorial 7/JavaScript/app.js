document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();
var camara = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);
document.body.appendChild(renderer.domElement);
var geometria = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshStandardMaterial({color : 0xff0000});
var cubo = new THREE.Mesh(geometria, material);
var cuboCoordRotation;
var velocidadeAndar = 0.05;

var objetoImportado;
var mixerAnimacao;
var relogio = new THREE.Clock();
var importer = new THREE.FBXLoader();
var luzObjeto;

importer.load('./Objetos/Samba Dancing.fbx', function (object) {

    mixerAnimacao = new THREE.AnimationMixer(object);
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.recieveShadow = true;
        }
    });

    cena.add(object);

    object.scale.x = 0.01;
    object.scale.z = 0.01;
    object.scale.y = 0.01;

    object.position.x = 3;

    objetoImportado = object;
});

document.addEventListener('mousemove', ev =>{
    var x = (ev.clientX - 0) / (window.innerWidth - 0) * (1 - (-1)) + -1;
    var y = (ev.clientY - 0) / (window.innerHeight -0) * (1 - (-1)) + -1;

    cuboCoordRotation = {x:x, y:y};
});

document.addEventListener('keydown', ev =>{
    
    // Desafio 1 - translate do objetoImportado quando for premida uma tecla
    if (ev.keyCode == 87)
        objetoImportado.translateZ(-0.1);

    if (ev.keyCode == 83)
        objetoImportado.translateZ(0.1);

    if (ev.keyCode == 65)
        objetoImportado.translateX(-0.1);

    if (ev.keyCode == 68)
        objetoImportado.translateX(0.1);

    if (ev.keyCode == 32)
        criarNovoCubo();

});

function Start() {
    cena.add(cubo);

    // Desafio 2 - mudar cor da luz para #0000ff (azul)
    var light = new THREE.SpotLight('#0000ff', 1);
    light.position.x = 5;
    light.position.z = 10;

    light.lookAt(cubo.position);

    cena.add(light);

    luzObjeto = light;
    camara.position.z = 6;

    requestAnimationFrame(update);
}

function update() {
    
    if (cuboCoordRotation != null) {
        cubo.rotation.x += cuboCoordRotation.y * 0.1;
        cubo.rotation.y += cuboCoordRotation.x * 0.1;
    }

    if (mixerAnimacao) {
        mixerAnimacao.update(relogio.getDelta());
    }

    // Desafio 3 - apontar luz para objeto
    if(objetoImportado != null)
    {
        luzObjeto.lookAt(objetoImportado.position);
    }

    renderer.render(cena, camara);
    requestAnimationFrame(update);
}

function criarNovoCubo() {
    var novaCor = new THREE.Color(0xffffff);
    novaCor.setHex(Math.random() * 0xffffff);
    var novoMat = new THREE.MeshBasicMaterial({color : novaCor});
    var novoCubo = new THREE.Mesh(geometria, novoMat);
    novoCubo.translateX(THREE.Math.randFloat(-6,6));
    novoCubo.translateY(THREE.Math.randFloat(-6,6));
    novoCubo.translateZ(THREE.Math.randFloat(-10,3));
    cena.add(novoCubo);
}