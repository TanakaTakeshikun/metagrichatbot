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
  .setPlaceholder("NFT購入金額")
  .setStyle(TextInputStyle.Short);

module.exports = {
  builder: (builder) =>
    builder.setName("chat").setDescription("Metagriに関する質問を表示します"),

  async execute(interaction) {
    const question_Row = new ActionRowBuilder().addComponents(Input);
    chat_modal.addComponents(question_Row);
    await interaction.showModal(chat_modal);
  },
};
