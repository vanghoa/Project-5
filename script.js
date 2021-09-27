/*  import { PLYLoader } from './node_modules/three/examples/jsm/loaders/PLYLoader.js';
    import {OrbitControls} from '../node_modules/three/examples/js/controls/OrbitControls.js';
    import * as THREE from '../node_modules/three/build/three.js';
    import {DragControls} from '../node_modules/three/examples/js/controls/DragControls.js';    */
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/DragControls.js';
import { PLYLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js';
//import * as dat from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js';

let objectionxoay = [];
let objectiondrag = [];
let soanchor = 5;
let anchortong = new THREE.Object3D();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Board Kiem tra
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = 0xdddddd;

//environment
scene.background = new THREE.Color(0xcbf4ba);

// Objects
const geometry = new THREE.BoxGeometry(.5, .5, .5);

/**
 * Camera
 */
// Base camera
let aspect = sizes.width / sizes.height;
const frustum = 10;
const camerakhoangcach = 30;
const camera = new THREE.OrthographicCamera(-aspect * frustum, aspect * frustum, frustum, -frustum, 1, 1000)

// Controls Orbit
const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

camera.position.set(0,0,camerakhoangcach);

camera.lookAt(0,0,0);
scene.add(camera);
controls.update()


// Materials
const verybasicmat = new THREE.MeshBasicMaterial( {
	color: 0x000000,
    transparent: true,
    opacity: 0.5
} );

const sangbongmat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, 
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    transmission: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0,
})

// Mesh

// OBJLoad 
let amb = {
    //sound: objectload('static/sound container.ply', sangbongmat, true)
};

let anchor = [];

// Mat Phang
const planesz = 20;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(planesz, planesz), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide}));
const planewire = new THREE.Mesh(new THREE.PlaneGeometry(planesz, planesz), new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}));
const planegroup = new THREE.Group().add(plane).add(planewire);
planegroup.rotateX(-Math.PI/2);
planegroup.position.set(0,-1-frustum/2,0);

scene.add(planegroup);


// Anchor Container
for (let dem = -2; dem <= soanchor - 3; dem++) {
    anchor.push(wireframeload('static/hop-nhoo.ply', 'static/hop-to-nap.ply', verybasicmat, false, dem*4,-.5,0))
}

let boundinganchor = new THREE.Box3().setFromObject(anchortong);
anchortong.position.set(0,-frustum/2,0);
scene.add(anchortong);



//// Light 2

const pointLight2 = new THREE.PointLight(0x000ff, 8)
pointLight2.position.set(0.85,0.48,0.48);
//scene.add(pointLight2);

//const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, .3);
//scene.add(pointLightHelper2);

//const light2 = gui.addFolder('Light 2');

//light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
//light2.add(pointLight2.position, 'x').min(-6).max(3).step(0.01);
//light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
//light2.add(pointLight2, 'intensity').min(0).max(20).step(1);

//const light2color = {
//    color: 0xff0000
//}

//light2.addColor(light2color, 'color').onChange(() => {
//    pointLight2.color.set(light2color.color);
//}) 

//// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .3 );
scene.add( ambient );

//// DirLight1
const light = new THREE.DirectionalLight(0xFFFFFF, 30);
light.position.set(-1, 2, 4);
scene.add(light);


///////////////////////////////////////////////////////////

/**
 * Sizes
 */

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    aspect = sizes.width / sizes.height;

    // Update camera
    camera.left = -aspect * frustum;
    camera.right = aspect * frustum;
    camera.top = frustum;
    camera.bottom = -frustum;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xe5e5e5);










/**
 * Animate
 */


///////////////////////////////////////////////////////////
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    objectionxoay.forEach((obj) => {
        obj.rotation.y = .5 * elapsedTime;
    });

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)




    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

/////////////////////////////////////////////////////////// DRAG
/**/ 
const controldrag = new DragControls(objectiondrag, camera, canvas);
//controldrag.transformGroup = true;














// add event listener to highlight dragged objects

controldrag.addEventListener( 'dragstart', function ( event ) {
    
	event.object.material.transparent = false;
    controls.enabled = false;

} );

controldrag.addEventListener( 'dragend', function ( event ) {

	event.object.material.transparent = true;
    controls.enabled = true;


} );

/**
 * OBJLoad
 */
function objectload(link, vatlieu, xoayornot) {
    let loader = new PLYLoader()

    loader.load(link, (objfile) => {
        //let objmesh = new THREE.Mesh(objfile, material);
        //objfile.traverse( function ( child ) {
            //if (child.isMesh) {
                //child.material = new THREE.MeshPhysicalMaterial({
                    //color: 0xffffff, 
                    //metalness: 0,
                    //roughness: 0,
                    //reflectivity: 1,
                    //transparent: true,
                    //emissive: 0,
                    //transmission: 1.0,
                    //side: THREE.DoubleSide,
                    //clearcoat: 1.0,
                    //clearcoatRoughness: 0,
                    //fog: true  
                //});
            //}
        //})
        //scene.add(objfile);
        //console.log(objectiondrag.length);

        objfile.computeVertexNormals();

        let meshobj = new THREE.Mesh(objfile, vatlieu);

        meshobj.position.set(0,-.5,0);

        scene.add(meshobj);
        if (xoayornot) { objectionxoay.push(meshobj); }

        objectiondrag.push(meshobj);

        return meshobj;
    });
}


function wireframeload(linkhop, linknap, vatlieu, xoayornot, diemx, diemy, diemz) {
    let loader = new PLYLoader()
    const matwire = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    let meshtrunggian = new THREE.Object3D();
    let meshcontainer = new THREE.Object3D();
    let meshobjhop;
    let meshobjwirehop;
    let meshobjnap;
    let meshobjwirenap;

    loader.load(linknap, (objfile) => {
        objfile.computeVertexNormals();
        meshobjnap = new THREE.Mesh(objfile, matwire);
        meshobjwirenap = new THREE.Mesh(objfile, vatlieu);

        //meshobjnap.position.y = 1;
        meshobjwirenap.position.y = .3;

        meshobjwirenap.add(meshobjnap);
        meshtrunggian.add(meshobjwirenap);


        //meshcontainer.add(meshgroupnap);

    });

    loader.load(linkhop, (objfile) => {
        objfile.computeVertexNormals();
        meshobjhop = new THREE.Mesh(objfile, matwire);
        meshobjwirehop = new THREE.Mesh(objfile, vatlieu);

        meshobjhop.add(meshtrunggian);
        meshobjwirehop.add(meshobjhop);
        meshcontainer.add(meshobjwirehop);

        //meshcontainer.add(meshgrouphop);

    });


    meshcontainer.position.set(diemx,diemy,diemz);

    if (xoayornot) { objectionxoay.push(meshcontainer); }
    objectiondrag.push(meshcontainer);

    anchortong.add(meshcontainer);

    return meshcontainer;
}
/**
 * Change View Mode
 */
document.querySelector('#rotx').addEventListener('click', function(){
    camera.position.set(camerakhoangcach, 0, 0);
    camera.updateProjectionMatrix();
    controls.update()
})

document.querySelector('#roty').addEventListener('click', function(){
    camera.position.set(0, -camerakhoangcach, 0);
    camera.updateProjectionMatrix();
    controls.update()
})

document.querySelector('#rotz').addEventListener('click', function(){
    camera.position.set(0, 0, camerakhoangcach);
    camera.updateProjectionMatrix();
    controls.update()
})

/**/
tick()