
var global_speed = new fattycurd.vector3df(0,0,0);
var level0_maxtime = 15.0*60;

if (fattycurd.parameter_set["level1_begin"] === "<unknown>") {
	fattycurd.sound.play("level1_loop", true);
	var d = new Date();
	var begin_time = d.getTime();
	var level1_begin = true;
} else {
	var level1_begin = JSON.parse(fattycurd.parameter_set["level1_begin"]);
	var begin_time = JSON.parse(fattycurd.parameter_set["begin_time"]);
}



var bottlespeed = 0.05;
var bottle_duration = 30.0;
var wave_factor = 0.00001;
if (fattycurd.parameter_set["tmp_bottlespeed_level1"] === "<unknown>") {
	var tmp_bottlespeed_level1 = [0.0,0.0];
	
} else {
	var tmp_bottlespeed_level1 = JSON.parse(fattycurd.parameter_set["tmp_bottlespeed_level1"]);

	
}

if (fattycurd.parameter_set["tmp_bottlespeed_level1"] === "<unknown>") {
	var clicked = [0,0,0,0]; //WSAD
} else {
	var clicked = JSON.parse(fattycurd.parameter_set["clicked"]);
}

function v3Bottlespeed(direction) {
	return new fattycurd.vector3df(-direction[0]*tmp_bottlespeed_level1[0],0.0,direction[1]*tmp_bottlespeed_level1[1]);
	
}



var camera_move = 0.01;
var camera_dist = new fattycurd.vector3df(0,5,5);
var vector_pos = fattycurd.world.camera.position;
var camera_pos = new fattycurd.vector3df(vector_pos.x, vector_pos.y, vector_pos.z);

var vector_target = fattycurd.world.camera.target;
var camera_target = new fattycurd.vector3df(vector_target.x, vector_target.y, vector_target.z);

vector_pos = null;
vector_target = null;

var pos = new fattycurd.vector3df(0,0,0);
var target = new fattycurd.vector3df(0,0,0);

var direction = [0,0];
if (fattycurd.parameter_set["last_direction"] === "<unknown>") {
	var last_direction = [0,0];
} else {
	var last_direction = JSON.parse(fattycurd.parameter_set["last_direction"]);
}
var UP   = fattycurd.keyboard.IsKeyDown(fattycurd.EKEY.KEY_KEY_W);
var LEFT = fattycurd.keyboard.IsKeyDown(fattycurd.EKEY.KEY_KEY_A);
var RIGHT = fattycurd.keyboard.IsKeyDown(fattycurd.EKEY.KEY_KEY_D);

if (UP) {
	if(!clicked[0]) {
		tmp_bottlespeed_level1[1] = 0.0;
		clicked[0] = 1;
	} else if (tmp_bottlespeed_level1[1] < bottlespeed) {
		tmp_bottlespeed_level1[1] += bottlespeed / bottle_duration;
	} else {
		tmp_bottlespeed_level1[1] = bottlespeed;
	}
	direction[1] = 1;
	last_direction[1] = 1;
	global_speed.z = -bottlespeed;
	
} else {
	direction[1] = 0;
	if (tmp_bottlespeed_level1[1] > 0.0) {
		tmp_bottlespeed_level1[1] -= bottlespeed / bottle_duration;
	} else {
		tmp_bottlespeed_level1[1] = 0.0;
	}
}

if (LEFT) {
	if(!clicked[2]) {
		tmp_bottlespeed_level1[0] = 0.0;
		clicked[2] = 1;
	} else if (tmp_bottlespeed_level1[0] < bottlespeed) {
		tmp_bottlespeed_level1[0] += bottlespeed / bottle_duration;
	} else {
		tmp_bottlespeed_level1[0] = bottlespeed;
	}
	direction[0] = 1;
	last_direction[0] = 1;
	global_speed.x = bottlespeed;
	
} else if (RIGHT) {
	if(!clicked[3]) {
		tmp_bottlespeed_level1[0] = 0.0;
		clicked[3] = 1;
	} else if (tmp_bottlespeed_level1[0] < bottlespeed) {
		tmp_bottlespeed_level1[0] += bottlespeed / bottle_duration;
	}  else {
		tmp_bottlespeed_level1[0] = bottlespeed;
	}
	direction[0] = -1;
	last_direction[0] = -1;
	global_speed.x = -bottlespeed;
	
} else {
	direction[0] = 0;
	if (tmp_bottlespeed_level1[0] > 0.0) {
		tmp_bottlespeed_level1[0] -= bottlespeed/bottle_duration;
	} else {
		tmp_bottlespeed_level1[0] = 0.0;
	}
}

