const displayTimesInConsole = require("./displayTimesInConsole");
const getTimePlayedInScenariosInMilliseconds = require("./getTimePlayedInScenarios");
const parseStatFiles = require("./parseStatFiles");

const getTotalTimePlayedInScenariosFromKovaak = (statFiles = parseStatFiles()) => {
	const timePlayedInScenarios = getTimePlayedInScenariosInMilliseconds(statFiles),
		totalTimePlayedInScenariosInMilliseconds = Object.keys(timePlayedInScenarios).reduce(
			(totalTimeInMilliseconds, scenarioNameKey) =>
				totalTimeInMilliseconds + timePlayedInScenarios[scenarioNameKey],
			0
		);

	return totalTimePlayedInScenariosInMilliseconds;
};

module.exports = getTotalTimePlayedInScenariosFromKovaak;

if (require.main === module) {
	const totalTimePlayedInScenarios = getTotalTimePlayedInScenariosFromKovaak();
	displayTimesInConsole({ Total: totalTimePlayedInScenarios });
}
