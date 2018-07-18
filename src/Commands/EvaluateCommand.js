const util = require('util');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const formatArbitrary = require('../Util/formatArbitrary');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Evaluate extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'eval',
			aliases: [
				'run'
			],
			description: 'Runs JavaScript code within the process.',
			category: 'Developers',
			usage: 'eval <code...>',
			hidden: true,
			guildOnly: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg, args) {
		this.db.all('SELECT count(*) AS count FROM developers WHERE id = ?', msg.author.id, async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (developer[0].count < 1) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			try {
				let result = await eval(args.join(' '));
				if (typeof result !== 'string') result = util.inspect(result);
				result = formatArbitrary(result);
				if (result.length > 1992) {
					uploadToHastebin(result).then((url) => {
						msg.channel.createMessage(':outbox_tray:   **»**   ' + url);
					}).catch((error) => {
						msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`');
					});
				} else {
					msg.channel.createMessage('```js\n' + result + '```');
				}
			} catch (e) {
				msg.channel.createMessage('```js\n' + e + '```');
			}
		});
	}
}

module.exports = Evaluate;
