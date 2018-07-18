const BaseCommand = require('../Structure/BaseCommand');

class Donate extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'donate',
			aliases: [
				'patreon'
			],
			description: 'Gives you the Patreon link to receive rewards.',
			category: 'Information',
			usage: 'donate',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg) {
		msg.channel.createMessage(':dollar:   **»**   Donating to Quantum gives you insane perks in-game. Check it out at our Patreon page: <https://patreon.com/QuantumSurvival>.');
	}
}

module.exports = Donate;