const displayTimesInConsole = require("./displayTimesInConsole");
const parseStatFiles = require("./parseStatFiles");

const getTimePlayedInScenariosInMilliseconds = (statFiles = parseStatFiles()) => {
	const activeScenarioPlaytime = {};

	for (let statFile of statFiles) {
		const challengeStart = statFile.data["Challenge Start"],
			pauseDurationInSeconds = parseInt(statFile.data["Pause Duration"]),
			splitFileName = statFile.fileName.split(" - "),
			dateFromFileName = splitFileName[2].split("-")[0].split(".").join("-"),
			challengeStartDate = convertDateToUTC(new Date(`${dateFromFileName}T${challengeStart}Z`)),
			fileCreatedAtDate = new Date(statFile.metadata.birthtime),
			playthroughLengthInMilliseconds = getScenarioPlaythroughLength(
				challengeStartDate,
				fileCreatedAtDate,
				pauseDurationInSeconds
			);

		scenarioName = splitFileName[0];
		if (!activeScenarioPlaytime[scenarioName]) activeScenarioPlaytime[scenarioName] = 0;

		activeScenarioPlaytime[scenarioName] += playthroughLengthInMilliseconds;
	}

	return activeScenarioPlaytime;
};

const convertDateToUTC = (date) => {
	const MINUTES_IN_MILLISECONDS = 60 * 1000,
		offsetInMinutes = date.getTimezoneOffset();
	return new Date(date.getTime() + offsetInMinutes * MINUTES_IN_MILLISECONDS);
};

const getScenarioPlaythroughLength = (timeStart, timeEnd, pauseDurationInSeconds) => {
	timeStart = timeStart.getTime() + parseInt(pauseDurationInSeconds) * 1000;
	timeEnd = timeEnd.getTime();

	if (timeStart > timeEnd) {
		const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
		timeEnd += DAY_IN_MILLISECONDS;
	}

	let timeDifferenceInMilliseconds = timeEnd - timeStart;
	return timeDifferenceInMilliseconds;
};

module.exports = getTimePlayedInScenariosInMilliseconds;

if (require.main === module) {
	const timePlayedInScenarios = getTimePlayedInScenariosInMilliseconds(),
		maxRows = 25;
	displayTimesInConsole(timePlayedInScenarios, "Scenarios", maxRows);
}
