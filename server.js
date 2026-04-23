import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  // Vercel官方标准跨域，完美处理预检请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 立刻响应OPTIONS预检，不等待、不阻塞！！！
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
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
