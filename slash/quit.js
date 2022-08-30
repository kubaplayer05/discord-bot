const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Stops the bot and clears the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Brak utworów w kolejce")

		queue.destroy()
        await interaction.editReply("Bye bye!")
	},
}
