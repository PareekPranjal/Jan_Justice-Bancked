import PageView from '../models/PageView.js';

// @desc    Track a visitor (called by website, once per visitor per day)
// @route   POST /api/analytics/track
// @access  Public
export const trackVisit = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId || typeof visitorId !== 'string' || visitorId.length > 64) {
      return res.status(400).json({ success: false, message: 'Invalid visitorId' });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // upsert — if (visitorId + date) already exists, do nothing
    await PageView.updateOne(
      { visitorId, date: today },
      { $setOnInsert: { visitorId, date: today } },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    // Duplicate key is fine (race condition edge case) — still success
    if (error.code === 11000) {
      return res.status(200).json({ success: true });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get visitor analytics
// @route   GET /api/analytics?view=daily|monthly|yearly
// @access  Private (admin)
export const getAnalytics = async (req, res) => {
  try {
    const view = req.query.view || 'daily';

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Summary stats
    const monthStr = todayStr.substring(0, 7); // YYYY-MM
    const yearStr = todayStr.substring(0, 4);  // YYYY

    const [todayCount, thisMonthCount, thisYearCount, chartData] = await Promise.all([
      PageView.countDocuments({ date: todayStr }),
      PageView.countDocuments({ date: { $regex: `^${monthStr}` } }),
      PageView.countDocuments({ date: { $regex: `^${yearStr}` } }),
      getChartData(view, now),
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          today: todayCount,
          thisMonth: thisMonthCount,
          thisYear: thisYearCount,
        },
        chart: chartData,
        view,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

async function getChartData(view, now) {
  if (view === 'daily') {
    // Last 30 days
    const from = new Date(now);
    from.setDate(from.getDate() - 29);
    const fromStr = from.toISOString().split('T')[0];

    const raw = await PageView.aggregate([
      { $match: { date: { $gte: fromStr } } },
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const map = Object.fromEntries(raw.map(r => [r._id, r.count]));
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ label: key, count: map[key] || 0 });
    }
    return result;
  }

  if (view === 'monthly') {
    // Last 12 months
    const from = new Date(now);
    from.setMonth(from.getMonth() - 11);
    from.setDate(1);
    const fromStr = from.toISOString().split('T')[0].substring(0, 7); // YYYY-MM

    const raw = await PageView.aggregate([
      { $match: { date: { $gte: fromStr + '-01' } } },
      { $group: { _id: { $substr: ['$date', 0, 7] }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const map = Object.fromEntries(raw.map(r => [r._id, r.count]));
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
      result.push({ label, count: map[key] || 0 });
    }
    return result;
  }

  // yearly — all time
  const raw = await PageView.aggregate([
    { $group: { _id: { $substr: ['$date', 0, 4] }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return raw.map(r => ({ label: r._id, count: r.count }));
}
