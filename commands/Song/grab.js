const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "grab", //the command name for the Slash Command
	category: "Song",
	usage: "grab",
	aliases: ["take", "steal"],
	description: "Chuyển đến vị trí cụ thể của bài hát", //the command description for Slash Command Overview
	cooldown: 10,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Tham gia kênh thoại của __của toi__ để sử dụng lệnh này`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
					],

				})
				let newTrack = newQueue.songs[0];
				member.send({
					content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
					embeds: [
						new MessageEmbed().setColor(ee.color)
						.setTitle(newTrack.name)
						.setURL(newTrack.url)
						.addField(`💡 Yêu cầu bởi:`, `>>> ${newTrack.user}`, true)
						.addField(`⏱ Thời hạn:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
						.addField(`🌀 Hàng đợi:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
						.addField(`🔊 Âm lượng:`, `>>> \`${newQueue.volume} %\``, true)
						.addField(`♾ Vòng lặp:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark} \`Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}`, true)
						.addField(`↪️ Tự động phát:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, true)
						.addField(`❔ Tải bài hát:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
						.addField(`❔ Bộ lọc : ${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
						.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
						.setFooter(`Đang phát ở: ${guild.name}`, guild.iconURL({
							dynamic: true
						})).setTimestamp()
					]
				}).then(() => {
					message.reply({
						content: `📪 **Thành công! Kiểm tra DMs của bạn!**`,
					})
				}).catch(() => {
					message.reply({
						content: `${client.allEmojis.x} **Vui lòng kiểm tra DMs của bạn đã bật chưa!!**`,
					})
				})
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],

				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
