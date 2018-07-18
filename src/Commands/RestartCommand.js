const child_process = require('child_process');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const config = require('../config.json');

class Restart extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'restart',
			aliases: [
				'res'
			],
			description: 'Restarts the bot.',
			category: 'Developers',
			usage: 'restart',
			hidden: true,
			guildOnly: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg) {
		this.db.all('SELECT count(*) AS count FROM developers WHERE id = ?', msg.author.id, (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (developer[0].count < 1) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			msg.channel.createMessage(':arrows_counterclockwise:   **»**   Restarting the PM2 process...');
			child_process.exec('pm2 restart ' + config.pm2_process, (error) => {
				if (error) msg.channel.createMessage('```\n' + error + '```');
			});
		});
	}
}

module.exports = Restart;
