const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.login(process.env.TOKEN);

// rankMap nếu muốn kiểm tra role hợp lệ
const rankMap = {
  "Admin": "Admin",
  "Mod": "Moderator",
  "Member1": "Member1",
  "Member2": "Member2"
};

// Endpoint Roblox ping để hỏi role
app.post("/get-role", async (req, res) => {
  const { discordId, guildId } = req.body;
  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(discordId);

    // tìm role Discord hợp lệ trong rankMap
    let matchedRole = null;
    for (const roleName of Object.keys(rankMap)) {
      if (member.roles.cache.some(r => r.name === roleName)) {
        matchedRole = roleName;
        break;
      }
    }

    if (!matchedRole) return res.json({ role: null });

    res.json({ role: matchedRole });
  } catch (err) {
    console.log(err);
    res.json({ role: null });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot server running on port ${PORT}`));
