const util = require("util");
const exec = util.promisify(require("child_process").exec);
let count = 0;

main();

function click(device) {
  setInterval(() => {
    exec(
      "adb -s " + device.id + " shell input tap " + getCoordinate(device.model),
      (error, stdout, stderr) => {
        Error(error);
        count++;
        console.log(`click: ${count}`);
      }
    );
  }, getRandomInt(9000, 11000));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function CoordinateDevice() {
  return {
    Aris: [472, 819, 1619, 1670],
    "SM-M515F": [489, 819, 1722, 1747],
    "SM-A346E": [489, 819, 1722, 1747],
  };
}
function ggg(v) {
  const result = getRandomInt(v[0], v[1]) + " " + getRandomInt(v[2], v[3]);
  console.log(result);
  return result;
}
function getCoordinate(model) {
  return ggg(CoordinateDevice()[model]);
}
function Error(error) {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
}
async function main() {
  const devices = await getDevices();
  devices.forEach((device) => {
    console.log(`Device: ${device.model} - ${device.id}`);
    click(device);
  });
}
async function getDevices() {
  const dIDs = await getDeviceIds();
  const devices = await Promise.all(
    dIDs.map(async (deviceId) => {
      return {
        id: deviceId,
        model: await getDeviceModel(deviceId),
      };
    })
  );
  return devices;
}

async function getDeviceIds() {
  const { stdout, stderr } = await exec("adb devices -l");
  let devices = stdout.split("\n");
  devices = devices.slice(1, devices.length - 2);
  devices = devices.map((device) => device.split("\t")[0].split(" ")[0]);
  return devices;
}

async function getDeviceModel(deviceId) {
  const { stdout, stderr } = await exec(
    "adb -s " + deviceId + " shell getprop ro.product.model"
  );
  return stdout.trim();
}
