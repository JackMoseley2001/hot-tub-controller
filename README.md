# Hot Tub Controller

A project which controls whether a hot tub heater is powered on or off depending on the current Octopus Agile rate.

## Requirements

This project can be run without any particular hardware but with limitations. Development mode disables all GPIO and temperature readings and therefore will not function as usual. To run at full potential, the below is needed:

- Raspberry Pi (with a distro install - such as raspbian)
- Relay Switch
- LED
- Waterproof temperature probe

## Usage

This project was designed to run on a Raspberry Pi to control a relay switch.

1. Clone this repo `git clone https://github.com/JackMoseley2001/hot-tub-controller.git`
2. Ensure NodeJS and NPM are installed, then run `npm install`
3. Use `npm run start:watch` to run a development version of the server
4. Use `npm run build` to build the project into a production build
5. Use `node build/server` to run the production server, or use a forever package (such as PM2) to run

When running, every 10 minutes the current status is checked, this includes the water temperature, price and override status.

At roughly 5pm, the tariffs are re-fetched from Octopus Agile and saved in memory. If no new tariffs have been fetched, it will repeat this process every 5 minutes until new tariffs are fetched.
