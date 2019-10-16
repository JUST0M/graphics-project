//import * as THREE from './three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();
const ROOM_SIZE = 10;
const CUBE_SIZE = 1;
const SAFE_ROOM_AREA = ROOM_SIZE - CUBE_SIZE;
const MAX_XYZ = SAFE_ROOM_AREA / 2;
const FAST_SPEED = 4;
const SLOW_SPEED  = 0.5;
const CUBE_CLOSENESS_THRESHOLD = 0.03;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// FLOOR

const floorGeometry = new THREE.BoxGeometry( ROOM_SIZE, ROOM_SIZE, 0.01 );
const floorMaterial = new THREE.MeshBasicMaterial( { color: 0x999999 } );
const floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
floorMesh.position.z = -5;
scene.add( floorMesh );

// CEILING
const ceilingGeometry = new THREE.BoxGeometry( ROOM_SIZE, ROOM_SIZE, 0.01 );
const ceilingMaterial = new THREE.MeshBasicMaterial( { color: 0x999999 } );
const ceilingMesh = new THREE.Mesh( ceilingGeometry, ceilingMaterial );
ceilingMesh.position.z = 5;
scene.add( ceilingMesh );

// RIGHT GREEN WALL
const rightWallGeometry = new THREE.BoxGeometry( 0.01, ROOM_SIZE, ROOM_SIZE );
const rightWallMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const rightWallMesh = new THREE.Mesh( rightWallGeometry, rightWallMaterial );
rightWallMesh.position.x = 5;
scene.add( rightWallMesh );


// LEFT RED WALL
const leftWallGeometry = new THREE.BoxGeometry( 0.01, ROOM_SIZE, ROOM_SIZE );
const leftWallMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const leftWallMesh = new THREE.Mesh( leftWallGeometry, leftWallMaterial );
leftWallMesh.position.x = -5;
scene.add( leftWallMesh );


// FAR WALL
const farWallGeometry = new THREE.BoxGeometry( ROOM_SIZE, 0.01, ROOM_SIZE );
const farWallMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const farWallMesh = new THREE.Mesh( farWallGeometry, farWallMaterial );
farWallMesh.position.y = 5;
farWallMesh.position.z = 0;
scene.add( farWallMesh );

// CLOSE WALL
const closeWallGeometry = new THREE.BoxGeometry( ROOM_SIZE, 0.01, ROOM_SIZE );
const closeWallMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const closeWallMesh = new THREE.Mesh( closeWallGeometry, closeWallMaterial );
closeWallMesh.position.y = -5;
closeWallMesh.position.z = 0;
scene.add( closeWallMesh );

// CUBE
const geometry = new THREE.BoxGeometry( CUBE_SIZE, CUBE_SIZE, CUBE_SIZE );
const material = new THREE.MeshBasicMaterial( { color: 0x00bfff } );
const cube = new THREE.Mesh( geometry, material );
cube.rotation.x = Math.PI / 2;
scene.add( cube );

// TARGET CUBE
const geo = new THREE.EdgesGeometry( geometry );
const targetCubeMat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
const targetCube= new THREE.LineSegments( geo, targetCubeMat );
function moveTargetCube() {
    targetCube.position.x = (Math.random() * SAFE_ROOM_AREA) - SAFE_ROOM_AREA / 2;
    targetCube.position.y = (Math.random() * SAFE_ROOM_AREA) - SAFE_ROOM_AREA / 2;
    targetCube.position.z = (Math.random() * SAFE_ROOM_AREA) - SAFE_ROOM_AREA / 2;
}
moveTargetCube();
scene.add( targetCube );

camera.position.y = -5;
camera.rotation.order = "YZX";
camera.lookAt(0, 0, 0);

let moveForward = false;
let moveBack = false;
let moveRight = false;
let moveLeft = false;
let moveUp = false;
let moveDown = false;
let mouseX = 0; let mouseY = 0;
let objToMove = camera;
let movementSpeed = FAST_SPEED;
let fKeyDown = false;
let cKeyDown = false;
let movingCam = true;
document.onkeydown = function(event) {
    const keyCode = event.code;
    if (keyCode == "KeyW") moveForward = true;
    else if (keyCode == "KeyS") moveBack = true;
    else if (keyCode == "KeyD") moveRight = true;
    else if (keyCode == "KeyA") moveLeft = true;
    else if (keyCode == "Space") moveUp = true;
    else if (keyCode == "ShiftLeft") moveDown = true;
    else if (keyCode == "KeyC" && !cKeyDown) {
        if (movingCam) {
            objToMove = cube;
            movingCam = false;
        } else {
            objToMove = camera;
            movingCam = true;
        }
        cKeyDown = true;
    }
    // toggle slow movement speed
    else if (keyCode == "KeyF" && !fKeyDown) {
        movementSpeed = movementSpeed === SLOW_SPEED ? FAST_SPEED : SLOW_SPEED;
        fKeyDown = true;
    }
};
document.onkeyup = function(event) {
    const keyCode = event.code;
    if (keyCode == "KeyW") moveForward = false;
    else if (keyCode == "KeyS") moveBack = false;
    else if (keyCode == "KeyD") moveRight = false;
    else if (keyCode == "KeyA") moveLeft = false;
    else if (keyCode == "Space") moveUp = false;
    else if (keyCode == "ShiftLeft") moveDown = false;
    else if (keyCode == "KeyF") fKeyDown = false;
    else if (keyCode == "KeyC") cKeyDown = false;
};

