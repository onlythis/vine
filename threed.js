<!DOCTYPE html>
<html lang="en">
<head>
	<title>three</title>
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

	var w=15;
	var h=15;
	var depth=15;

	var grid=new Array(w);
	for(let x = 0; x<w; x++){
		grid[x]=new Array(h);
		for(let y = 0; y<h; y++){
			grid[x][y]=new Array(depth);
			for(let z = 0; z<depth; z++){
				grid[x][y][z]=0;
			}
		}
	}
	var path=[];
	var treesize=16;
	var start_positions=[8,8,8];
	var roots=[];
	function quadTree(){
		let depth=0;
		let startx=start_positions[0];
		let starty=start_positions[1];
		let startz=start_positions[2];
		grid[startx][starty][startz]+=1;
		roots.push([]);
		roots[0].push([startx,starty,startz]);
		roots.push([]);
		roots[1].push(growbranch(startx,starty,startz,treesize,1));
		while(true){
			let prev=depth;
			for(let a = 0; a<roots[0].length; a++){
				let posx=roots[0][a][0];
				let posy=roots[0][a][1];
				let posz=roots[0][a][2];
				let path=roots[1][a];
				search_opendirrs(posx,posy,posz,path);
			}
			depth=roots[0].length;
			if(prev==depth){
				break;
			}
		}
		return roots;
	}

	function search_opendirrs(posx, posy, posz, path){
		let openings=0;
		let skips=0;
		let dirr=-1;
		for(let x = 0; x<path.length; x++) {
			let dirr=path[x];
			let openings=0;
			for(let z =0; z<6; z++){
				if(checkgrid2(posx,posy,posz,z)==0){
					let newpath=growbranch(posx,posy,posz,treesize,z);
					roots[0].push([posx,posy,posz]);
					roots[1].push(newpath);
				}
			}
			if(dirr==0){
				posy+=1
			}
			if(dirr==1){
				posx+=1
			}
			if(dirr==2){
				posy-=1
			}
			if(dirr==3){
				posx-=1;
			}
			if(dirr==4){
				posz+=1;
			}
			if(dirr==5){
				posz-=1;
			}
		}
	}

	function growbranch(posx, posy, posz, length, initdirr){
		let branch_path=[];
		let dirr=initdirr;
		for(let i = 0; i<length; i++) {
			dirr=dont_turn_back(initdirr,dirr);
			if(i<2){
				dirr=initdirr;
			}
			let n=0;
			while(checkgrid2(posx,posy,posz,dirr)){
				if(n>50){
					return branch_path;
				}
				dirr=dont_turn_back(initdirr,dirr);
				n+=1;
			}
			if(dirr==0){
				posy+=1
			}
			if(dirr==1){
				posx+=1
			}
			if(dirr==2){
				posy-=1
			}
			if(dirr==3){
				posx-=1;
			}
			if(dirr==4){
				posz+=1;
			}
			if(dirr==5){
				posz-=1;
			}
			grid[posx][posy][posz]+=1;
			branch_path.push(dirr);
		}
		return branch_path;
	}

	//returns 1 if grid pos is taken
	function checkgrid2(posx,posy,posz,dirr){
		if(dirr==0){
			if(grid[posx][posy+1][posz]>0 || posy>h-3){
				return 1;
			}
			let two=0;
			for(let x = 0; x<6; x++){
				if(checkgrid3(posx,posy+1,posz,x)==1){
					two+=1;
				}
				if(two>1){
					return 1;
				}
			}
			return 0;
		}
		if(dirr==1){
			if(grid[posx+1][posy][posz]>0 || posx>w-3){
				return 1;
			}
			let two=0;
			for(let x = 0; x<6; x++){
				if(checkgrid3(posx+1,posy,posz,x)==1){
					two+=1;
				}
				if(two>1){
					return 1;
				}
			}
			return 0;
		}
		if(dirr==2){
			if(grid[posx][posy-1][posz]>0 || posy<2){
				return 1;
			}
			let two=0;
			for(let x = 0; x<6; x++){
				if(checkgrid3(posx,posy-1,posz,x)==1){
					two+=1;
				}
				if(two>1){
					return 1;
				}
			}
			return 0;
		}
		if(dirr==3){
			if(grid[posx-1][posy][posz]>0 || posx<2){
				return 1;
			}
			let two=0;
			for(let x = 0; x<6; x++){
				if(checkgrid3(posx-1,posy,posz,x)==1){
					two+=1;
				}
				if(two>1){
					return 1;
				}
			}
			return 0;
		}
		if(dirr==4){
			if(grid[posx][posy][posz+1]>0 || posz>depth-3){
				return 1;
			}
			let two=0;
			for(let x = 0; x<6; x++){
				if(checkgrid3(posx,posy,posz+1,x)==1){
					two+=1;
				}
				if(two>1){
					return 1;
				}
			}
			return 0;
		}
		if(dirr==5){
			if(grid[posx][posy][posz-1]>0 || posz<2){
				return 1;
			}
			let two=0;
			for(let x = 0; x<6; x++){
				if(checkgrid3(posx,posy,posz-1,x)==1){
					two+=1;
				}
				if(two>1){
					return 1;
				}
			}
			return 0;
		}
	}


	//returns 1 if grid pos is taken
	function checkgrid3(posx,posy,posz,dirr){
		if(dirr==0){
			if(posy<1){
				return 1;
			}
			if(grid[posx][posy+1][posz]>0){
				return 1;
			}	else { return 0;}
		}
		if(dirr==1){
			if(posy<1){
				return 1;
			}
			if(grid[posx+1][posy][posz]>0){
				return 1;
			}	else { return 0;}
		}
		if(dirr==2){
			if(posy<1){
				return 1;
			}
			if(grid[posx][posy-1][posz]>0){
				return 1;
			}	else { return 0;}
		}
		if(dirr==3){
			if(posy<1){
				return 1;
			}
			if(grid[posx-1][posy][posz]>0){
				return 1;
			}	else { return 0;}
		}
		if(dirr==4){
			if(posy<1){
				return 1;
			}
			if(grid[posx][posy][posz+1]>0){
				return 1;
			}	else { return 0;}
		}
		if(dirr==5){
			if(posy<1){
				return 1;
			}
			if(grid[posx][posy][posz-1]>0){
				return 1;
			}	else { return 0;}
		}
	}

	function dont_turn_back(initdirr,dirr){
		if(Math.random()<0.33){
			return initdirr;
		}
		return Math.floor(Math.random() * 6);
	}

	function getGrid(){
		return grid;
	}

	//if back and forth continue, dont put
	quadTree();
