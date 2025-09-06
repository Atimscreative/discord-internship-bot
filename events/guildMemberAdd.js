// // events/guildMemberAdd.js
// export const name = "guildMemberAdd";
// export const once = false;

// export async function execute(member) {
//   try {
//     await member.send(
//       `👋 Welcome to the Internship server, **${member.user.username}**!\n\n` +
//         `Please verify your internship registration using the command:\n` +
//         "`/verify your_email@example.com`"
//     );
//   } catch (error) {
//     console.error("Could not send DM to new member:", error);
//   }
// }

import { EmbedBuilder } from "discord.js";

export const name = "guildMemberAdd";
export const once = false;

export async function execute(member) {
  try {
    // 1. Send them a DM
    await member.send(
      `👋 Welcome to the Internship server, **${member.user.username}**!\n\n` +
        `Please verify your internship registration using the command:\n` +
        "`/verify your_email@example.com`"
    );

    // 2. Send an embed in the general channel
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === "general" && ch.isTextBased()
    );

    if (channel) {
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x5865f2) // Discord blurple
        .setTitle("🎉 New Intern Joined!")
        .setDescription(
          `Everyone welcome ${member} to the server!\n\n` +
            "Make sure to verify your email to get access to your track channels 🚀"
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "ISentry Internship Moderator Bot" })
        .setTimestamp();

      await channel.send({ embeds: [welcomeEmbed] });
    }
  } catch (error) {
    console.error("Error sending welcome message:", error);
  }
}
