const config = require('./config.js');
const { Client, WebhookClient } = require('discord.js');
const Twit = require('twit');
const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_BANS',
		'GUILD_MEMBERS',
		'GUILD_MESSAGES',
		'DIRECT_MESSAGES',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_EMOJIS_AND_STICKERS'
	]
});

client.twitter = new Twit({
	consumer_key: config.twitter.apikey,
	consumer_secret: config.twitter.secret,
	access_token: config.twitter.accessToken,
	access_token_secret: config.twitter.accessTokenSecret,
	timeout_ms: 60 * 1000,
	strictSSL: true,
});

// Tweets stream
client.on('ready', async () => {
	console.log('[ZULY SOCIAL MEDIA] Services ready!');
	const tweets = await client.twitter.stream('statuses/filter', { follow: ['845716781482303489', '1281564741543120897'] });
	tweets.on('tweet', tweet => {
		const hook = new WebhookClient({
			id: config.webhook.id,
			token: config.webhook.token
		});

		const url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
		hook.send({
			username: tweet.user.name,
			avatarURL: tweet.user.profile_image_url_https,
			content: `\`\`\`${tweet.text}\`\`\`\n🔗 › ${url}`
		});
	});
});

client.login(config.client.token);