const OpenAI = require('openai');
require('dotenv').config()
const OpenAiApi = new OpenAI({ apiKey: process.env.apiKey });
const fs = require('node:fs');
const AI = fs.readFileSync('./AI.txt', 'utf8');
const spam_protect = new Map();

const ai_format = async (text, userId) => {
  const check = spam_protect.has(userId);
  if (check) {
    const oldTime = spam_protect.get(userId);
    const diff = new Date().getTime() - oldTime.getTime();
    const checkTime = isNaN(diff) ? 25 : diff / (60 * 1000);
    if (checkTime < 5) return '連投対策';
  };
  spam_protect.set(userId, new Date());
  const ChatCompletion = await OpenAiApi.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `以下の情報を読み込んでください。この情報以外は読み込まないでください\nわからない場合はお答えすることが[わかりません]と返答してください\n${AI}` },
      {
        role: 'user',
        content: `指示：必ず日本語で回答をしてください。\n内容:${text}`,
      },
    ],
  });
  return ChatCompletion.choices[0].message.content;
}
module.exports = ai_format;