const { Events, Colors } = require('discord.js');
const Tag = require('../../Tag.json');
const { CustomEmbed, AI } = require('../../libs');
module.exports = {
  name: Events.InteractionCreate,
  filter: (i) => i.isStringSelectMenu() && i.customId.startsWith('tag_'),
  async execute(interaction) {
    const select_tag = interaction.customId.split('_')[1];
    const deep_select_tag = interaction.values[0]
    if (deep_select_tag === 'other') {
      await interaction.deferReply();
      const ChatCompletion = await AI(deep_select_tag, interaction.member.id);
      const answer_embed = new CustomEmbed()
        .setTitle('✅回答の生成')
        .setDescription(`回答:${ChatCompletion}`)
        .setColor(Colors.Green)
        .create();
      await interaction.editReply({ embeds: [answer_embed] });
    } else {
      const content = Tag[select_tag][deep_select_tag];
      const answer_embed = new CustomEmbed()
        .setTitle('✅回答の検索')
        .setDescription(`あなたの質問:${deep_select_tag}\n回答:${content}`)
        .setColor(Colors.Green)
        .create();
      await interaction.reply({ embeds: [answer_embed] });
    }
  },
};
