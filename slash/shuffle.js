const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Brak utworów w kolejce")

		queue.shuffle()
        await interaction.editReply(`Kolejka ${queue.tracks.length} utworów została wymieszana!`)
	},
}
