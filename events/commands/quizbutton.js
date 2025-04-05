const { Events } = require("discord.js");
const OpenAI = require("openai");
const OpenAiApi = new OpenAI({
  apiKey:
    process.env.apiKey,
});
const fs = require("node:fs")
const AI = fs.readFileSync("./events/commands/AI.txt", 'utf8');
console.log(AI)
module.exports = {
  name: Events.InteractionCreate,
  filter: (i) => i.isModalSubmit() && i.customId.startsWith("chatbot"),
  async execute(interaction) {
    const text = interaction.fields.getTextInputValue("text");
    const ChatCompletion = await OpenAiApi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `以下の情報を読み込んでください。この情報以外は出さないでください。\nわからない場合はNONと表示してください\n${AI}` },
        {
          role: "user",
          content: `指示：必ず日本語で回答をしてください。\n内容:${text}`,
        },
      ],
    });
    console.log(ChatCompletion.choices[0].message.content);
  },
};
