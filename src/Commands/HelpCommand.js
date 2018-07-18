const BaseCommand = require('../Structure/BaseCommand');

const emotes = {
	Economy: ':dollar:',
	Utility: ':wrench:',
	Information: ':newspaper:',
	Music: ':musical_note:',
	Fun: ':tada:',
	Moderation: ':shield:',
	Special: ':ribbon:',
	Reminders: ':hourglass_flowing_sand:'
};

class Help extends BaseCommand {
	constructor(bot, db) {
		super({
			command: 'help',
			aliases: [
				'cmds',
				'commands'
			],
			description: 'Gets a list of commands sent to your channel.',
			category: 'Information',
			usage: 'help',
			hidden: false
		});
		this.bot = bot;
		this.db = db;
	}

	execute(msg) {
		const categories = {};
		this.bot.commands.filter((command) => !command.hidden).forEach((command) => {
			if (!(command.category in categories)) categories[command.category] = [];
			categories[command.category].push(command.command);
		});
		msg.channel.createMessage({
			embed: {
				title: 'Command List',
				color: this.bot.embedColor,
				description: 'To use any of the commands below, use `' + msg.prefix + '<command>`. For example, `' + msg.prefix + 'prefix`.\n\n' + Object.keys(categories).map((category) => emotes[category] + ' **' + category + '**:\t' + categories[category].map((command) => '`' + command + '`').join(', ')).join('\n\n')
			}
		});
	}
}

module.exports = Help;