if (!UP) {
	clicked[0] = 0;
	
}


if(!LEFT) {
	clicked[2] = 0;
} 
if(!RIGHT) {
	clicked[3] = 0;
}

var user_speed = v3Bottlespeed(direction);



target = fattycurd.world.characters[0].position;
var wave_height = fattycurd.world.water.surfacePosition(target.x, target.y, target.z);
target.y = wave_height.y;
var bottle_wave = fattycurd.world.water.surfaceNormal(target.x, target.z);
bottle_wave = new fattycurd.vector3df(bottle_wave.x, bottle_wave.y, bottle_wave.z);
bottle_wave = (new fattycurd.vector3df(0,1,0)).minus(bottle_wave.normalize());

fattycurd.world.characters[0].position = target;



var delta_pos = camera_target.minus(camera_pos).add(camera_dist);
pos = camera_pos.add(delta_pos.mult(camera_move).add(user_speed).add(bottle_wave.mult(wave_factor)));
global_speed = global_speed.add(bottle_wave.mult(wave_factor))

fattycurd.world.camera.position = pos;




fattycurd.world.camera.target = target;

var euler = fattycurd.world.characters[0].euler;

var max_angle = 45;

euler.z = max_angle*last_direction[0]*(tmp_bottlespeed_level1[0]/bottlespeed + (bottle_wave).x);
euler.x = max_angle*last_direction[1]*(tmp_bottlespeed_level1[1]/bottlespeed + (bottle_wave).y);

fattycurd.world.characters[0].euler = euler;
euler = null;
//Water
var water_pos = fattycurd.world.water.position;
water_pos = new fattycurd.vector3df(water_pos.x, water_pos.y, water_pos.z);
water_pos = water_pos.add(global_speed.mult(-1));
fattycurd.world.water.position = water_pos;

//Tiles
if (fattycurd.world.water.position.z > 25 && fattycurd.parameter_set["level1_event0"] === "<unknown>") {
	fattycurd.sound.play("level1_event0",false);
	fattycurd.parameter_set["level1_event0"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level1_event0"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[0].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.1;
		fattycurd.world.billboards[0].position = bill_pos;
	}	
}

if (fattycurd.world.water.position.z > 50 && fattycurd.parameter_set["level1_event1"] === "<unknown>") {
	fattycurd.sound.play("level1_event1",false);
	fattycurd.parameter_set["level1_event1"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level1_event1"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[1].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.1;
		fattycurd.world.billboards[1].position = bill_pos;
	}	
}

if (fattycurd.world.water.position.z > 75 && fattycurd.parameter_set["level1_event2"] === "<unknown>") {
	fattycurd.sound.play("level1_event2",false);
	fattycurd.parameter_set["level1_event2"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level1_event2"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[2].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.1;
		fattycurd.world.billboards[2].position = bill_pos;
	}	
}

for (obs_index in fattycurd.world.tiles) {
	//y-position
	var obs = fattycurd.world.tiles[obs_index].position;
	var speed = (new fattycurd.vector3df(0,0,0)).minus(global_speed);
	//speed relative to the bottle
	obs = new fattycurd.vector3df(obs.x,obs.y,obs.z);
	obs = obs.add(speed);
	var new_height = fattycurd.world.water.surfacePosition(obs.x, obs.y, obs.z);
	obs.y = new_height.y;
	
	
	fattycurd.world.tiles[obs_index].position = obs;
	obs = null;
	speed = null;
}



//END OF LEVEL TODO 100 -> level1
if ( fattycurd.world.water.position.z > 100) {
	fattycurd.world.water.visible = false;
	fattycurd.parameter_set["fattycurd.menu.current"] = "level2";
}


fattycurd.parameter_set["level1_begin"] = JSON.stringify(level1_begin);
fattycurd.parameter_set["tmp_bottlespeed_level1"] = JSON.stringify(tmp_bottlespeed_level1);
fattycurd.parameter_set["clicked"] = JSON.stringify(clicked);
fattycurd.parameter_set["last_direction"] = JSON.stringify(last_direction);
fattycurd.parameter_set["begin_time"] = JSON.stringify(begin_time);


