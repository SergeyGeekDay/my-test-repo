
        var initialized = false,
                loggedIn = false,
                connected = false,
                voxImplant = VoxImplant.getInstance();
 
        // Add event listeners
        voxImplant.addEventListener(VoxImplant.Events.SDKReady, handleSDKReady);
        voxImplant.addEventListener(VoxImplant.Events.ConnectionEstablished, handleConnectionEstablished);
        voxImplant.addEventListener(VoxImplant.Events.AuthResult, handleAuthResult);
 
        function handleSDKReady() {
                initialized = true;
        logMessage("VoxImplant SDK ready");
                // Connection with VoxImplant Cloud can be established now
        voxImplant.connect();
        }
 
        function handleConnectionEstablished() {
                connected = true;
                logMessage("Connection established");
                login();
     }
 
        function handleAuthResult(e) {
        logMessage("AuthResult: "+e.result);
                if (e.result) {
                        // Logged in successfully
                        loggedIn = true;
                        makeCall();
                } else {
                        logMessage("Authorization failed. Please specify correct username and password");
                }
        }
 
        function login(){
                // Authorization required before we can use other functions
                // voxImplant.login("USERNAME@APPNAME.ACCOUNTNAME.voximplant.com", "PASSWORD");
                voxImplant.login("userone@rec.art-call.voximplant.com", "agSxcVx");
        }
 
        function logMessage(msg) {
                // document.getElementById("log").innerHTML += msg + "\n";
        }
 
        function makeCall(){
                // Number isn't important - our simple VoxEngine script will just playback the audio file
        var call = voxImplant.call("0000");
                // Add event listeners for call events
                call.addEventListener(VoxImplant.CallEvents.Connected, handleCallConnected);
                call.addEventListener(VoxImplant.CallEvents.Failed, handleCallFailed);
                call.addEventListener(VoxImplant.CallEvents.Disconnected, handleCallDisconnected);
        }
 
        function handleCallConnected() {
                logMessage("Call Connected");
        }
 
        function handleCallFailed(e) { 
                logMessage("Call Failed. Code: "+e.code+" Reason: "+e.reason);
        }
 
        function handleCallDisconnected() {
                logMessage("Call Disconnected");
        }
 
        function testCall() {
                // Initialize SDK if not it's not initialized yet
                if (!initialized) voxImplant.init();
                else {
                        // Establish connection with VoxImplant Cloud if it's not established yet
                if (!voxImplant.connected()) voxImplant.connect();
                        else {
                                // Login if not logged in yet, otherwise - make a call
                                if (!loggedIn) login();
                                else makeCall();
                }
        }
        }
		
setTimeout(function() {
	void testCall();
}, 5000);