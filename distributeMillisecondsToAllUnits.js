const timeUnits = {
	day: (date) => {
		return Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
	},
	hour: (date) => {
		return date.getUTCHours();
	},
	minute: (date) => {
		return date.getUTCMinutes();
	},
	second: (date) => {
		return date.getUTCSeconds();
	},
	millisecond: (date) => {
		return date.getUTCMilliseconds();
	},
};

const distributeMillisecondsToAllUnits = (totalMilliseconds) => {
	const date = new Date(totalMilliseconds),
		output = {};

	for (let timeUnitKey in timeUnits) {
		const time = timeUnits[timeUnitKey](date);
		output[timeUnitKey] = time;
	}
	return output;
};

module.exports = distributeMillisecondsToAllUnits;
