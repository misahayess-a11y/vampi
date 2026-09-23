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
const REVIEWS_CHANNEL_ID = 'YOUR_CHANNEL_ID_HERE'; 

export const data = new SlashCommandBuilder()
  .setName('vouch')
  .setDescription('Leave a vouch or review!');

export async function execute(interaction) {
  // 1. Send the message with the button
  const embed = new EmbedBuilder()
    .setTitle('✨ Leave a Vouch')
    .setDescription('Click the button below to leave feedback or a comment!')
    .setColor(0xFFB6C1);

  const button = new ButtonBuilder()
    .setCustomId('open_vouch_modal')
    .setLabel('Leave a Comment')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('💬');

  const row = new ActionRowBuilder().addComponents(button);

  await interaction.reply({ embeds: [embed], components: [row] });
}

// 2. Handle the button click and pop-up form submit
export async function handleInteraction(interaction) {
  // If they click the "Leave a Comment" button -> Show Pop-up
  if (interaction.isButton() && interaction.customId === 'open_vouch_modal') {
    const modal = new ModalBuilder()
      .setCustomId('vouch_modal_submit')
      .setTitle('Submit Your Vouch');

    const commentInput = new TextInputBuilder()
      .setCustomId('vouch_comment_text')
      .setLabel('Your Comment / Review')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Type your feedback here...')
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(commentInput);
    modal.addComponents(firstRow);

    await interaction.showModal(modal);
  }

  // If they click Submit on the Pop-up -> Send to review channel
  if (interaction.isModalSubmit() && interaction.customId === 'vouch_modal_submit') {
    const comment = interaction.fields.getTextInputValue('vouch_comment_text');

    const reviewEmbed = new EmbedBuilder()
      .setTitle('🌟 New Vouch!')
      .setDescription(comment)
      .addFields({ name: 'Vouched By', value: ${interaction.user}, inline: true })
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(0xFFB6C1)
      .setTimestamp();

    const reviewChannel = interaction.guild.channels.cache.get(REVIEWS_CHANNEL_ID);
    if (reviewChannel) {
      await reviewChannel.send({ embeds: [reviewEmbed] });
    }

    await interaction.reply({ content: 'Thank you for your vouch!', ephemeral: true });
  }
}
