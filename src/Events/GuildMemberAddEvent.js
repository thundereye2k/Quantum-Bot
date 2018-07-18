const config = require('../config.json');

module.exports = (bot) => {
	bot.on('guildMemberAdd', (guild) => {
		guild.channels.get(config.channels.totalMembers).edit({ name: '👪 Members: ' + guild.memberCount.toLocaleString() });
	});
};