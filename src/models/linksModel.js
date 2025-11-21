import db from "../db.js";

export async function findByCode(code) {
  const result = await db.query("SELECT * FROM links WHERE code=$1", [code]);
  return result.rows[0] || null;
}

export async function createLink({ code, long_url }) {
  const result = await db.query(
    "INSERT INTO links (code, long_url) VALUES ($1, $2) RETURNING *",
    [code, long_url]
  );
  return result.rows[0];
}

export async function listLinks() {
  const result = await db.query("SELECT * FROM links ORDER BY created_at DESC");
  return result.rows;
}

export async function deleteByCode(code) {
  await db.query("DELETE FROM links WHERE code=$1", [code]);
}

export async function incrementClick(code) {
  await db.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );
}
