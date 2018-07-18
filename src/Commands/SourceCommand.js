const BaseCommand = require('../Structure/BaseCommand');

class Balance extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'source',
			aliases: [
				'src'
			],
			description: 'Gets the source of the bot on GitHub.',
			category: 'Information',
			usage: 'source',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg) {
		msg.channel.createMessage(':gear:   **»**   <https://github.com/PassTheMayo/Quantum-Bot>');
	}
}

module.exports = Balance;