/*document.onmousemove = function (event) {
    mouseX = ( event.clientX / renderer.domElement.clientWidth ) * 2 + 1;
    mouseY = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    camera.rotation.x = mouseY / scale;
    camera.rotation.y = mouseX / scale;
};*/

function cubeOnTarget() {
    return(
        Math.abs(cube.position.x - targetCube.position.x) < CUBE_CLOSENESS_THRESHOLD &&
        Math.abs(cube.position.y - targetCube.position.y) < CUBE_CLOSENESS_THRESHOLD &&
        Math.abs(cube.position.z - targetCube.position.z) < CUBE_CLOSENESS_THRESHOLD
    )
}

function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    const moveDistance = movementSpeed * delta; // movementSpeed pixels per second
    // could be neater
    /*
    if (moveForward) objToMove.position.y += (moveDistance);
    if (moveBack) objToMove.position.y -= moveDistance;
    if (moveRight) objToMove.position.x += moveDistance;
    if (moveLeft) objToMove.position.x -= moveDistance;
    if (moveUp) objToMove.position.z += moveDistance;
    if (moveDown) objToMove.position.z -= moveDistance;
     */
    /*
    console.log(Math.abs(objToMove.position.z));
    if (moveForward && objToMove.position.y < SAFE_AREA / 2) objToMove.translateZ(-moveDistance);
    if (moveBack && objToMove.position.y > -SAFE_AREA / 2) objToMove.translateZ(moveDistance);
    if (moveRight && objToMove.position.x < SAFE_AREA / 2) objToMove.translateX(moveDistance);
    if (moveLeft && objToMove.position.x > -SAFE_AREA / 2) objToMove.translateX(-moveDistance);
    if (moveUp && objToMove.position.z < SAFE_AREA / 2) objToMove.translateY(moveDistance);
    if (moveDown && objToMove.position.z > -SAFE_AREA / 2) objToMove.translateY(-moveDistance);
     */
    if (cubeOnTarget()) moveTargetCube();

    if (moveForward) objToMove.translateZ(-moveDistance);
    if (moveBack) objToMove.translateZ(moveDistance);
    if (moveRight) objToMove.translateX(moveDistance);
    if (moveLeft) objToMove.translateX(-moveDistance);
    if (moveUp) objToMove.translateY(moveDistance);
    if (moveDown) objToMove.translateY(-moveDistance);

    // Constrain to box
    objToMove.position.x = Math.max(Math.min(objToMove.position.x, MAX_XYZ), -MAX_XYZ);
    objToMove.position.y = Math.max(Math.min(objToMove.position.y, MAX_XYZ), -MAX_XYZ);
    objToMove.position.z = Math.max(Math.min(objToMove.position.z, MAX_XYZ), -MAX_XYZ);


    camera.rotation.z -= mouseX / 1000;
    camera.rotation.x -= mouseY / 1000;
    camera.rotation.y = 0;

    mouseX = 0; mouseY = 0;

    renderer.render( scene, camera );
    //console.log(mouseX);
    //console.log(mouseY);
}

const element = document.body;
element.requestPointerLock = element.requestPointerLock ||
    element.mozRequestPointerLock ||
    element.webkitRequestPointerLock;
// Ask the browser to lock the pointer
element.onclick = function() {
    element.requestPointerLock();
};

// Ask the browser to release the pointer
document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock;
//document.exitPointerLock();

// Hook pointer lock state change events
document.addEventListener('pointerlockchange', changeCallback, false);
document.addEventListener('mozpointerlockchange', changeCallback, false);
document.addEventListener('webkitpointerlockchange', changeCallback, false);

// Hook mouse move events
document.addEventListener("mousemove", moveCallback, false);

function changeCallback(event) {
    if (document.pointerLockElement === event.requestedElement ||
        document.mozPointerLockElement === event.requestedElement ||
        document.webkitPointerLockElement === event.requestedElement) {
        // Pointer was just locked
        // Enable the mousemove listener
        document.addEventListener("mousemove", moveCallback, false);
    } else {
        // Pointer was just unlocked
        // Disable the mousemove listener
        document.removeEventListener("mousemove", moveCallback, false);
        this.unlockHook(this.element);
    }
}

function moveCallback(event) {
    mouseX = event.movementX ||
        event.mozMovementX          ||
        event.webkitMovementX       ||
        0;
    mouseY = event.movementY ||
        event.mozMovementY      ||
        event.webkitMovementY   ||
        0;
}

// lock pointer


animate();
