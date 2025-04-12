const {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder
} = require("discord.js");
const chat_modal = new ModalBuilder()
  .setCustomId("chatbot")
  .setTitle("質問内容を入力してください");
const Input = new TextInputBuilder()
  .setCustomId("text")
  .setLabel("質問入力")
  .setMaxLength(50)
  .setPlaceholder("Metagri研究所のメンバー数は？")
  .setStyle(TextInputStyle.Short);
const question_Row = new ActionRowBuilder().addComponents(Input);
chat_modal.addComponents(question_Row);

module.exports = {
  builder: (builder) =>
    builder.setName("chat").setDescription("Metagriに関する質問を表示します"),

  async execute(interaction) {
    await interaction.showModal(chat_modal);
  },
};
