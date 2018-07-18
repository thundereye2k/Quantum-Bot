const config = require('../config.json');
const MessageHandler = require('../Structure/MessageHandler');

class MessageFilter extends MessageHandler {
	constructor(bot, db) {
		super(0);
		this.bot = bot;
		this.db = db;
	}

	execute(msg, next) {
		this.db.run('UPDATE statistics SET value = (value + 1) WHERE name = "messages"');
		this.bot.statistics.messages++;
		this.bot.guilds.get('463447370932289546').channels.get('468987785949478912').edit({ name: '💭 Messages: ' + this.bot.statistics.messages.toLocaleString() }); // temporary
		if (!this.bot.ready || !msg.author || msg.author.bot) return;
		msg.prefix = config.prefix;
		next();
	}
}

module.exports = MessageFilter;