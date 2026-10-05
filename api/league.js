const platforms = { na1: 'americas', br1: 'americas', la1: 'americas', la2: 'americas', euw1: 'europe', eun1: 'europe', tr1: 'europe', ru: 'europe', kr: 'asia', jp1: 'asia', oc1: 'sea', ph2: 'sea', sg2: 'sea', th2: 'sea', tw2: 'sea', vn2: 'sea' };
let cached, pending, retryAt = 0;

async function json(url, key) {
    const response = await fetch(url, { headers: key ? { 'X-Riot-Token': key } : {}, signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
        const error = new Error('Upstream request failed');
        error.status = response.status;
        error.retry = Math.max(60, Math.min(3600, Number(response.headers.get('Retry-After')) || 60));
        throw error;
    }
    return response.json();
}

async function loadProfile(key, name, tag, platform) {
    const account = await json(`https://${platforms[platform]}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, key);
    const base = `https://${platform}.api.riotgames.com`;
    const id = encodeURIComponent(account.puuid);
    const [summoner, ranked, mastery, versions] = await Promise.all([
        json(`${base}/lol/summoner/v4/summoners/by-puuid/${id}`, key),
        json(`${base}/lol/league/v4/entries/by-puuid/${id}`, key),
        json(`${base}/lol/champion-mastery/v4/champion-masteries/by-puuid/${id}/top?count=3`, key),
        json('https://ddragon.leagueoflegends.com/api/versions.json')
    ]);
    const assets = `https://ddragon.leagueoflegends.com/cdn/${versions[0]}`;
    const champions = await json(`${assets}/data/en_US/champion.json`);
    const byId = new Map(Object.values(champions.data).map(champion => [Number(champion.key), champion]));
    return {
        riotId: `${account.gameName || name}#${account.tagLine || tag}`, region: platform.toUpperCase(),
        level: summoner.summonerLevel, icon: `${assets}/img/profileicon/${summoner.profileIconId}.png`,
        ranked: ranked.filter(entry => ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].includes(entry.queueType)).map(entry => ({
            queue: entry.queueType === 'RANKED_SOLO_5x5' ? 'Solo / Duo' : 'Flex', tier: entry.tier,
            division: entry.rank, lp: entry.leaguePoints, wins: entry.wins, losses: entry.losses,
            winRate: entry.wins + entry.losses ? Math.round(entry.wins / (entry.wins + entry.losses) * 100) : 0
        })),
        champions: mastery.map(entry => { const champion = byId.get(entry.championId); return {
            name: champion?.name || `Champion ${entry.championId}`, level: entry.championLevel,
            points: entry.championPoints, icon: champion ? `${assets}/img/champion/${champion.image.full}` : null
        }; }), updatedAt: new Date().toISOString()
    };
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
    const key = process.env.RIOT_API_KEY;
    const name = process.env.RIOT_GAME_NAME || 'Tragedy';
    const tag = process.env.RIOT_TAG_LINE || 'chaos';
    const platform = (process.env.RIOT_PLATFORM || 'na1').toLowerCase();
    if (!key) return res.status(503).json({ error: 'League profile is not connected yet.' });
    if (!platforms[platform]) return res.status(503).json({ error: 'League region configuration is invalid.' });
    if (cached && Date.now() - cached.time < 300000) return res.status(200).json(cached.data);
    if (Date.now() < retryAt) { res.setHeader('Retry-After', Math.ceil((retryAt - Date.now()) / 1000)); return res.status(503).json({ error: 'League stats are temporarily unavailable. Please try again later.' }); }
    try {
        if (!pending) pending = loadProfile(key, name, tag, platform).then(data => { cached = { data, time: Date.now() }; return data; }).finally(() => { pending = null; });
        const data = await pending;
        res.setHeader('Cache-Control', 'public, s-maxage=300');
        return res.status(200).json(data);
    } catch (error) {
        retryAt = Date.now() + (error.retry || 60) * 1000;
        const messages = { 403: 'League connection needs an updated Riot API key.', 401: 'League connection needs an updated Riot API key.', 404: 'League account was not found. Check the Riot ID and server.', 429: 'League stats are refreshing. Please try again later.' };
        res.setHeader('Retry-After', error.retry || 60);
        return res.status(503).json({ error: messages[error.status] || 'League stats are temporarily unavailable.' });
    }
}
