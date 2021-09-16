const { BotClient } = require("@src/structures");
const { counterHandler, inviteHandler, musicHandler } = require("@src/handlers");
const { loadReactionRoles } = require("@schemas/reactionrole-schema");
const { getSettings } = require("@schemas/guild-schema");

/**
 * @param {BotClient} client
 */
module.exports = async (client) => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);

  // register slash commands
  if (client.config.SLASH_COMMANDS.ENABLED) {
    if (client.config.SLASH_COMMANDS.GLOBAL) await client.registerSlashCommands();
    else await client.registerSlashCommands(client.config.SLASH_COMMANDS.TEST_GUILD_ID);
  }

  // register player events
  musicHandler.registerPlayerEvents(client);

  // Load reaction roles to cache
  await loadReactionRoles();

  // initialize counter Handler
  await counterHandler.init(client);

  // cache invites for tracking enabled guilds
  client.guilds.cache.forEach(async (guild) => {
    const settings = await getSettings(guild);
    if (settings.invite.tracking) inviteHandler.cacheGuildInvites(guild);
  });
};
