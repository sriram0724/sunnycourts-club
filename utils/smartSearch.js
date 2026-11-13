// Part 5: Twist rule (Smart search) -> Save as utils/smartSearch.js
const { all } = require('../db/database');

/**
 * GET /courts?q=word
 * Matches `word` anywhere in `name` or `sport`, ignoring capital letters.
 * If no match is found, returns HTTP 200 with an empty list and message "Nothing found".
 */
async function smartSearchCourts(query, res) {
  const term = String(query).trim().toLowerCase();
  const pattern = `%${term}%`;

  const matches = await all(
    `SELECT * FROM courts
     WHERE LOWER(name) LIKE ? OR LOWER(sport) LIKE ?`,
    [pattern, pattern]
  );

  if (matches.length === 0) {
    return res.status(200).json({
      message: 'Nothing found',
      results: []
    });
  }

  return res.status(200).json(matches);
}

module.exports = { smartSearchCourts };