

// commands/verify.js
import { SlashCommandBuilder } from "discord.js";
import { approvedEmails } from "../utils/approvedEmails.js";

export const data = new SlashCommandBuilder()
  .setName("verify")
  .setDescription("Verify your internship email.")
  .addStringOption((option) =>
    option
      .setName("email")
      .setDescription("The email you used for internship registration.")
      .setRequired(true)
  );

export async function execute(interaction) {
  const email = interaction.options.getString("email").toLowerCase();
  const { member, guild } = interaction;

  // 1️⃣ Check if user is already verified
  const verifiedRole = guild.roles.cache.find((r) => r.name === "Verified");
  if (verifiedRole && member.roles.cache.has(verifiedRole.id)) {
    return interaction.reply({
      content:
        "✅ You are already verified! Please use `/assign-role` to join your track channel.",
      ephemeral: true,
    });
  }

  // 2️⃣ Check email validity
  if (approvedEmails.includes(email)) {
    try {
      // Create Verified role if it doesn't exist
      let role = verifiedRole;
      if (!role) {
        role = await guild.roles.create({
          name: "Verified",
          mentionable: false,
          reason: "Internship verification role",
        });
      }

      await member.roles.add(role);

      await interaction.reply({
        content:
          "🎉 Email verified successfully! Now pick your track using `/assign-role`.",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "❌ Something went wrong while verifying you. Please contact an admin.",
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: "❌ Email not found in internship records. You will be removed.",
      ephemeral: true,
    });

    // Kick unverified member after short delay
    setTimeout(() => {
      member.kick("Failed internship verification.");
    }, 3000);
  }
}
