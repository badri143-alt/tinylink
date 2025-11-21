import * as model from "../models/linksModel.js";
import { isValidUrl, isValidCode } from "../utils/validateUrl.js";

function generateRandomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createLink(req, res) {
  let { url, code } = req.body;

  if (!url) return res.status(400).json({ error: "url is required" });
  if (!isValidUrl(url)) return res.status(400).json({ error: "Invalid URL" });

  if (!code) {
    code = generateRandomCode(6);
  } else if (!isValidCode(code)) {
    return res.status(400).json({ error: "Invalid code format" });
  }

  const existing = await model.findByCode(code);
  if (existing) return res.status(409).json({ error: "Code already exists" });

  const created = await model.createLink({ code, long_url: url });
  res.status(201).json(created);
}

export async function getLinks(req, res) {
  const list = await model.listLinks();
  res.json(list);
}

export async function getLinkStats(req, res) {
  const { code } = req.params;
  const link = await model.findByCode(code);

  if (!link) return res.status(404).json({ error: "Code not found" });

  res.json(link);
}

export async function deleteLink(req, res) {
  const { code } = req.params;
  const link = await model.findByCode(code);
  if (!link) return res.status(404).json({ error: "Code not found" });

  await model.deleteByCode(code);
  res.json({ message: "Deleted successfully" });
}

export async function handleRedirect(req, res) {
  const { code } = req.params;
  const link = await model.findByCode(code);

  if (!link) return res.status(404).send("Not found");

  await model.incrementClick(code);

  res.redirect(302, link.long_url);
}
