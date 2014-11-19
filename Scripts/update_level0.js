
var global_speed = new fattycurd.vector3df(0,0,0);
var level0_maxtime = 15.0*60;

if (fattycurd.parameter_set["level0_begin"] === "<unknown>") {
	fattycurd.sound.play("level0_intro", false);
	var d = new Date();
	var begin_time = d.getTime();
	var loop = false;
	var level0_begin = true;
	var level0_timer = level0_maxtime;
} else {
	var level0_begin = JSON.parse(fattycurd.parameter_set["level0_begin"]);
	var level0_timer = JSON.parse(fattycurd.parameter_set["level0_timer"]);
	var begin_time = JSON.parse(fattycurd.parameter_set["begin_time"]);
	var loop = JSON.parse(fattycurd.parameter_set["loop"]);
}



var bottlespeed = 0.05;
var bottle_duration = 30.0;
var wave_factor = 0.00001;
if (fattycurd.parameter_set["tmp_bottlespeed_level0"] === "<unknown>") {
	var tmp_bottlespeed_level0 = [0.0,0.0];
	
} else {
	var tmp_bottlespeed_level0 = JSON.parse(fattycurd.parameter_set["tmp_bottlespeed_level0"]);

	
}

if (fattycurd.parameter_set["tmp_bottlespeed_level0"] === "<unknown>") {
	var clicked = [0,0,0,0]; //WSAD
} else {
	var clicked = JSON.parse(fattycurd.parameter_set["clicked"]);
}

function v3Bottlespeed(direction) {
	return new fattycurd.vector3df(-direction[0]*tmp_bottlespeed_level0[0],0.0,direction[1]*tmp_bottlespeed_level0[1]);
	
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
		tmp_bottlespeed_level0[1] = 0.0;
		clicked[0] = 1;
	} else if (tmp_bottlespeed_level0[1] < bottlespeed) {
		tmp_bottlespeed_level0[1] += bottlespeed / bottle_duration;
	} else {
		tmp_bottlespeed_level0[1] = bottlespeed;
	}
	direction[1] = 1;
	last_direction[1] = 1;
	global_speed.z = -bottlespeed;
	
} else {
	direction[1] = 0;
	if (tmp_bottlespeed_level0[1] > 0.0) {
		tmp_bottlespeed_level0[1] -= bottlespeed / bottle_duration;
	} else {
		tmp_bottlespeed_level0[1] = 0.0;
	}
}

