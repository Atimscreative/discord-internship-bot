import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

const stacks = [
  { name: "Front End", value: "front-end" },
  { name: "Back End", value: "back-end" },
  { name: "Product Designer", value: "product-designer" },
  { name: "Graphic Design", value: "graphic-design" },
  {
    name: "Social Media Manager And Content Creator",
    value: "social-media-manager-and-content-creator-channel",
  },
  { name: "Data Analysis", value: "data-analysis" },
  { name: "Qa Engineers", value: "qa-engineers" },
  { name: "Product Manager", value: "product-manager" },
];

export const data = new SlashCommandBuilder()
  .setName("assign-role")
  .setDescription("Assign yourself to a track/stack (only once).")
  .addStringOption((option) =>
    option
      .setName("stack")
      .setDescription("Choose your track.")
      .setRequired(true)
      .addChoices(...stacks.map((s) => ({ name: s.name, value: s.value })))
  );

export async function execute(interaction) {
  const stack = interaction.options.getString("stack");
  const { member, guild, channel } = interaction;

  //  Restrict to #choose-your-role
  if (channel.id !== process.env.ROLE_CHANNEL_ID) {
    return interaction.reply({
      content:
        "⚠️ You can only use `/assign-role` in the #choose-your-role  channel.",
      ephemeral: true,
    });
  }

  try {
    // 🔒 Check if user already has any of the stack roles
    const hasStackRole = stacks.some((s) =>
      member.roles.cache.some((r) => r.name === s)
    );

    if (hasStackRole) {
      return interaction.reply({
        content: "❌ You already have a stack assigned. You can't change it.",
        flags: 64, // ephemeral
      });
    }

    // ✅ Find or create role
    let role = guild.roles.cache.find((r) => r.name === stack);
    if (!role) {
      role = await guild.roles.create({
        name: stack,
        mentionable: true,
        permissions: [],
        reason: "Stack role assignment",
      });
    }

    // Assign role
    await member.roles.add(role);

    // ✅ Reply with confirmation
    await interaction.reply({
      content: `✅ You have been assigned to **${stack}** track!`,
      flags: 64,
    });

    // 🎟️ Channel + invite
    const channel = guild.channels.cache.find((c) => c.name === stack);

    if (channel) {
      // Make sure role has access
      await channel.permissionOverwrites.edit(role, {
        ViewChannel: true,
        SendMessages: true,
      });

      // Create a single-use invite that expires after 5 minutes
      const invite = await channel.createInvite({
        maxUses: 1,
        maxAge: 300, // 5 minutes
        unique: true,
        reason: `${member.user.tag} assigned to ${stack}`,
      });

      await member.send(
        `🎟️ Here's your private invite to **${stack}** channel:\n${invite.url}\n\n(⚠️ This link expires once you join or after 5 minutes.)`
      );
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Failed to assign role. Please contact an admin.",
      flags: 64,
    });
  }
}
