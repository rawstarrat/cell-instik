import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  try {
    if (url.includes('tiktok')) {
      const response = await axios.get(`https://api.tikcdn.io/tiktok/info?url=${encodeURIComponent(url)}`);
      const videoUrl = response.data?.data?.play;
      if (videoUrl) return res.json({ success: true, videoUrl });
    } else if (url.includes('instagram.com')) {
      const igRes = await axios.get(`https://saveig.app/api/ajaxSearch`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0',
        },
        params: { q: url }
      });
      const matches = igRes.data?.urls?.[0]?.url;
      if (matches) return res.json({ success: true, videoUrl: matches });
    }
    return res.json({ success: false, message: 'Link tidak valid atau tidak didukung.' });
  } catch (err) {
    return res.json({ success: false, message: 'Gagal mengambil video.' });
  }
}