const { Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ThreadAutoArchiveDuration, Colors } = require('discord.js');
const Tag = require('../../Tag.json');
const { CustomEmbed, AI, spreadsheet } = require('../../libs');
const spsheet = new spreadsheet()
//const mongoose = require('mongoose');

module.exports = {
  name: Events.InteractionCreate,
  filter: (i) => i.isModalSubmit() && i.customId.startsWith('chatbot'),
  async execute(interaction) {
    if (interaction.channel.type !== 0) return;
    const text = interaction.fields.getTextInputValue('text');
    await spsheet.set({ type: "chatbot", userId: interaction.user.id, userName: interaction.user.username, content: text });
    const select_tag = Object.keys(Tag).filter(x => text.match(`^(?=.*${x}).*$`));
    const content = Tag[select_tag]
    const channel = await interaction.channel.threads.create({
      name: text,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
      reason: 'ChatBOT',
    });
    const thread_embed = new CustomEmbed()
      .setTitle('✅スレッドを作成')
      .setDescription(`質問に関する回答をスレッドで開始しました\nスレッドチャンネル:${channel}`)
      .setColor(Colors.Green)
      .create();
    await interaction.reply({ embeds: [thread_embed] });

    if (content) {
      const tags = Object.keys(content);
      const tag_list = new StringSelectMenuBuilder()
        .setCustomId(`tag_${select_tag}`)
        .setPlaceholder('関連する回答があります')
        .addOptions(
          tags.map(label =>
            new StringSelectMenuOptionBuilder().setLabel(label)
              .setDescription(`${label}について`)
              .setValue(label)
          )
        )
        .addOptions(
          new StringSelectMenuOptionBuilder().setLabel('その他')
            .setDescription(`その他の回答`)
            .setValue('other')
        );
      const row = new ActionRowBuilder()
        .addComponents(tag_list);
      const tag_embed = new CustomEmbed()
        .setTitle('✅タグのヒット')
        .setDescription(`あなたの質問:${text}\n関連する回答が見つかりました\n${tags.join('\n')}\nその他`)
        .setColor(Colors.Green)
        .create();

      await channel.send({ embeds: [tag_embed], components: [row] });
    } else {
      const ChatCompletion = await AI(text, interaction.member.id);
      const thread_embed = new CustomEmbed()
        .setTitle('✅回答の生成')
        .setDescription(`あなたの質問:${text}\n回答:${ChatCompletion}`)
        .setColor(Colors.Green)
        .create();
      await channel.send({ embeds: [thread_embed] });
    };
  }
};