if (LEFT) {
	if(!clicked[2]) {
		tmp_bottlespeed_level0[0] = 0.0;
		clicked[2] = 1;
	} else if (tmp_bottlespeed_level0[0] < bottlespeed) {
		tmp_bottlespeed_level0[0] += bottlespeed / bottle_duration;
	} else {
		tmp_bottlespeed_level0[0] = bottlespeed;
	}
	direction[0] = 1;
	last_direction[0] = 1;
	global_speed.x = bottlespeed;
	
} else if (RIGHT) {
	if(!clicked[3]) {
		tmp_bottlespeed_level0[0] = 0.0;
		clicked[3] = 1;
	} else if (tmp_bottlespeed_level0[0] < bottlespeed) {
		tmp_bottlespeed_level0[0] += bottlespeed / bottle_duration;
	}  else {
		tmp_bottlespeed_level0[0] = bottlespeed;
	}
	direction[0] = -1;
	last_direction[0] = -1;
	global_speed.x = -bottlespeed;
	
} else {
	direction[0] = 0;
	if (tmp_bottlespeed_level0[0] > 0.0) {
		tmp_bottlespeed_level0[0] -= bottlespeed/bottle_duration;
	} else {
		tmp_bottlespeed_level0[0] = 0.0;
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


if (level0_begin) {
	
	var up_pos = camera_pos.add(new fattycurd.vector3df(0,10,0));
	var delta_begin = up_pos.minus(target);
	delta_begin = delta_begin.mult(level0_timer/level0_maxtime);
	target = new fattycurd.vector3df(target.x, target.y, target.z);
	target = target.add(delta_begin);
	level0_timer -= 1;
	if (!level0_timer) {
		level0_begin = false;
	}
}
fattycurd.world.camera.target = target;

var euler = fattycurd.world.characters[0].euler;

var max_angle = 45;

euler.z = max_angle*last_direction[0]*(tmp_bottlespeed_level0[0]/bottlespeed + (bottle_wave).x);
euler.x = max_angle*last_direction[1]*(tmp_bottlespeed_level0[1]/bottlespeed + (bottle_wave).y);

fattycurd.world.characters[0].euler = euler;
euler = null;
//Water
var water_pos = fattycurd.world.water.position;
water_pos = new fattycurd.vector3df(water_pos.x, water_pos.y, water_pos.z);
water_pos = water_pos.add(global_speed.mult(-1));
fattycurd.world.water.position = water_pos;

//Tiles

for (var obs_index in fattycurd.world.tiles) {
	//y-position
	var obs = fattycurd.world.tiles[obs_index].position;
	var speed = global_speed.mult(-1);
	//speed relative to the bottle
	obs = new fattycurd.vector3df(obs.x,obs.y,obs.z);
	obs = obs.add(speed);
	var new_height = fattycurd.world.water.surfacePosition(obs.x, obs.y, obs.z);
	obs.y = new_height.y;
	
	
	fattycurd.world.tiles[obs_index].position = obs;
	obs = null;
	speed = null;
}
//Dialoc events
if (fattycurd.world.water.position.z > 5 && fattycurd.parameter_set["level0_event0"] === "<unknown>") {
	fattycurd.sound.play("level0_event0",false);
	fattycurd.parameter_set["level0_event0"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level0_event0"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[1].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.1;
		fattycurd.world.billboards[1].position = bill_pos;
	}	
}

if (fattycurd.world.water.position.z > 25 && fattycurd.parameter_set["level0_event1"] === "<unknown>") {
	fattycurd.sound.play("level0_event1",false);
	fattycurd.parameter_set["level0_event1"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level0_event1"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[2].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.1;
		fattycurd.world.billboards[2].position = bill_pos;
	}	
}

if (fattycurd.world.water.position.z > 75 && fattycurd.parameter_set["level0_event2"] === "<unknown>") {
	fattycurd.sound.play("level0_event2",false);
	fattycurd.parameter_set["level0_event2"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level0_event2"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[3].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.1;
		fattycurd.world.billboards[3].position = bill_pos;
	}	
}

if (fattycurd.world.water.position.z > 100 && fattycurd.parameter_set["level0_event3"] === "<unknown>") {
	fattycurd.sound.play("level0_event3",false);
	fattycurd.parameter_set["level0_event3"] = JSON.stringify(true);
	
} else if (!(fattycurd.parameter_set["level0_event3"] === "<unknown>")) {
	var bill_pos = fattycurd.world.billboards[4].position;
	if (bill_pos.y < 30){
		bill_pos.y += 0.05;
		fattycurd.world.billboards[4].position = bill_pos;
	}	
}


//END OF LEVEL TODO 125 -> level1
if ( fattycurd.world.water.position.z > 125) {
	fattycurd.world.water.visible = false;
	fattycurd.parameter_set["fattycurd.menu.current"] = "level1";
}

var d2 = new Date();
var begin_delta_time = d2.getTime()-begin_time;

if (begin_delta_time > 10000 && !loop) {
	loop = true;
	fattycurd.sound.play("level0_loop", true);
}

fattycurd.parameter_set["level0_begin"] = JSON.stringify(level0_begin);
fattycurd.parameter_set["level0_timer"] = JSON.stringify(level0_timer);
fattycurd.parameter_set["tmp_bottlespeed_level0"] = JSON.stringify(tmp_bottlespeed_level0);
fattycurd.parameter_set["clicked"] = JSON.stringify(clicked);
fattycurd.parameter_set["last_direction"] = JSON.stringify(last_direction);
fattycurd.parameter_set["begin_time"] = JSON.stringify(begin_time);
fattycurd.parameter_set["loop"] = JSON.stringify(loop);
