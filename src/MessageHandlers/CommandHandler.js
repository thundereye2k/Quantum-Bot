const MessageHandler = require('../Structure/MessageHandler');
const Logger = require('../Util/Logger');

class CommandHandler extends MessageHandler {
	constructor(bot, db) {
		super(1);
		this.bot = bot;
		this.db = db;
	}

	execute(msg, next) {
		if (!msg.content.startsWith(msg.prefix)) return next();
		const command = msg.content.split(' ')[0].replace(msg.prefix, '').toLowerCase();
		const commands = this.bot.commands.filter((c) => c.command === command || c.aliases.includes(command));
		const args = msg.content.replace(/ {2,}/g, ' ').replace(msg.prefix, '').split(' ').slice(1);
		if (commands.length > 0) {
			if (!msg.channel.guild && (typeof commands[0].guildOnly === 'function' ? commands[0].guildOnly(msg, args) : commands[0].guildOnly)) return msg.channel.createMessage(this.i18n.__({ phrase: 'noDM', locale: msg.locale }));
			try {
				commands[0].execute(msg, args);
			} catch (e) {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error('Failed to run command.', e);
			}
		}
	}
}

module.exports = CommandHandler;