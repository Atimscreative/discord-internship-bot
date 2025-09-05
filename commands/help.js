import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows available commands for interns.");

export async function execute(interaction) {
  await interaction.reply({
    content:
      "👋 Available Commands:\n- `/verify [email]`\n- `/assign-role [stack]`",
    flags: 64,
  });
}
