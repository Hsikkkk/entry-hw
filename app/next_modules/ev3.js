function Module() {
	this.sensory = {
		D2: 0,
		D3: 0,
		D11: 0,
		light: 0,
		mic: 0,
		adc0: 0,
		adc1: 0,
		adc2: 0,
		adc3: 0
	};
	
	this.motoring = {
		rightWheel: 0,
		leftWheel: 0,
		head: 90,
		armR: 90,
		armL: 90,
		analogD5: 127,
		analogD6: 127,
		D4: 0,
		D7: 0,
		D12: 0,
		D13: 0,
		ledR: 0,
		ledG: 0,
		ledB: 0,
		lcdNum: 0,
		lcdTxt: '                ',
		note: 262,
		duration: 0
	};

	this.flagCmdSend = {
		wheelCmd: false,
		servoCmd: false,
		analogCmd: false,
		digitalCmd: false,
		rgbCmd: false,
		lcdCmd: false,
		toneCmd: false		
	};

	this.rxHeader = [0x52,0x58, 0x3D];

	this.sendBuffer = [];
	this.tmpBuffer = new Array(9);

	this.lcdState = 0;		
}

var XBOT = {
	RIGHT_WHEEL: 'rightWheel',
	LEFT_WHEEL: 'leftWheel',
	HEAD: 'head',
	ARMR: 'armR',
	ARML: 'armL',
	ANALOG_D5: 'analogD5',
	ANALOG_D6: 'analogD6',
	D4: 'D4',
	D7: 'D7',
	D12: 'D12',
	D13: 'D13',
	LED_R: 'ledR',
	LED_G: 'ledG',
	LED_B: 'ledB',
	LCD_NUM: 'lcdNum',
	LCD_TXT: 'lcdTxt',
	NOTE: 'note',
	DURATION: 'duration'
};

Module.prototype.init = function(handler, config) {
	//console.log(this.motoring.lcdTxt);
};
var i = 0;
Module.prototype.requestInitialData = function() {
	return [255,255,5,0,0,94,0,153,5,129,0,129,0,225,0,225,1,153,29,129,0,129,0,129,0,129,0,129,1,225,2,153,28,129,0,129,0,129,0,129,0,129,1,225,6,153,27,129,0,129,0,129,0,129,0,129,1,225,10,153,5,129,0,129,1,225,11,225,12,153,29,129,0,129,1,129,0,129,0,129,1,225,13,153,28,129,0,129,1,129,0,129,0,129,1,225,17,153,27,129,0,129,1,129,0,129,0,129,1,225,21,153,5,129,0,129,2,225,22,225,23,153,29,129,0,129,2,129,0,129,0,129,1,225,24,153,28,129,0,129,2,129,0,129,0,129,1,225,28,153,27,129,0,129,2,129,0,129,0,129,1,225,32,153,5,129,0,129,3,225,33,225,34,153,29,129,0,129,3,129,0,129,0,129,1,225,35,153,28,129,0,129,3,129,0,129,0,129,1,225,39,153,27,129,0,129,3,129,0,129,0,129,1,225,43,153,5,129,0,129,16,225,44,225,45,153,29,129,0,129,16,129,0,129,0,129,1,225,46,153,28,129,0,129,16,129,0,129,0,129,1,225,50,153,27,129,0,129,16,129,0,129,0,129,1,225,54,153,5,129,0,129,17,225,55,225,56,153,29,129,0,129,17,129,0,129,0,129,1,225,57,153,28,129,0,129,17,129,0,129,0,129,1,225,61,153,27,129,0,129,17,129,0,129,0,129,1,225,65,153,5,129,0,129,18,225,66,225,67,153,29,129,0,129,18,129,0,129,0,129,1,225,68,153,28,129,0,129,18,129,0,129,0,129,1,225,72,153,27,129,0,129,18,129,0,129,0,129,1,225,76,153,5,129,0,129,19,225,77,225,78,153,29,129,0,129,19,129,0,129,0,129,1,225,79,153,28,129,0,129,19,129,0,129,0,129,1,225,83,153,27,129,0,129,19,129,0,129,0,129,1,225,87,131,9,129,6,225,88,131,9,129,5,225,89,131,9,129,1,225,90,131,9,129,4,225,91,131,9,129,3,225,92,131,9,129,2,225,93];
};

