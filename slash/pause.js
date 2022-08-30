const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Brak utworów w kolejce")

		queue.setPaused(true)
        await interaction.editReply("Utwór zatrzymany! Napisz `/resume` aby wznowić.")
	},
}
