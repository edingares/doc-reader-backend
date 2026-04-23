import cors from 'cors';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Vercel函数运行环境配置（必须写）
export const config = { runtime: 'nodejs18.x' };

// Vercel后端接口主函数
export default async function handler(req, res) {
  // 跨域允许前端网站访问
  await new Promise((resolve) => cors()(req, res, resolve));

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' });
  }

  try {
    const { type, file } = req.body;
    const buffer = Buffer.from(file.data, 'base64');
    let text = '';

    // PDF解析
    if (type === 'pdf') {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    }
    // Word(docx)解析
    else if (type === 'docx') {
      const docxData = await mammoth.extractRawText({ buffer });
      text = docxData.value;
    }
    // TXT文本解析
    else if (type === 'txt') {
      text = buffer.toString('utf8');
    }

    // 返回解析结果
    return res.status(200).json({ text });

  } catch (err) {
    // 出错返回错误信息
    return res.status(500).json({ error: err.message });
  }
}
