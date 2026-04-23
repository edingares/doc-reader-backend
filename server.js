import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  // 正确跨域写法，彻底解决循环卡死！
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' });
  }

  try {
    const { type, file } = req.body;
    const buffer = Buffer.from(file.data, 'base64');
    let text = '';

    if (type === 'pdf') {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (type === 'docx') {
      const docxData = await mammoth.extractRawText({ buffer });
      text = docxData.value;
    } else if (type === 'txt') {
      text = buffer.toString('utf8');
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
