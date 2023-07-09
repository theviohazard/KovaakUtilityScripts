const distributeMillisecondsToAllUnits = require("./distributeMillisecondsToAllUnits.js");

const displayTimesInConsole = (times, title = "Time", maxRows = 25, sort = (a, b) => times[b] - times[a]) => {
	const timeUnitsUsed = {},
		rows = Object.keys(times)
			.sort(sort)
			.slice(0, maxRows)
			.map((timeObjKey) => {
				const distributedTime = distributeMillisecondsToAllUnits(times[timeObjKey]);
				Object.keys(distributedTime).forEach((timeUnit) => {
					distributedTime[timeUnit + "s"] = distributedTime[timeUnit];
					if (distributedTime[timeUnit]) timeUnitsUsed[timeUnit] = true;
				});
				return {
					[title]: timeObjKey,
					...distributedTime,
				};
			});

	console.table(rows, [`${title}`, ...Object.keys(timeUnitsUsed).map((unit) => unit + "s")]);
};

module.exports = displayTimesInConsole;
