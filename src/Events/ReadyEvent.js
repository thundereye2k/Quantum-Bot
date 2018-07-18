const Logger = require('../Util/Logger.js');
const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, db) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');

		const guild = bot.guilds.get('463447370932289546');

		guild.channels.get('468975202689351690').edit({ name: '👪 Members: ' + guild.memberCount.toLocaleString() });

		db.all('SELECT * FROM statistics WHERE name = "messages"', (error, messages) => {
			if (error) return handleDatabaseError(error);
			bot.statistics.messages = messages.length > 0 ? messages[0].value : 0;
		});

		setInterval(() => {
			guild.channels.get('468987785949478912').edit({ name: '💭 Messages: ' + bot.statistics.messages.toLocaleString() });
		}, 1000 * 60);
	});
};