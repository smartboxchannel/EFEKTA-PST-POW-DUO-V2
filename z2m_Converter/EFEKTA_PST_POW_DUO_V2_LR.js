// ############################################################################//
//                                                                             //
//    ... перезагрузить z2m, что бы конвертер применился                       //
//                                                                             //
//#############################################################################//


const reporting = require('zigbee-herdsman-converters/lib/reporting');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;
const ea = exposes.access;
const {
    battery,
    binary,
    enumLookup,
    numeric,
	pressure,
    temperature,
	deviceEndpoints,
} = require('zigbee-herdsman-converters/lib/modernExtend');

const defaultReporting = {min: 0, max: 300, change: 0};
const normalReporting = {min: 0, max: 3600, change: 0};
const rareReporting = {min: 0, max: 21600, change: 0};
const rarestReporting = {min: 0, max: 64800, change: 0};
const oneReporting = {min: 45, max: 1800, change: 1};
const twoReporting = {min: 45, max: 1800, change: 10};
const threeReporting = {min: 5, max: 1800, change: 1};
const fourReporting = {min: 15, max: 1800, change: 10};
const fiveReporting = {min: 1800, max: 10600, change: 1};
const sixReporting = {min: 3600, max: 21600, change: 1};


const definition = {
    zigbeeModel: ['EFEKTA_PST_POW_DUO_V2_LR'],
    model: 'EFEKTA_PST_POW_DUO_V2_LR',
    vendor: 'EfektaLab',
    description: '[EFEKTA PST POW DUO V2 LR - Smart water/gas pressure monitor with two sensors with, signal amplifier. Two types of power supply: USB and batteries.](http://efektalab.com/PST_DUO)',
    extend: [
            deviceEndpoints({endpoints: {"1": 1, "2": 2}}),
            pressure({
                endpointNames: ['1'],
				description: 'Measured value of the first pressure sensor',
                reporting: oneReporting,
                access: 'STATE',
            }),
            numeric({
                endpointNames: ['1'],
                name: 'bar',
                unit: 'bar',
                cluster: 'msPressureMeasurement',
                attribute: 'measuredValue',
                description: 'Measured value of the first pressure sensor in bar',
                scale: 1000,
                precision: 2,
                access: 'STATE',
            }),
            numeric({
                endpointNames: ['1'],
                name: 'psi',
                unit: 'psi',
                cluster: 'msPressureMeasurement',
                attribute: 'measuredValue',
                description: 'Measured value of the first pressure sensor psi',
                scale: 68.94757,
                precision: 2,
                access: 'STATE',
            }),
            temperature({
                endpointNames: ['1'],
                description: 'Measured value of the first temperature sensor',
                reporting: twoReporting,
                access: 'STATE',
            }),
            numeric({
                endpointNames: ['1'],
                name: 'pressure_offset',
                unit: 'kPa',
                valueMin: -1000.0,
                valueMax: 1000.0,
                cluster: 'msPressureMeasurement',
                attribute: {ID: 0x0210, type: 0x29},
                description: 'Adjust first pressure sensor',
				access: "STATE_SET",
            }),
            numeric({
                endpointNames: ["1"],
                name: "temperature_offset",
                unit: "°C",
                valueMin: -25,
                valueMax: 25,
                valueStep: 0.1,
                scale: 10,
                cluster: "msTemperatureMeasurement",
                attribute: {ID: 0x0210, type: 0x29},
                description: "Adjust temperature sensor",
                access: "STATE_SET",
            }),
            pressure({
                endpointNames: ['2'],
				description: 'Measured value of the second pressure sensor',
                reporting: oneReporting,
                access: 'STATE',
            }),
            numeric({
                endpointNames: ['2'],
                name: 'bar',
                unit: 'bar',
                cluster: 'msPressureMeasurement',
                attribute: 'measuredValue',
                description: 'Measured value of the second pressure sensor in bar',
                scale: 1000,
                precision: 2,
                access: 'STATE',
            }),
            numeric({
                endpointNames: ['2'],
                name: 'psi',
                unit: 'psi',
                cluster: 'msPressureMeasurement',
                attribute: 'measuredValue',
                description: 'Measured value of the second pressure sensor in psi',
                scale: 68.94757,
                precision: 2,
                access: 'STATE',
            }),
            temperature({
                endpointNames: ['2'],
                description: 'Measured value of the second temperature sensor',
                reporting: twoReporting,
                access: 'STATE',
            }),
            numeric({
                endpointNames: ['2'],
                name: 'pressure_offset',
                unit: 'kPa',
                valueMin: -100.0,
                valueMax: 100.0,
                cluster: 'msPressureMeasurement',
                attribute: {ID: 0x0210, type: 0x29},
                description: 'Adjust second pressure sensor',
				access: "STATE_SET",
            }),
            numeric({
                endpointNames: ["2"],
                name: "temperature_offset",
                unit: "°C",
                valueMin: -25,
                valueMax: 25,
                valueStep: 0.1,
                scale: 10,
                cluster: "msTemperatureMeasurement",
                attribute: {ID: 0x0210, type: 0x29},
                description: "Adjust temperature sensor",
                access: "STATE_SET",
            }),
            numeric({
                name: 'mains_voltage',
                unit: 'V',
                cluster: 'genPowerCfg',
				attribute: 'mainsVoltage',
                description: 'Mains voltage',
				scale: 10,
				precision: 1,
				access: 'STATE_GET',
            }),
            battery({
                percentage: true,
                lowStatus: true,
                voltage: false,
                percentageReporting: true,
                percentageReportingConfig: fiveReporting,
            }),
            numeric({
                name: 'uptime',
                unit: 'Hours',
                cluster: 'genTime',
                attribute: 'localTime',
                description: 'Uptime',
                access: 'STATE',
            }),
            numeric({
                name: 'reading_interval',
                unit: 'sec',
                valueMin: 10,
                valueMax: 360,
                cluster: 'genPowerCfg',
                attribute: {ID: 0x0201, type: 0x21},
                description: 'Setting the sensor reading interval in seconds, by default 10 seconds',
				access: 'STATE_SET',
            }),
			enumLookup({
                name: 'sensor_type',
                lookup: {'0-1bar': 1, '0-5bar': 5, '0-6bar': 6, '0-8bar': 8, '0-10bar': 10, '0-12bar': 12, '0-40bar': 40},
                cluster: 'genPowerCfg',
                attribute: {ID: 0x0280, type: 0x20},
                description: 'Set sensor type',
				access: 'STATE_SET',
            }),
            enumLookup({
                name: 'tx_radio_power',
                lookup: {'4dbm': 4, '19dbm': 19},
                cluster: 'genPowerCfg',
                attribute: {ID: 0x0236, type: 0x28},
                description: 'Set TX Radio Power, dbm',
				access: 'STATE_SET',
            }),
            binary({
                name: 'smart_sleep',
                valueOn: ['ON', 1],
                valueOff: ['OFF', 0],
                cluster: 'genPowerCfg',
                attribute: {ID: 0x0216, type: 0x10},
                description: 'Enable Smart Sleep, short wakeup every 2-7 seconds',
				access: 'STATE_SET',
            }),
            binary({
                name: 'config_report_enable',
                valueOn: ['ON', 1],
                valueOff: ['OFF', 0],
                cluster: 'genPowerCfg',
                attribute: {ID: 0x0275, type: 0x10},
                description: 'Enable reporting based on reporting configuration',
            }),
            binary({
                name: 'comparison_previous_data',
                valueOn: ['ON', 1],
                valueOff: ['OFF', 0],
                cluster: 'genPowerCfg',
                attribute: {ID: 0x0205, type: 0x10},
                description: 'Enable сontrol of comparison with previous data',
            }),
        ],
};

module.exports = definition;