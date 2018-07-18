const child_process = require('child_process');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const formatArbitrary = require('../Util/formatArbitrary');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Execute extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'exec',
			aliases: [
				'bash'
			],
			description: 'Executes command in the host console.',
			category: 'Developers',
			usage: 'exec <command...>',
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
			child_process.exec(args.join(' '), (error, stdout, stderr) => {
				const result = formatArbitrary(stderr || stdout);
				if (result.length > 1992) {
					uploadToHastebin(result).then((url) => {
						msg.channel.createMessage(':outbox_tray:   **»**   ' + url);
					}).catch((error) => {
						msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`');
					});
				} else {
					msg.channel.createMessage('```bash\n' + result + '```');
				}
			});
		});
	}
}

module.exports = Execute;