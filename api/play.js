import Meting from '@meting/core';

export default async function handler(req, res) {
  try {
    const server = String(req.query.server || 'netease');
    const id = String(req.query.id || '');
    const bitrate = Number(req.query.bitrate || 320);

    if (!id) return res.status(400).send('missing id');

    const meting = new Meting(server);
    meting.format(true);

    const urlStr = await meting.url(id, bitrate);
    const urlInfo = typeof urlStr === 'string' ? JSON.parse(urlStr) : urlStr;

    // 兼容不同返回格式：可能是 {url: "..."} 或数组
    const realUrl =
      urlInfo?.url ||
      (Array.isArray(urlInfo) ? urlInfo?.[0]?.url : null);

    if (!realUrl) return res.status(404).json({ error: 'no playable url', raw: urlInfo });

    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(302, realUrl);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
