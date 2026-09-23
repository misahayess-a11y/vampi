import { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';

// Replace this with the ID of the channel where you want reviews to be posted!
const REVIEWS_CHANNEL_ID = '1552314115719045160'; 

export const data = new SlashCommandBuilder()
  .setName('vouch')
  .setDescription('Leave a vouch or review!');

export async function execute(interaction) {
  // 1. Send the message with the button
  const embed = new EmbedBuilder()
    .setTitle('leave a vouchie')
    .setDescription('click the button below to leave a feedback , comement')
    .setColor(0xFFB6C1);

  const button = new ButtonBuilder()
    .setCustomId('open_vouch_modal')
    .setLabel('leave a comment')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('💬');

  const row = new ActionRowBuilder().addComponents(button);

  await interaction.reply({ embeds: [embed], components: [row] });
}

// 2. Handle the button click and pop-up form submit
export async function handleInteraction(interaction) {
  // If they click the "leave a comment" button -> Show Pop-up
  if (interaction.isButton() && interaction.customId === 'open_vouch_modal') {
    const modal = new ModalBuilder()
      .setCustomId('vouch_modal_submit')
      .setTitle('submit your vouchie');

    const commentInput = new TextInputBuilder()
      .setCustomId('vouch_comment_text')
      .setLabel('your comment / review')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('type your feedback here . .')
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(commentInput);
    modal.addComponents(firstRow);

    await interaction.showModal(modal);
  }

  // If they click Submit on the Pop-up -> Send to review channel
  if (interaction.isModalSubmit() && interaction.customId === 'vouch_modal_submit') {
    const comment = interaction.fields.getTextInputValue('vouch_comment_text');

    const reviewEmbed = new EmbedBuilder()
      .setTitle('🌟 new vouchie')
      .setDescription(comment)
      .addFields({ name: 'vouched by', value: ${interaction.user}, inline: true })
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(0xFFB6C1)
      .setTimestamp();

    const reviewChannel = interaction.guild.channels.cache.get(REVIEWS_CHANNEL_ID);
    if (reviewChannel) {
      await reviewChannel.send({ embeds: [reviewEmbed] });
    }

    await interaction.reply({ content: 'thank you for your review', ephemeral: true });
  }
}
