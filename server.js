import cors from 'cors';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  res.use(cors());
  if (req.method !== 'POST') return res.status(405).json({ error: '仅支持POST请求' });

  try {
    const buffer = Buffer.from(req.body.file.data, 'base64');
    let text = '';

    if (req.body.type === 'pdf') {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (req.body.type === 'docx') {
      const docxData = await mammoth.extractRawText({ buffer });
      text = docxData.value;
    } else if (req.body.type === 'txt') {
      text = buffer.toString('utf8');
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
