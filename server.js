import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  // Vercel官方标准跨域配置，100%不会Failed to fetch
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 必须处理OPTIONS预检请求！！！这是之前报错的核心原因
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
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
