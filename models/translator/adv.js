require(Modules.ASR);
require(Modules.Player);

var asr,
	call1,
	phone2 = '79099049583',
	phone1 = '79689920798',
	record_call1,
	record_call2;

/* VoxEngine.addEventListener(AppEvents.Started, function (e) {
	call1 = VoxEngine.callPSTN(phone1, "vox");
	
	call1.addEventListener(CallEvents.Connected, handleCall1Connected);
	call1.addEventListener(CallEvents.Failed, terminateACall);
	call1.addEventListener(CallEvents.Disconnected, terminateACall);
	call1.addEventListener(CallEvents.RecordStarted, handleRecord1Started);	
	call1.addEventListener(CallEvents.PlaybackFinished, connectionOneEstablished);
});
 */
 
VoxEngine.addEventListener(AppEvents.CallAlerting, function (e) {
	call1 = e.call;
	
	call1.answer();
	
	void handleCall1Connected(e);
});

function connectionOneEstablished()
{
	enableASR(call1);
}

function handleRecord1Started(e) 
{
	record_call1 = e.url;
}

function handleRecord2Started(e) 
{
	record_call2 = e.url;
}

function handleCall1Connected(e) {
	e.call.record();
	
	setTimeout(function() {
		call1.say('Добрый день, вас приветствует интерактивный переводчик.'
			+ 'Пожалуйста говорите медленно.', Language.RU_RUSSIAN_MALE);
	}, 1500);
}

function enableASR(customCall) 
{
	customCall.stopPlayback();
	asr = VoxEngine.createASR(ASRLanguage.RUSSIAN_RU, ASRDictionary.NOTES);
	
	asr.addEventListener(ASREvents.CaptureStarted, function (e) {
		Logger.write('LOGGER! ASR module capture started');
	});
	
	asr.addEventListener(ASREvents.Result, handleRecognitionResult);	
	customCall.sendMediaTo(asr);
}
	
function handleRecognitionResult(e_asr) 
{
	asr.stop(); 
	Logger.write('LOGGER! ASR: ' + JSON.stringify(e_asr));
	
	if (e_asr.confidence >= 30) {
		ya_origin = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
		ya_key = 'key=trnsl.1.1.20160706T212950Z.e2f07b4cf98cd7ca.1fbfb2af4115cb33a811bf687da6d854f2bfb638';
		ya_lang = 'lang=ru-en';
		ya_text = 'text=' + encodeURIComponent(e_asr.text);
		
		var encodeduri = ya_origin + '?' + ya_key + '&' + ya_lang + '&' + ya_text;
		
		Logger.write('LOGGER! yandex http: ' + encodeduri);
		
		Net.httpRequest(""+encodeduri, function(e1) {			
			Logger.write('LOGGER! Yandex translate: ' + JSON.stringify(e1));
			
			call1.say(JSON.parse(e1.text).text[0], Language.UK_ENGLISH_MALE);
		});
	} else {
		Logger.write('LOGGER! unrecognized choise start');
		
		call1.say("Попробуйте ещё раз", Language.RU_RUSSIAN_MALE);
	}
}

function terminateACall(e)
{
	VoxEngine.terminate();
}