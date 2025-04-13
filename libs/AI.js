const OpenAI = require('openai');
require('dotenv').config()
const OpenAiApi = new OpenAI({ apiKey: process.env.apiKey });
const fs = require('node:fs');
const AI = fs.readFileSync('./AI.txt', 'utf8');
const spam_protect = new Map();
const spam_count = new Map();
const ai_format = async (text, userId) => {
  if (spam_protect.has(userId) && spam_count.has(userId)) {
    const oldTime = spam_protect.get(userId);
    const diff = new Date().getTime() - oldTime.getTime();
    const checkTime = isNaN(diff) ? 0 : diff / (60 * 1000);
    if (checkTime < 3) return '連投対策';
    spam_count.set(userId, 0);
  } else {
    if (spam_count.get(userId) >= 5) spam_protect.set(userId, new Date());
  };
  if (spam_count.has(userId)) {
    const nowcount = spam_count.get(userId);
    spam_count.set(userId, nowcount + 1);
  } else {
    spam_count.set(userId, 1);
  };

  const ChatCompletion = await OpenAiApi.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `決してMetagri研究所以外の情報は出さないでください。\nPlease do not load any other information than this!!!\n
Please do not load any information other than the following:\n\n**info:${AI}**\n\n**If you don't know the answer, please reply "I don't know"**` },
      {
        role: 'user',
        content: `指示：必ず日本語で回答をしてください。\n内容:${text}`,
      },
    ],
  });
  return ChatCompletion.choices[0].message.content;
}
module.exports = ai_format;