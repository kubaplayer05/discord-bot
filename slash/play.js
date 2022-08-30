const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("loads songs from youtube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Loads a single song from a url")
				.addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Loads a playlist of songs from a url")
				.addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for sogn based on provided keywords")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("the search keywords").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Musisz być na kanale głosowym!")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Brak wyników")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** utwór dodany do kolejki`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Czas trwania: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Brak wyników")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} utwór z [${playlist.title}](${playlist.url})** został dodany do kolejki.`)
                .setThumbnail(playlist.thumbnail)
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Brak wyników")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** utwór został dodany do kolejki`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Czas trwania: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}
