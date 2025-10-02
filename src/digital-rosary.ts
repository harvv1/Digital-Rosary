import * as readline from 'readline';
import { mysteries, dayNames, prayers } from './data.ts';

const rl = readline.createInterface(process.stdin, process.stdout);

//SOURCE: https://rosarycenter.org/how-to-pray-the-rosary/

const boxed = (variable) => {
	return ` ╔════════════════════╗
║ ${variable} ║
╚════════════════════╝
`.trim();
};

const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
const mysteryToday = dayNames[dayOfWeek.toString()];
let mysteryNumber = 1;

//const meditation = `${mysteries[mysteryToday][mysteryNumber].meditation}`;
const tenHailMarys = [];

const prayersObj = {
	get startingPrayers() {
		return [
			`☩ Make the Sign of the Cross ☩\n\n${prayers.SignOfCross}`,
			`☩ Pray the "Apostles' Creed" ☩\n\n${prayers.ApostlesCreed}`,
			`☩ Pray the "Our Father" ☩\n\n${prayers.OurFather}`,
			`☩ Pray a "Hail Mary" for Faith ☩\n\n${prayers.HailMary}`,
			`☩ Pray a "Hail Mary" for Hope ☩\n\n${prayers.HailMary}`,
			`☩ Pray a "Hail Mary" for Charity ☩\n\n${prayers.HailMary}`,
			`☩ Pray the "Glory be" ☩\n\n${prayers.GloryBe}`,
			`☩ Today is ${dayOfWeek} so we meditate on the 5 ${mysteryToday} mysteries ☩`,
		];
	},

	get hailMarys() {
		for (let prayerIndex = 1; prayerIndex <= 10; prayerIndex++) {
			tenHailMarys[prayerIndex - 1] =
				`☩ Meditate ☩ \n\n ${prayerIndex}. ${mysteries[mysteryToday][mysteryNumber][prayerIndex]}\n\n ☩ Pray a "Hail Mary" ☩\n\n${prayers['HailMary']}\n\n ☩ ${mysteries[mysteryToday][mysteryNumber].description} ☩`;
		}
		return tenHailMarys;
	},

	get mysteryPrayers() {
		return [
			`☩ Announce ${mysteries[mysteryToday][mysteryNumber].description} ☩`,
			`☩ Pray the "Our Father" ☩\n\n${prayers.OurFather}`,
			`☩ While meditating on ${mysteries[mysteryToday][mysteryNumber].name} ☩`,
			...this.hailMarys,
			`☩ Pray the "Glory be" ☩\n\n${prayers.GloryBe}`,
			`☩ Pray the "Oh My Jesus"☩\n\n${prayers.OhMyJesus}`,
		];
	},
	get finalPrayers() {
		return [
			`☩ Pray the "Hail Holy Queen"☩\n\n${prayers.HailHolyQueen}`,
			`☩ Pray the "Final Prayer"☩\n\n${prayers.FinalPrayer}`,
			`☩ Make the Sign of the Cross ☩\n\n${prayers.SignOfCross}`,
		];
	},
};

const pray = async (element): Promise<void> => {
	return new Promise((resolve) => {
		console.clear();
		console.log(boxed('♱ DIGITAL ROSARY ♱'));
		console.log(`\n ${element} \n`);
		rl.question('[ Press enter to continue ]', () => {
			resolve();
		});
	});
};

const prayRosary = async () => {
	// make it so you can go backwards and forwards from each part
	for await (const prayer of prayersObj.startingPrayers) {
		await pray(prayer);
	}
	for (let index = 0; index <= 4; index++) {
		for await (const prayer of prayersObj.mysteryPrayers) {
			await pray(prayer);
		}
		mysteryNumber++;
	}

	for await (const prayer of prayersObj.finalPrayers) {
		await pray(prayer);
	}

	console.clear();
	rl.close();
};

prayRosary();