//gen positions in order
	function genPositions(){
		let poss = [];
		for(let x = 0; x<roots[0].length; x++) {
			let curr = roots[0][x];
			//poss.push(new Array(curr[0],curr[1],curr[2]));
			for(let y = 0; y<roots[1][x].length; y++) {
				let dirr = roots[1][x][y];
				if(dirr==0){
					curr[1]+=1;
				}
				if(dirr==1){
					curr[0]+=1;
				}
				if(dirr==2){
					curr[1]-=1;
				}
				if(dirr==3){
					curr[0]-=1;
				}
				if(dirr==4){
					curr[2]+=1;
				}
				if(dirr==5){
					curr[2]-=1;
				}
				poss.push(new Array(curr[0],curr[1],curr[2]));
			}
		}
		return poss;
	}

	var scene, camera, renderer, controls;

	var boxes, arr;
	boxes = [];
	arr =[];
	var width = window.innerWidth,
	height = window.innerHeight;

	var continueAnim = true;

	function init() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
		camera.lookAt(scene.position);
		camera.position.z = 200;
		camera.position.y = 50;
		camera.position.x = 50;

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

		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onResize);
	}

	function onResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}
	var animframe;
	function animate() {
		animframe = requestAnimationFrame(animate);
		render();
		if(!continueAnim){
			cancelAnimationFrame(animframe);
		}
	}

	var ler = 0.01;
	var index = 0;
	var stillgrowing = true;
	var poses = genPositions();
	var yellow = new THREE.Color("rgb(128, 128, 0)");

	//
	function render() {
		if(stillgrowing==true){
			let pos = poses[index];
			if(pos==null){
				stillgrowing=false;
			} else { drawbox(pos, index);}
			index+=1;
			for(var x = arr.length>100? arr.length-100: 0; x<arr.length; x++){
				if(arr[x].material.color!=yellow){
					arr[x].material.color.lerp(new THREE.Color("rgb(128, 128, 0)"),ler);
					arr[x].material.opacity-=.008;
					arr[x].position.x+=.1;
					arr[x].rotateZ(-Math.PI/100);
				} else {console.log("else");}
			}
		} else {
			scene.remove(boxes[0]);
			boxes.splice(0,1);
			if(boxes.length==0){
				continueAnim=false;
			}
		}

		//dont loop over colors already yellow
		renderer.render(scene, camera);
	}

	const boxSize = new THREE.CubeGeometry(4,4,4);

	function drawbox(pos, index) {
		boxes[index] = new THREE.Group();
		scene.add(boxes[index]);
		const boxGeo = boxSize;
		const boxMat = new THREE.MeshPhongMaterial({
			color: new THREE.Color("rgb(255, 0, 0)"),
			shading: THREE.FlatShading,
			transparent: true,
			opacity: 1
		});
		const obj = new THREE.Mesh(boxGeo, boxMat);
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.position.set(pos[0]*8-(10*8), pos[1]*8-(10*8), pos[2]*8-(10*8));
		arr.push(obj);
		boxes[index].add(obj);
	}
	function drawcenter() {
		let center = new THREE.Group();
		scene.add(center);
		const boxGeo = boxSize;
		const boxMat = new THREE.MeshPhongMaterial({
			color: new THREE.Color("rgb(255, 0, 0)"),
			shading: THREE.FlatShading,
			transparent: true,
			opacity: 1
		});
		const obj = new THREE.Mesh(boxGeo, boxMat);
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.position.set(0,0,0);
		center.add(obj);
	}

	init();
	animate();

	</script>
</body>
</html>
