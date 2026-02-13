import Meting from '@meting/core';

export default async function handler(req, res) {
  try {
    const {
      server = 'netease', // 平台：netease/tencent/kugou/baidu/kuwo
      action = 'search',  // 动作：search/song/album/artist/playlist/url/lyric/pic
      keyword,            // search 用
      id,                 // song/album/playlist/lyric/url/pic 用
      page = '1',
      limit = '30',
      type = '1',         // search type（netease：1歌曲/10专辑/100歌手等）
      bitrate = '320',    // url 用
      size = '300'        // pic 用
    } = req.query;

    const meting = new Meting(String(server));
    meting.format(true);

    let result;

    switch (String(action)) {
      case 'search':
        if (!keyword) {
          return res.status(400).json({ error: 'missing keyword' });
        }
        result = await meting.search(String(keyword), {
          type: Number(type),
          page: Number(page),
          limit: Number(limit),
        });
        break;

      case 'song':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.song(String(id));
        break;

      case 'album':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.album(String(id));
        break;

      case 'artist':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.artist(String(id), Number(limit));
        break;

      case 'playlist':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.playlist(String(id));
        break;

      case 'url':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.url(String(id), Number(bitrate));
        break;

      case 'lyric':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.lyric(String(id));
        break;

      case 'pic':
        if (!id) return res.status(400).json({ error: 'missing id' });
        result = await meting.pic(String(id), Number(size));
        break;

      default:
        return res.status(400).json({
          error: 'invalid action',
          allowed: ['search','song','album','artist','playlist','url','lyric','pic'],
        });
    }

    // README 里说结果通常是 JSON 字符串
    let data = result;
    if (typeof result === 'string') {
      try { data = JSON.parse(result); } catch { /* 有些接口可能不是严格 JSON，保留原样 */ }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
