import { pool } from '../services/db.js';

export const createUser = async (req, res) => {
    const { username, displayName, avatarUrl } = req.body;
    console.log(`display_name ${displayName} avatar_url ${avatarUrl}`);
    
  try {
    const q = `INSERT INTO users (username, display_name, avatar_url)
               VALUES ($1,$2,$3) RETURNING *`;
    const vals = [username, displayName || null, avatarUrl || null];
    const { rows } = await pool.query(q, vals);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}



export const updateScore = async (req, res) => {
    const { id } = req.params;
  const { delta, score } = req.body;
  try {
    await pool.query('BEGIN');
    const userRes = await pool.query('SELECT * FROM users WHERE id=$1 FOR UPDATE', [id]);
    if (userRes.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }
    let newScore;
    if (typeof delta === 'number') {
      newScore = Number(userRes.rows[0].score) + Number(delta);
    } else if (typeof score === 'number') {
      newScore = Number(score);
    } else {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Provide delta or score' });
    }
    const updateQ = `UPDATE users
                     SET score=$1, last_score_at=now(), updated_at=now()
                     WHERE id=$2 RETURNING *`;
    const { rows } = await pool.query(updateQ, [newScore, id]);
    // אופציונלי: הכנס לאירועי score_events
    await pool.query('COMMIT');
    return res.json(rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK').catch(()=>{});
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export const getTopN = async (req, res) => {
    const limit = parseInt(req.query.limit || '50', 10);
  try {
    const q = `
      SELECT id, username, display_name as displayName, avatar_url as avatarUrl, score
      FROM users
      ORDER BY score DESC, last_score_at ASC
      LIMIT $1
    `;
    const { rows } = await pool.query(q, [limit]);
    return res.json({ leaderboard: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export const getUserRank = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId parameter' });
  const radius = parseInt(req.query.radius || '5', 10);
  try {
    const uQ = `SELECT id, score, last_score_at FROM users WHERE id=$1`;
    const uRes = await pool.query(uQ, [userId]);
    if (uRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = uRes.rows[0];

    const countQ = `
      SELECT 1 + COUNT(*) as rank
      FROM users
      WHERE (score > $1) OR (score = $1 AND last_score_at < $2)
    `;
    const countRes = await pool.query(countQ, [u.score, u.last_score_at]);
    const rank = Number(countRes.rows[0].rank);

    const neighborsQ = `
      SELECT * FROM (
        SELECT id, username, display_name as displayName, avatar_url as avatarUrl, score,
               ROW_NUMBER() OVER (ORDER BY score DESC, last_score_at ASC) as rank
        FROM users
      ) t
      WHERE t.rank BETWEEN $1 AND $2
      ORDER BY t.rank
    `;
    const start = Math.max(1, rank - radius);
    const end = rank + radius;
    const neighborsRes = await pool.query(neighborsQ, [start, end]);
    return res.json({ centerRank: rank, results: neighborsRes.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}