Module.prototype.checkInitialData = function(data, config) {
	return true;
};

Module.prototype.ByteIndexOf = function(searched, find, start, end) {
	var matched = false;

	for (var index = start; index <= end - find.length; ++index)
    {
        // Assume the values matched.
        matched = true;

        // Search in the values to be found.
        for (var subIndex = 0; subIndex < find.length; ++subIndex)
        {
            // Check the value in the searched array vs the value
            // in the find array.
            if (find[subIndex] != searched[index + subIndex])
            {
                // The values did not match.
                matched = false;
                break;
            }
        }

        // If the values matched, return the index.
        if (matched)
        {
            // Return the index.
            return index;
        }
    }

    // None of the values matched, return -1.
    return -1;
};

// 하드웨어 데이터 처리
Module.prototype.handleLocalData = function(data) { // data: Native Buffer
	var buff = data;
	var fSize = data.length;

	var sensory = this.sensory;

	if(fSize >= 15) 
	{
		var index = this.ByteIndexOf(buff, this.rxHeader, 0, fSize);
		if (index != -1)
		{
		    var imageSize = this.makeWord(buff[index+3], buff[index+4]);
    
		    var imageBase = index + 5;
			
			//console.log('fSize' + fSize + ' imageBase ' + imageBase +' index ' + index +' imageSize ' + imageSize);			    

			if(imageSize == 10 && buff[imageBase+9] == 0x30) {
				sensory.adc0 = buff[imageBase];
				sensory.adc1 = buff[imageBase+1];
				sensory.adc2 = buff[imageBase+2];
				sensory.adc3 = buff[imageBase+3];
				sensory.light = buff[imageBase+4];
			    sensory.mic = buff[imageBase+5];

			    //console.log('Got adc data ! ' + sensory.adc0 + ' ' + sensory.adc1 + ' ' + sensory.adc2 + ' ' + sensory.adc3 + ' ' + sensory.light + ' ' + sensory.mic);

			    sensory.D2 = buff[imageBase+6];
			    sensory.D3 = buff[imageBase+7];
			    sensory.D11 = buff[imageBase+8];
			    //console.log('Got RX serial data ! ' + sensory.D2 + ' ' + sensory.D3 + ' ' + sensory.D11);
			}
		}		
	}

};

// Web Socket(엔트리)에 전달할 데이터
Module.prototype.requestRemoteData = function(handler) {
	var sensory = this.sensory;
	for(var key in sensory) {
		handler.write(key, sensory[key]);
	}
};

