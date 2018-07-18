const util = require('util');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const uploadToHastebin = require('../Util/uploadToHastebin');

class Reload extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'sql',
			aliases: [],
			description: 'Executes SQL on the database.',
			category: 'Developers',
			usage: 'reload',
			hidden: true,
			guildOnly: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg, args) {
		this.db.all('SELECT count(*) AS count FROM developers WHERE id = ?', msg.author.id, (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (developer[0].count < 1) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			this.db.all(args.join(' '), (error, output) => {
				const result = error || util.inspect(output);
				if (result.length > 1992) {
					uploadToHastebin(result).then((url) => {
						msg.channel.createMessage(':outbox_tray:   **»**   ' + url);
					}).catch((error) => {
						msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`');
					});
				} else {
					msg.channel.createMessage('```js\n' + result + '```');
				}
			});
		});
	}
}

module.exports = Reload;