const fs = require('fs');
const moment = require('moment');
const timeRegex = /^(?:[0-9])(([0-9:,]+)([\s->]+)([0-9:,]+))$/;
const timeRegexPart = /^(?:[0-9])(([0-9:,]+))$/;
let output;

let incrementby = {
	seconds: 0,
	minutes: 0,
	hours: 0
};

let reducedby = {
	seconds: 0,
	minutes: 0,
	hours: 0
};
//@ts-ignore
function modifyDate(dateToModify) {
	return moment(dateToModify, 'HH:mm:ss')
		.add(incrementby['seconds'], 'seconds')
		.add(incrementby['minutes'], 'minutes')
		.add(incrementby['hours'], 'hours')
		.subtract(reducedby['seconds'], 'seconds')
		.subtract(reducedby['minutes'], 'minutes')
		.subtract(reducedby['hours'], 'hours')
		.format('HH:mm:ss');
}

fs.readFile('./ex.srt', 'utf8', function(err, data) {
	const inner = data.split('\n');
	output = inner.map(item => {
		let line = item;
		if (timeRegex.test(line)) {
			const splitTime = line.split(' --> ');
			let start = splitTime[0].split(',')[0];
			let startms = splitTime[0].split(',')[1];
			let end = splitTime[1].split(',')[0];
			let endms = splitTime[1].split(',')[1];
			start = modifyDate(start);
			end = modifyDate(end);
			line = `${start},${startms} --> ${end},${endms}`;
		}
		return line;
	});
	output = output.join('\n');
	fs.writeFileSync('./output.str', output);
});