// Web Socket 데이터 처리
Module.prototype.handleRemoteData = function(handler) {
	var motoring = this.motoring;
	var flagCmdSend = this.flagCmdSend;	
	var newValue;

	if(handler.e(XBOT.RIGHT_WHEEL)) {
		newValue = handler.read(XBOT.RIGHT_WHEEL);
		if(newValue < -255) newValue = -255;
		else if(newValue > 255) newValue = 255;
		if(motoring.rightWheel != newValue)
		{
			motoring.rightWheel = newValue;
			flagCmdSend.wheelCmd = true;
		}
	}

	if(handler.e(XBOT.LEFT_WHEEL)) {
		newValue = handler.read(XBOT.LEFT_WHEEL);
		if(newValue < -255) newValue = -255;
		else if(newValue > 255) newValue = 255;
		if(motoring.leftWheel != newValue)
		{
			motoring.leftWheel = newValue;
			flagCmdSend.wheelCmd = true;
		}
	}

	if(handler.e(XBOT.HEAD)) {
		newValue = handler.read(XBOT.HEAD);
		if(newValue < 10) newValue = 10;
		else if(newValue > 170) newValue = 170;
		if(motoring.head != newValue)
		{
			motoring.head = newValue;
			flagCmdSend.servoCmd = true;
		}
	}

	if(handler.e(XBOT.ARMR)) {
		newValue = handler.read(XBOT.ARMR);
		if(newValue < 10) newValue = 10;
		else if(newValue > 170) newValue = 170;
		if(motoring.armR != newValue)
		{
			motoring.armR = newValue;
			flagCmdSend.servoCmd = true;
		}
	}	

	if(handler.e(XBOT.ARML)) {
		newValue = handler.read(XBOT.ARML);
		if(newValue < 10) newValue = 10;
		else if(newValue > 170) newValue = 170;
		if(motoring.armL != newValue)
		{
			motoring.armL = newValue;
			flagCmdSend.servoCmd = true;
		}
	}

	if(handler.e(XBOT.ANALOG_D5)) {
		newValue = handler.read(XBOT.ANALOG_D5);
		if(newValue < 0) newValue = 0;
		else if(newValue > 255) newValue = 255;
		if(motoring.analogD5 != newValue)
		{
			motoring.analogD5 = newValue;
			flagCmdSend.analogCmd = true;
		}
	}

	if(handler.e(XBOT.ANALOG_D6)) {
		newValue = handler.read(XBOT.ANALOG_D6);
		if(newValue < 0) newValue = 0;
		else if(newValue > 255) newValue = 255;
		if(motoring.analogD6 != newValue)
		{
			motoring.analogD6 = newValue;
			flagCmdSend.analogCmd = true;
		}
	}

	if(handler.e(XBOT.D4)) {
		newValue = handler.read(XBOT.D4);
		if(newValue < 0) newValue = 0;
		else if(newValue > 1) newValue = 1;
		if(motoring.D4 != newValue)
		{
			motoring.D4 = newValue;
			flagCmdSend.digitalCmd = true;
		}
	}

	if(handler.e(XBOT.D7)) {
		newValue = handler.read(XBOT.D7);
		if(newValue < 0) newValue = 0;
		else if(newValue > 1) newValue = 1;
		if(motoring.D7 != newValue)
		{
			motoring.D7 = newValue;
			flagCmdSend.digitalCmd = true;
		}
	}	

	if(handler.e(XBOT.D12)) {
		newValue = handler.read(XBOT.D12);
		if(newValue < 0) newValue = 0;
		else if(newValue > 1) newValue = 1;
		if(motoring.D12 != newValue)
		{
			motoring.D12 = newValue;
			flagCmdSend.digitalCmd = true;
		}
	}	

	if(handler.e(XBOT.D13)) {
		newValue = handler.read(XBOT.D13);
		if(newValue < 0) newValue = 0;
		else if(newValue > 1) newValue = 1;
		if(motoring.D13 != newValue)
		{
			motoring.D13 = newValue;
			flagCmdSend.digitalCmd = true;
		}
	}	


	if(handler.e(XBOT.LED_R)) {
		newValue = handler.read(XBOT.LED_R);
		if(newValue < 0) newValue = 0;
		else if(newValue > 255) newValue = 255;
		if(motoring.ledR != newValue)
		{
			motoring.ledR = newValue;
			flagCmdSend.rgbCmd = true;
		}
	}

	if(handler.e(XBOT.LED_G)) {
		newValue = handler.read(XBOT.LED_G);
		if(newValue < 0) newValue = 0;
		else if(newValue > 255) newValue = 255;
		if(motoring.ledG != newValue)
		{
			motoring.ledG = newValue;
			flagCmdSend.rgbCmd = true;
		}
	}

	if(handler.e(XBOT.LED_B)) {
		newValue = handler.read(XBOT.LED_B);
		if(newValue < 0) newValue = 0;
		else if(newValue > 255) newValue = 255;
		if(motoring.ledB != newValue)
		{
			motoring.ledB = newValue;
			flagCmdSend.rgbCmd = true;
		}
	}

	if(handler.e(XBOT.LCD_NUM)) {
		newValue = handler.read(XBOT.LCD_NUM);
		if(newValue < 0) newValue = 0;		
		else if(newValue > 1)  newValue = 1;
		if(motoring.lcdNum != newValue)
		{
			motoring.lcdNum = newValue;
			flagCmdSend.lcdCmd = true;
			this.lcdState = 0;
		}
	}

	if(handler.e(XBOT.LCD_TXT)) {
		newValue = handler.read(XBOT.LCD_TXT)+ '                ';
		if(motoring.lcdTxt != newValue)
		{
			motoring.lcdTxt = newValue;
			flagCmdSend.lcdCmd = true;
			this.lcdState = 0;			
		}
	}

	if(handler.e(XBOT.NOTE)) {
		newValue = handler.read(XBOT.NOTE);
		if(newValue < 65) newValue = 65;
		else if(newValue > 4186)  newValue = 4186;
		if(motoring.note != newValue)
		{
			motoring.note = newValue;
			flagCmdSend.toneCmd = true;			
		}
	}

	if(handler.e(XBOT.DURATION)) {
		newValue = handler.read(XBOT.DURATION);
		if(newValue < 0) newValue = 0;
		else if(newValue > 250)  newValue = 250;
		if(motoring.duration != newValue)
		{
			motoring.duration = newValue;
			flagCmdSend.toneCmd = true;
		}
	}

	//console.log('handleRemoteData');
};


