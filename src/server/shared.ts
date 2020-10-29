import { EventEmitter } from 'events';
import { Gpio as GPIO } from 'onoff';
import { exec } from 'child_process';
import { readSimpleC } from 'ds18b20-raspi';

let RELAY_SWITCH, STATUS_LED;
const events = new EventEmitter();

if (!process.env.DEV) {
  RELAY_SWITCH = new GPIO(21, 'out');
  STATUS_LED = new GPIO(19, 'out');
}

function getCPUTemperature(): Promise<String> {
  return new Promise((accept, _) => {
    if (!process.env.DEV) {
      exec('vcgencmd measure_temp', (err, stdout, _) => {
        if (err) {
          console.log(err);
          accept('N/A');
        } else {
          let temp = stdout.split('=')[1] || stdout;
          accept(temp);
        }
      });
    } else {
      print('INFO: Running in DEV mode, fake device temperature reading');
      accept("0'C");
    }
  });
}

function getWaterTemperature(): number {
  if (process.env.DEV) {
    print('INFO: Running in DEV mode, fake water temperature reading');
    return 0;
  }

  let temperature: number | undefined = readSimpleC();

  if (!temperature) {
    print('WARNING: Water Temperate not found!');
    temperature = 0;
  }

  return Number(temperature.toFixed(1));
}

function setHeaterStatus(status: boolean) {
  if (process.env.DEV) {
    return;
  }

  if (status === true) {
    // Turn heater on
    RELAY_SWITCH.writeSync(GPIO.HIGH);
    STATUS_LED.writeSync(GPIO.HIGH);
  } else {
    // Turn heater off
    RELAY_SWITCH.writeSync(GPIO.LOW);
    STATUS_LED.writeSync(GPIO.LOW);
  }
}

function currentDateStr() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months count from 0!
  const year = currentDate.getFullYear();
  return `${day}/${month}/${year}`;
}

function currentTimeStr() {
  const currentDate = new Date();
  const timeFormatOptions = { hour12: false, hour: '2-digit', minute: '2-digit' };
  return currentDate.toLocaleTimeString(undefined, timeFormatOptions);
}

function print(msg: string) {
  console.log(`${currentDateStr()} @ ${currentTimeStr()}: ${msg}`);
}

function shouldUpdateStatus() {
  events.emit('updateStatus');
}

export {
  getCPUTemperature,
  getWaterTemperature,
  setHeaterStatus,
  print,
  events,
  shouldUpdateStatus,
  currentDateStr,
  currentTimeStr
};

process.on('SIGINT', _ => {
  if (!process.env.DEV) {
    RELAY_SWITCH.unexport();
    STATUS_LED.unexport();
  }
});
