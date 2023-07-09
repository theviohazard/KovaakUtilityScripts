const fs = require("fs");
const kovaakStatsFolderPath = `C:\\SteamLibrary\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats`;

const parseStatFiles = (path = kovaakStatsFolderPath) => {
	console.time("Time took to parse stat files");
	process.stdout.write("Started parsing stats files...\n");
	process.stdout.write(`Reading stats folder at ${path}. . .`);
	const files = fs.readdirSync(path),
		output = [];

	for (let fileName of files) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`Reading ${fileName}`);

		const raw = fs.readFileSync(`${path}\\${fileName}`, "utf8"),
			metadata = fs.statSync(`${path}\\${fileName}`, "utf8"),
			data = parseStatFileContent(raw);

		output.push({
			fileName,
			raw,
			metadata,
			data,
		});
	}

	process.stdout.clearLine(0);
	process.stdout.moveCursor(0, -1);
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(`Finished parsing through ${files.length} stats files!\n`);
	console.timeEnd("Time took to parse stat files");

	return output;
};

const parseStatFileContent = (fileContent) => {
	const splitFileContent = splitCSVIntoSections(fileContent),
		feed = turnCSVIntoObjects(splitFileContent[0]),
		final = turnCSVIntoObjects(splitFileContent[1])[0],
		loose = turnLooseCSVIntoObject(splitFileContent[2]);

	return {
		feed,
		...final,
		...loose,
	};
};

const splitCSVIntoSections = (fileContent) => {
	const splitContent = fileContent.split("\r\n\n");
	return splitContent;
};

const turnCSVIntoObjects = (csvContent) => {
	const lines = csvContent.split("\r\n");
	let output = [],
		headerKeys = [];

	for (let line of lines) {
		const fields = line.split(",");
		if (headerKeys.length === 0) {
			headerKeys = fields;
		} else {
			let data = {};
			for (let fieldIndex in fields) {
				const isDataNotComplete = fields[fieldIndex].length === 0 || headerKeys[fieldIndex].length === 0;
				if (isDataNotComplete) continue;

				const header = headerKeys[fieldIndex],
					value = fields[fieldIndex];
				data[header] = value;
			}
			output.push(data);
		}
	}

	return output;
};

const turnLooseCSVIntoObject = (csvContent) => {
	const lines = csvContent.split("\n");
	let output = {};

	for (let line of lines) {
		if (line.length === 0) continue;

		const fields = line.split(":,");
		if (fields[0] && fields[1]) output[fields[0]] = fields[1];
	}

	return output;
};

module.exports = parseStatFiles;

if (require.main === module) {
	const stats = parseStatFiles();
	console.log(stats);
}
