// events/messageCreate.js
export const name = "messageCreate";
export const once = false;

export async function execute(message) {
  // Ignore bots
  if (message.author.bot) return;

  // Replace with your #verify channel ID
  const VERIFY_CHANNEL_ID = "YOUR_VERIFY_CHANNEL_ID";

  // Check if message is in the verify channel
  if (message.channel.id === VERIFY_CHANNEL_ID) {
    // If it's not a slash command (all slash commands go through interactionCreate, not messageCreate)
    // then delete the message
    try {
      await message.delete();
      await message.author.send(
        "⚠️ Please use the `/verify` command in the #verify channel. Text messages are not allowed there."
      );
    } catch (err) {
      console.error("Error deleting message in verify channel:", err);
    }
  }
}
