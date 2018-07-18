const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const SQLite = require('sqlite3');
const config = require('./config.json');
const Collection = require('./Structure/Collection');
const Logger = require('./Util/Logger');

class Client {
	constructor() {
		this.bot = new Eris(config.token, config.client_options);
		this.db = new SQLite.Database('database.db');
	}

	launch() {
		this.bot.embedColor = 3066993; // 15277667
		this.bot.commands = new Collection();
		this.bot.reminders = new Collection();
		this.bot.messageHandlers = [];
		this.bot.statistics = {
			messages: 0
		};

		this.db.run('CREATE TABLE IF NOT EXISTS developers (id TEXT);');
		this.db.run('CREATE TABLE IF NOT EXISTS statistics (name TEXT, value INT);');

		this.loadCommand(path.join(__dirname, 'Commands'));
		this.loadEvents(path.join(__dirname, 'Events'));
		this.loadMessageHandlers(path.join(__dirname, 'MessageHandlers'));

		process.on('unhandledRejection', (error) => {
			if (error.code && (error.code === 50006 || error.code === 50007 || error.code === 50013)) return;
			Logger.error(error);
		});

		process.on('exit', () => {
			this.bot.db.close();
			this.bot.disconnect({ reconnect: false });
		});

		this.bot.connect();
	}

	loadCommand(dir) {
		fs.readdir(dir, (error, commands) => {
			if (error) throw error;
			for (let i = 0; i < commands.length; i++) {
				const Command = require(path.join(dir, commands[i]));
				const command = new Command(this.bot, this.db);
				command.file = path.join(dir, commands[i]);
				this.bot.commands.set(command.command, command);
			}
		});
	}

	loadEvents(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const event = require(path.join(dir, events[i]));
				event(this.bot, this.db);
			}
		});
	}

	loadMessageHandlers(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const Handler = require(path.join(dir, events[i]));
				this.bot.messageHandlers.push(new Handler(this.bot, this.db));
				if (i + 1 === events.length) {
					this.bot.messageHandlers = this.bot.messageHandlers.sort((a, b) => {
						if (a.position > b.position) return 1;
						if (b.position > a.position) return -1;
						return 0;
					});
				}
			}
		});
	}
}

module.exports = Client;
