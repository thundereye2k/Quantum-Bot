const BaseCommand = require('../Structure/BaseCommand');

class Ping extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'ping',
			aliases: [],
			description: 'Check how long it takes to send a message.',
			category: 'Information',
			usage: 'ping',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg) {
		msg.channel.createMessage(':ping_pong:   **»**   Pinging...').then((m) => {
			m.edit(':ping_pong:   **»**   Pong! `' + (Date.now() - m.timestamp) + 'ms`');
		});
	}
}

module.exports = Ping;