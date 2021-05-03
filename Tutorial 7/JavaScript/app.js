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
var camaraAndar = {x:0, y:0, z:0};
var velocidadeAndar = 0.05;

var objetoImportado;
var mixerAnimacao;
var relogio = new THREE.Clock();
var importer = new THREE.FBXLoader();

importer.load('./Objetos/Samba Dancing.fbx', function(object) {

    mixerAnimacao = new THREE.AnimationMixer(object);
    var action = mixerAnimacao.clipAction(object.animations[0]);
    action.play();

    object.traverse(function(child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.recieveShadow = true;
        }
    });

    cena.add(object);

    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;

    object.position.x = 3;

    objetoImportado = object;
});

document.addEventListener('mousemove', ev =>{
    var x = (ev.clientX - 0) / (window.innerWidth - 0) * (1 - (-1)) + -1;
    var y = (ev.clientY - 0) / (window.innerHeight -0) * (1 - (-1)) + -1;

    cuboCoordRotation = {x:x, y:y};
});

document.addEventListener('keydown', ev =>{
    var coords = {x:0, y:0, z:0};
    
    if (ev.keyCode == 87)
        coords.z -= velocidadeAndar;

    if (ev.keyCode == 83)
        coords.z += velocidadeAndar;

    if (ev.keyCode == 65)
        coords.x -= velocidadeAndar;

    if (ev.keyCode == 68)
        coords.x += velocidadeAndar;

    // Desafio 1
    if (ev.keyCode == 32)
        criarNovoCubo();

    camaraAndar = coords;
});

document.addEventListener('keyup', ev =>{
    var coords = {x:0, y:0, z:0};
    
    if (ev.keyCode == 87)
        coords.z += velocidadeAndar;

    if (ev.keyCode == 83)
        coords.z -= velocidadeAndar;

    if (ev.keyCode == 65)
        coords.x += velocidadeAndar;

    if (ev.keyCode == 68)
        coords.x -= velocidadeAndar;

    camaraAndar = coords;
});


function Start() {
    cena.add(cubo);

    var light = new THREE.SpotLight('#ffffff', 1);
    light.position.x = 5;
    light.position.z = 10;
    light.lookAt(cubo.position);
    cena.add(light);

    camara.position.z = 6;

    //bonecoDeNeve(); //Desafio 2

    requestAnimationFrame(update);
}

function update() {
    
    if (cuboCoordRotation != null) {
        cubo.rotation.x += cuboCoordRotation.y * 0.1;
        cubo.rotation.y += cuboCoordRotation.x * 0.1;
    }

    if (camaraAndar != null) {
        camara.position.x += camaraAndar.x;
        camara.position.z += camaraAndar.z;
    }

    if (mixerAnimacao) {
        mixerAnimacao.update(relogio.getDelta());
    }

    camaraAndar = {x:0, y:0, z:0};
    renderer.render(cena, camara);
    requestAnimationFrame(update);
}

// Desafio 1
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

// Desafio 2
function bonecoDeNeve() {
    var matBranco = new THREE.MeshBasicMaterial({color : 0xffffff});
    var matVermelho = new THREE.MeshBasicMaterial({color : 0xff0000});
    var matPreto = new THREE.MeshBasicMaterial({color : 0x000000});

    var geoCabeca = new THREE.SphereGeometry(0.4, 40, 40);
    var cabeca = new THREE.Mesh(geoCabeca, matBranco);
    cabeca.translateX(-3);
    cabeca.translateY(1);
    cena.add(cabeca);


    var geoCorpo = new THREE.SphereGeometry(0.8, 40, 40);
    var corpo = new THREE.Mesh(geoCorpo, matBranco);
    corpo.translateX(-3);
    corpo.translateY(-0.18);
    cena.add(corpo);

    var geoOlho = new THREE.SphereGeometry(0.07, 40, 40);
    var olhoEsq = new THREE.Mesh(geoOlho, matPreto);
    olhoEsq.translateX(-3);
    olhoEsq.translateY(1);
    olhoEsq.translateZ(0.4);
    cena.add(olhoEsq);

    var olhoDir = olhoEsq.clone();
    olhoDir.translateX(0.35);
    cena.add(olhoDir);

    //var geoBoca = new THREE.RingGeometry(0.08, 0.15, 15, 10, 3.14, 3.14);
    var geoBoca = new THREE.TorusGeometry(0.11, 0.035, 16, 16, -3.14);
    var boca = new THREE.Mesh(geoBoca, matVermelho);
    boca.translateX(-2.8);
    boca.translateY(0.87);
    boca.translateZ(0.45);
    cena.add(boca);
}