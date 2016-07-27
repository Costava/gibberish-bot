console.log('main');

//////////

var sound1 = new Howl({
	src: ['audio/misc_menu_2.ogg', 'audio/misc_menu_2.m4a'],
	autoplay: false,
	loop: false,
	onloaderror: function() {
		console.log("Failed to load audio");
	}
});

var sound2 = new Howl({
	src: ['audio/misc_menu_4.ogg', 'audio/misc_menu_4.m4a'],
	autoplay: false,
	loop: false,
	onloaderror: function() {
		console.log("Failed to load audio");
	}
});

//////////

var onVolume = 1;
var offVolume = 0;
var volume = onVolume;
var soundsOn = true;

function turnOnSounds() {
	volume = onVolume;

	document.querySelector('.js-sounds').src = 'svg/speaker.svg';

	soundsOn = true;
}

function turnOffSounds() {
	volume = offVolume;

	document.querySelector('.js-sounds').src = 'svg/speaker-off.svg';

	soundsOn = false;
}

function toggleSounds() {
	if (soundsOn) {
		turnOffSounds();
	}
	else {
		turnOnSounds();
	}
}

document.querySelector('.js-sounds').addEventListener('click', toggleSounds);

function playSendSound() {
	if (sound2.state() === 'loaded') {
		sound2.volume(volume);
		sound2.play();
	}
}

function playReceiveSound() {
	if (sound1.state() === 'loaded') {
		sound1.volume(volume);
		sound1.play();
	}
}

//////////

function updateTime() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();

	var minutesString;
	if (minutes < 10) {
		minutesString = '0' + String(minutes);
	}
	else {
		minutesString = String(minutes);
	}

	var timeElement = document.querySelector('.js-time');

	timeElement.innerHTML = String(hours) + ':' + minutesString;
}

// Set up clock
var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();

// Have clock update soon after minute changes
setTimeout(function() {
	updateTime();

	setInterval(updateTime, 60 * 1000);
}, (60 - seconds) * 1000 + 3000);

updateTime();// Initial run

//////////

function addMessage(messageText, messageKind) {
	var message = document.createElement('div');

	message.className = 'message ' + messageKind;
	message.innerHTML = messageText;

	document.querySelector('.js-messages').appendChild(message);
}

function sendMessage(text) {
	addMessage(text, 'sent');
}

function receiveMessage(text) {
	addMessage(text, 'received');
}

//////////

function userSendMessage() {
	var sendTextElement = document.querySelector('.js-send-text');
	var text = sendTextElement.value;

	// If can find non whitespace
	if (text.search(/[^\s]/) !== -1) {
		sendTextElement.value = '';

		sendMessage(text);

		playSendSound();

		var messages = document.querySelector('.js-messages');
		messages.scrollTop = messages.scrollHeight;
	}
}

//////////

// Bot sends messages if user is idle
// Bot responds if user sends message

var botMessageTimeout;

function botSendMessage() {
	if (botMessageTimeout != undefined) {
		clearTimeout(botMessageTimeout);
	}

	receiveMessage(Gibberish.randomSentence({
		numWords: Gibberish.randomInt(1, 7),
		wordMinLength: 2,
		wordMaxLength: 6
	}));

	playReceiveSound();

	var messages = document.querySelector('.js-messages');
	messages.scrollTop = messages.scrollHeight;

	botMessageTimeout = setTimeout(botSendMessage, 12000);
}

function botReceiveMessage() {
	if (botMessageTimeout != undefined) {
		clearTimeout(botMessageTimeout);
	}

	botMessageTimeout = setTimeout(botSendMessage, 2500);
}

// Initialize bot's idle chatting
botMessageTimeout = setTimeout(botSendMessage, 5200);

//////////

document.querySelector('.js-send-button').addEventListener('click', function() {
	userSendMessage();

	document.querySelector('.js-send-text').focus();
});

document.addEventListener('keydown', function(e) {
	// console.log(e.keyCode);// `enter` is 13

	if (e.keyCode === 13 && !e.shiftKey) {
		userSendMessage();

		botReceiveMessage();

		/* http://stackoverflow.com/questions/31245808/clear-textarea-input-after-enter-key-press */
		if(e.preventDefault) e.preventDefault();

		return false;// Just a workaround for old browsers
		/* */
	}
});

//////////

var infoOpen = false;

function openInfo() {
	if (botMessageTimeout != undefined) {
		clearTimeout(botMessageTimeout);
	}

	var infoElement = document.querySelector('.js-info');

	infoElement.style.transitionTimingFunction = 'cubic-bezier(1, 0, 0.27, 1.55)';
	infoElement.style.boxShadow = '#555 0 0 30px 2px';
	infoElement.style.transform = 'translate(-50%, -50%) scale(1, 1)';

	infoOpen = true;
}

function closeInfo() {
	if (botMessageTimeout != undefined) {
		clearTimeout(botMessageTimeout);
	}

	botMessageTimeout = setTimeout(botSendMessage, 5200);

	var infoElement = document.querySelector('.js-info');

	infoElement.style.transitionTimingFunction = 'cubic-bezier(0.44, 0.4, 0, 1.1)';
	infoElement.style.boxShadow = '#555 0 0 0 0';
	infoElement.style.transform = 'translate(-50%, -50%) scale(0, 0)';

	infoOpen = false;
}

function toggleInfo() {
	if (infoOpen) {
		closeInfo();
	}
	else {
		openInfo();
	}
}

//////////

document.querySelector('.js-close').addEventListener('click', closeInfo);

var headerIcons = document.querySelectorAll('.header-icon');
var homeBarIcons = document.querySelectorAll('.home-bar-icon');

for (var i = 0; i < headerIcons.length; ++i) {
	headerIcons[i].addEventListener('click', toggleInfo);
}

for (var i = 0; i < headerIcons.length; ++i) {
	homeBarIcons[i].addEventListener('click', toggleInfo);
}

document.addEventListener('keydown', function(e) {
	// console.log(e.keyCode);// `escape` is 27

	if (e.keyCode === 27) {
		closeInfo();
	}
});

//////////

document.querySelector('.js-send-text').focus();
