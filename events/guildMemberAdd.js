// events/guildMemberAdd.js
export const name = "guildMemberAdd";
export const once = false;

export async function execute(member) {
  try {
    await member.send(
      `👋 Welcome to the Internship server, **${member.user.username}**!\n\n` +
        `Please verify your internship registration using the command:\n` +
        "`/verify your_email@example.com`"
    );
  } catch (error) {
    console.error("Could not send DM to new member:", error);
  }
}
