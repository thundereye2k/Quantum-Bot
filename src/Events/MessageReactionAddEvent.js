const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, db) => {
	bot.on('messageReactionAdd', (message, emoji, userID) => {
		message.channel.getMessage(message.id).then((message) => {
			if (emoji.name === '❌' && message.author.id === bot.user.id) {
				db.all('SELECT count(*) AS count FROM developers WHERE id = ?', userID, (error, developer) => {
					if (error) return handleDatabaseError(error);
					if (developer[0].count < 1) return;
					message.delete();
				});
			}
		}).catch(() => {});
	});
};