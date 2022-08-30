const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Brak utworów w kolejce")

		queue.setPaused(false)
        await interaction.editReply("Utwór wznowiony! Napisz `/pause` aby zatrzymać.")
	},
}
