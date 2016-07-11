var initialized = false,
	loggedIn = false,
	connected = false,
	voxImplant = VoxImplant.getInstance();

voxImplant.addEventListener(VoxImplant.Events.SDKReady, handleSDKReady);
voxImplant.addEventListener(VoxImplant.Events.ConnectionEstablished, handleConnectionEstablished);
voxImplant.addEventListener(VoxImplant.Events.AuthResult, handleAuthResult);

function handleSDKReady() {
	initialized = true;
	
	voxImplant.connect();
}

function handleConnectionEstablished() {
	connected = true;
	
	login();
}

function handleAuthResult(e) {
	if (e.result) {
		loggedIn = true;
		
		makeCall();
	}
}

function login(){
	voxImplant.login("userone@native.art-call.voximplant.com", "0yOp8MF");
}

function makeCall(){
	var call = voxImplant.call("0000");
}

function testCall() {
	if (!initialized) {
			voxImplant.init();
	} else {
		if (!voxImplant.connected()) {
			voxImplant.connect();
		} else {
			if (!loggedIn) login();
			
			else makeCall();
		}
	}
}