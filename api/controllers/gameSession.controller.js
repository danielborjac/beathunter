const { GameSession, GameAttempt, Song, UserStatistic } = require('../models');
const updateLeaderboardCache = require('../utils/updateLeaderboardCache');

exports.createSessionWithAttempts = async (req, res) => {
  try {
    const { mode, finished_at, attempts } = req.body;
    const user_id = req.user.id;

    const session = await GameSession.create({ user_id, mode, finished_at });

    let sessionTotalScore = 0;

    const createdAttempts = await Promise.all(
      attempts.map(async (a) => {
        let base = 0;
        if (!a.correct) base = 0;      
        else if (a.attempts === 1) base = 100;
        else if (a.attempts === 2) base = 70;
        else if (a.attempts === 3) base = 40;
 
        const speed_bonus = a.correct ? Math.max(0 - (a.duration_sec || 0)) : 0;
        const score = base + speed_bonus;
        sessionTotalScore += score;

        return await GameAttempt.create({
          ...a,
          session_id: session.id,
          score
        });
      })
    );

    // 🔄 Actualizar estadística
    const [stats, created] = await UserStatistic.findOrCreate({
      where: { user_id, mode },
      defaults: {
        total_score: sessionTotalScore,
        games_played: 1,
        highest_score: sessionTotalScore,
        last_played: finished_at
      }
    });

    if (!created) {
      await stats.update({
        total_score: stats.total_score + sessionTotalScore,
        games_played: stats.games_played + 1,
        highest_score: Math.max(stats.highest_score, sessionTotalScore),
        last_played: finished_at
      });
    }

    await updateLeaderboardCache(mode, 'daily');
    await updateLeaderboardCache(mode, 'monthly');
    await updateLeaderboardCache(mode, 'all_time');

    res.status(201).json({ session, totalScore: sessionTotalScore, attempts: createdAttempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await GameSession.findAll({
      where: { user_id: req.user.id },
      include: {
        model: GameAttempt,
        include: [Song]
      }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};