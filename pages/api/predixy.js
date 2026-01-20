export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("OK");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const body = req.body;

  const TRACKED_WALLET =
    "0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee".toLowerCase();

  const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1462495819633659954/GTvv8qBBrN5JHcHTSeJYldxBFRIY7sb0rRs_YLKMUBQvarfoRj45xc6HGXQ2cfr9wSGf";

  const events = body?.event?.data || [];

  for (const event of events) {
    const maker = event?.maker?.toLowerCase();
    const taker = event?.taker?.toLowerCase();

    if (maker === TRACKED_WALLET || taker === TRACKED_WALLET) {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🐳 **Predixy Alert**
Tracked wallet just placed a Polymarket trade.

Market: ${event.market || "Unknown"}
Side: ${event.side || "Unknown"}
Size: ${event.size || "Unknown"}
`,
        }),
      });
    }
  }

  return res.status(200).send("OK");
}
