const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const setting = require('../setting.json');
require('dotenv').config();
const serviceAccountAuth = new JWT({
  email: process.env.email,
  key: process.env.PRIVATEKEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
class SpreadSheetService {
  /**
   * コンストラクター
   * @param {*} spreadsheetKey スプレッドシートキー
   */
  constructor() {
    this.doc = new GoogleSpreadsheet(setting.spreadsheet, serviceAccountAuth);
  }
  /**
   * 行を追加する
   * @param {*} value 
   */
  async set({ type, userId, userName, content }) {
    if (type !== 'chatbot') return 'Not Type';
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle[type];
    await sheet.addRow({ userId: userId, userName: userName, date: new Date(), content: content });

  }
}

module.exports = SpreadSheetService