const distributeMillisecondsToAllUnits = require("./distributeMillisecondsToAllUnits.js");
const timeUnitOrder = ["day", "hour", "minute", "second", "millisecond"];

const displayTimesInConsole = (times, title = "Time", maxRows = 25, sort = (a, b) => times[b] - times[a]) => {
	const timeUnitsUsed = {},
		rows = Object.keys(times)
			.sort(sort)
			.slice(0, maxRows)
			.map((timeObjKey) => {
				const distributedTime = distributeMillisecondsToAllUnits(times[timeObjKey]);
				timeUnitOrder.forEach((timeUnit) => {
					distributedTime[timeUnit + "s"] = distributedTime[timeUnit];
					if (distributedTime[timeUnit]) timeUnitsUsed[timeUnit] = true;
				});
				return {
					[title]: timeObjKey,
					...distributedTime,
				};
			});

	console.table(rows, [`${title}`, ...timeUnitOrder.filter((timeUnit) => timeUnitsUsed[timeUnit])]);
};

module.exports = displayTimesInConsole;
