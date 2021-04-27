document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();
var camara = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);

document.body.appendChild(renderer.domElement);

var geometria = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0xff0000});
var cubo = new THREE.Mesh(geometria, material);

var cuboCoordRotation;
var camaraAndar = {x:0, y:0, z:0};
var velocidadeAndar = 0.05;

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
    camara.position.z = 6;
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

    camaraAndar = {x:0, y:0, z:0};
    renderer.render(cena, camara);
    requestAnimationFrame(update);
}