// 하드웨어에 전달할 데이터
Module.prototype.requestLocalData = function() {
	return [255,255,5,0,0,94,0,153,5,129,0,129,0,225,0,225,1,153,29,129,0,129,0,129,0,129,0,129,1,225,2,153,28,129,0,129,0,129,0,129,0,129,1,225,6,153,27,129,0,129,0,129,0,129,0,129,1,225,10,153,5,129,0,129,1,225,11,225,12,153,29,129,0,129,1,129,0,129,0,129,1,225,13,153,28,129,0,129,1,129,0,129,0,129,1,225,17,153,27,129,0,129,1,129,0,129,0,129,1,225,21,153,5,129,0,129,2,225,22,225,23,153,29,129,0,129,2,129,0,129,0,129,1,225,24,153,28,129,0,129,2,129,0,129,0,129,1,225,28,153,27,129,0,129,2,129,0,129,0,129,1,225,32,153,5,129,0,129,3,225,33,225,34,153,29,129,0,129,3,129,0,129,0,129,1,225,35,153,28,129,0,129,3,129,0,129,0,129,1,225,39,153,27,129,0,129,3,129,0,129,0,129,1,225,43,153,5,129,0,129,16,225,44,225,45,153,29,129,0,129,16,129,0,129,0,129,1,225,46,153,28,129,0,129,16,129,0,129,0,129,1,225,50,153,27,129,0,129,16,129,0,129,0,129,1,225,54,153,5,129,0,129,17,225,55,225,56,153,29,129,0,129,17,129,0,129,0,129,1,225,57,153,28,129,0,129,17,129,0,129,0,129,1,225,61,153,27,129,0,129,17,129,0,129,0,129,1,225,65,153,5,129,0,129,18,225,66,225,67,153,29,129,0,129,18,129,0,129,0,129,1,225,68,153,28,129,0,129,18,129,0,129,0,129,1,225,72,153,27,129,0,129,18,129,0,129,0,129,1,225,76,153,5,129,0,129,19,225,77,225,78,153,29,129,0,129,19,129,0,129,0,129,1,225,79,153,28,129,0,129,19,129,0,129,0,129,1,225,83,153,27,129,0,129,19,129,0,129,0,129,1,225,87,131,9,129,6,225,88,131,9,129,5,225,89,131,9,129,1,225,90,131,9,129,4,225,91,131,9,129,3,225,92,131,9,129,2,225,93];
};

Module.prototype.XBOTcmdBuild = function(cmd, d0, d1, d2, d3, d4) {
	this.tmpBuffer[0] = 0x58; // header1
	this.tmpBuffer[1] = 0x52; // header2
	this.tmpBuffer[2] = cmd & 0xff;
	this.tmpBuffer[3] = d0 & 0xff;
	this.tmpBuffer[4] = d1 & 0xff;
	this.tmpBuffer[5] = d2 & 0xff;
	this.tmpBuffer[6] = d3 & 0xff;
	this.tmpBuffer[7] = d4 & 0xff;	
	this.tmpBuffer[8] = 0x53; // tail
};

Module.prototype.makeWord = function(hi, lo) {
	return (((hi & 0xff) << 8) | (lo & 0xff));
};

Module.prototype.getLowByte = function(a) {
	return (a & 0xff);
};

Module.prototype.getHighByte = function(a) {
	return ((a >> 8) & 0xff);
};

Module.prototype.reset = function() {
};

module.exports = new Module();