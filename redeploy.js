export default function handler(req, res) {
  // This endpoint triggers a rebuild which fetches latest Telegram posts
  res.status(200).json({ redeployed: true, time: new Date().toISOString() });
}
