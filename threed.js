<!DOCTYPE html>
<html lang="en">
<head>
	<title>Vine</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<style>
	body {
		color: #cccccc;
		font-family:Monospace;
		font-size:13px;
		text-align:center;
		background-color: #050505;
		margin: 0px;
		overflow: hidden;
	}
	#info {
		position: absolute;
		top: 0px; width: 100%;
		padding: 5px;
	}
	</style>
</head>
<body>
	<div id="info">Left click: rotate. Right click: translate. Scroll: zoom.</div>
	<script src="three.js"></script>
	<script src="OrbitControls.js"></script>
	<script>

	'use strict';
	//posroot isnt random. goes in circle follows grid. or doesnt follow grid is much more circular looking.
	//root doing vine in grid. look at netbeans code


	//mesh.add( mesh2 );

	function vineRoot(currpos) {

	}
	var branches = {
		pos: [],
		initdirr: [],
		length: []
	};
	var extend_index = 0;
	function extend(pos, dirr, index){
		let loc = -1;
		if(dirr==0){
			loc = new Array(pos[0]-2, pos[1], pos[2]);
		}
		if(dirr==1){
			loc = new Array(pos[0]+2, pos[1], pos[2]);
		}
		if(dirr==2){
			loc = new Array(pos[0], pos[1]-2, pos[2]);
		}
		if(dirr==3){
			loc = new Array(pos[0], pos[1]+2, pos[2]);
		}
		if(dirr==4){
			loc = new Array(pos[0], pos[1], pos[2]-2);
		}
		if(dirr==5){
			loc = new Array(pos[0], pos[1], pos[2]+2);
		}
		branches.pos[index] = loc;
		branches.length[index]+=1;
		if(branches.length[index]>7){
			extend_index+=1;
		}
		drawbranch(loc);
	}

	function branch(currpos, index) {
		let sqrs = adjacentsqs(currpos);
		let initdirrs = [0,1,2,3,4,5];
		let rem = [];
		let posprev = new Array(pos[index-1].position.x,pos[index-1].position.y,pos[index-1].position.z);
		let posnext = new Array(pos[index+1].position.x,pos[index+1].position.y,pos[index+1].position.z);
		for(let x = 0; x<sqrs.length; x++){
			let is_same_prev = sqrs[x].every(function(element, index) {	return element === posprev[index];});
			let is_same_next = sqrs[x].every(function(element, index) {	return element === posnext[index];});
			if(is_same_prev || is_same_next) {
				rem.push(x);
			}
		}
		for(let x = rem.length-1; x>=0; x--){
			sqrs.splice(rem[x],1);
			initdirrs.splice(rem[x],1);
		}
		for(let x = 0; x<sqrs.length; x++){
			branches.pos.push(sqrs[x]);
			branches.initdirr.push(initdirrs[x]);
			branches.length.push(0);
		}
		return sqrs;
	}
	//dirrs = left, right, down, up, back, forward
	function adjacentsqs(currpos) {
		let ret = [];
		ret.push(new Array(currpos[0]-4,currpos[1],currpos[2]));
		ret.push(new Array(currpos[0]+4,currpos[1],currpos[2]));
		ret.push(new Array(currpos[0],currpos[1]-4,currpos[2]));
		ret.push(new Array(currpos[0],currpos[1]+4,currpos[2]));
		ret.push(new Array(currpos[0],currpos[1],currpos[2]-4));
		ret.push(new Array(currpos[0],currpos[1],currpos[2]+4));
		return ret;
	}

	var spin=0;
	var prev = [0,0,0];
	var branches2 = [];
	function render() {
		root.position.x=Math.round(Math.sin(spin)*15)*4;
		root.position.z=Math.round(Math.cos(spin)*15)*4;
		root.position.y=Math.round(spin*15/Math.PI)*4;
		root.children[0].rotateY(.005);
		test.children[0].position.y = Math.round(Math.cos(spin*10)*2)*4;
		test.children[0].position.z = Math.round(Math.sin(spin*10)*2)*4;

		let check = new Array(root.position.x,root.position.y,root.position.z);
		let is_same = prev.every(function(element, index) {	return element === check[index];});
		if(!is_same) {
			drawroot(check);
			for(let x = extend_index; x<branches.pos.length; x++) {
				extend(branches.pos[x], branches.initdirr[x], x);
			}
			prev= new Array(check[0],check[1],check[2]);
			if(pos.length%8==1) {
				let curr =branch(pos[pos.length-2].position.toArray(),pos.length-2);
				curr.map(function(x) {
					let curr = drawbranch(x);
					branches2.push(curr);
					root.add(curr);
				});

			}
		}
		if(spin<Math.PI*8){
			spin+=.005;
		}
		renderer.render(scene, camera);
	}


	var pos = [];
	var root, test, test2;
	var scene, camera, renderer, controls;

	var width = window.innerWidth, height = window.innerHeight;
	var animframe;
	var continueAnim = true;

	function init() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(35, width / height, 0.3, 1000);
		scene.position.y-=20;
		camera.lookAt(scene.position);
		camera.position.z = 200;
		camera.position.y = 200;
		camera.position.x = 50;

		root = new THREE.Mesh(boxGeo, boxMat);
		scene.add(root);

		test = new THREE.Mesh(boxGeoinvis, boxMatinvis);
		test2 = new THREE.Mesh(boxGeo2, boxMat2);
		root.add(test);
		test.add(test2);

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.setClearColor(0x0E2255);
		renderer.shadowMap.enabled = true;

		controls = new THREE.OrbitControls(camera, renderer.domElement);

		const ambientLight = new THREE.AmbientLight();
		scene.add(ambientLight);

		const light = new THREE.DirectionalLight();
		light.position.set(200, 100, 200);
		light.castShadow = true;
		light.shadow.camera.left = -100;
		light.shadow.camera.right = 100;
		light.shadow.camera.top = 100;
		light.shadow.camera.bottom = -100;
		scene.add(light);
		drawroot([0,0,0]);
		drawcenter();
		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onResize);
	}


		function drawroot(loc) {
			let center = new THREE.Group();
			scene.add(center);
			const obj = new THREE.Mesh(boxGeo, boxMat);
			obj.castShadow = true;
			obj.receiveShadow = true;
			obj.position.set(loc[0],loc[1],loc[2]);
			pos.push(obj);
			center.add(obj);
		}

		function drawbranch(loc) {
			let center = new THREE.Group();
			scene.add(center);
			const boxGeo = new THREE.CubeGeometry(2,2,2);

			const obj = new THREE.Mesh(boxGeo, boxMat2);
			obj.castShadow = true;
			obj.receiveShadow = true;
			obj.position.set(loc[0],loc[1],loc[2]);
			center.add(obj);
			return obj;
		}

		function drawcenter() {
			let center = new THREE.Group();
			scene.add(center);
			const boxGeo = new THREE.CubeGeometry(120,4,120);
			const boxMat = new THREE.MeshPhongMaterial({
				color: new THREE.Color("rgb(0, 0, 128)"),
				shading: THREE.FlatShading,
				transparent: true,
				opacity: .5
			});
			const obj = new THREE.Mesh(boxGeo, boxMat);
			obj.castShadow = true;
			obj.receiveShadow = true;
			obj.position.set(0,0,0);
			center.add(obj);
			return obj;
		}

	function onResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

	function animate() {
		animframe = requestAnimationFrame(animate);
		render();
		if(!continueAnim){
			cancelAnimationFrame(animframe);
		}
	}

	var boxGeo = new THREE.CubeGeometry(4,4,4);
	var boxMat = new THREE.MeshPhongMaterial({
		color: new THREE.Color("rgb(255, 0, 0)"),
		shading: THREE.FlatShading,
		transparent: true,
		opacity: .5
	});
	var boxGeo2 = new THREE.CubeGeometry(4,4,2);
	var boxMat2 = new THREE.MeshPhongMaterial({
		color: new THREE.Color("rgb(0, 255, 0)"),
		shading: THREE.FlatShading,
		transparent: true,
		opacity: .5
	});
	var boxGeoinvis = new THREE.CubeGeometry(0,0,0);
	var boxMatinvis = new THREE.MeshPhongMaterial({
		color: new THREE.Color("rgb(0, 0, 0)"),
		transparent: true,
		opacity: 1
	});

	init();
	animate();

	</script>
</body>
</html>
