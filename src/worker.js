export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // POST /api/visits — log a page visit
    if (url.pathname === "/api/visits" && request.method === "POST") {
      try {
        const { page, referrer } = await request.json();
        await env.weird_baby_db.prepare(
          "INSERT INTO visits (page, referrer, visited_at) VALUES (?, ?, datetime('now'))"
        ).bind(page || "/", referrer || "").run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // GET /api/guestbook — fetch all entries
    if (url.pathname === "/api/guestbook" && request.method === "GET") {
      try {
        const { results } = await env.weird_baby_db.prepare(
          "SELECT * FROM guestbook ORDER BY signed_at DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(results), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // POST /api/guestbook — sign the guest book
    if (url.pathname === "/api/guestbook" && request.method === "POST") {
      try {
        const { name, note } = await request.json();
        if (!name || !name.trim()) {
          return new Response(JSON.stringify({ error: "Name required" }), { status: 400, headers: cors });
        }
        await env.weird_baby_db.prepare(
          "INSERT INTO guestbook (name, note, badge, signed_at) VALUES (?, ?, 'Founding Visitor', datetime('now'))"
        ).bind(name.trim(), (note || "").trim()).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // GET /api/admin — admin dashboard data
    if (url.pathname === "/api/admin" && request.method === "GET") {
      try {
        const [entries, visitCount, recentVisits, pageBreakdown] = await Promise.all([
          env.weird_baby_db.prepare("SELECT * FROM guestbook ORDER BY signed_at DESC").all(),
          env.weird_baby_db.prepare("SELECT COUNT(*) as count FROM visits").first(),
          env.weird_baby_db.prepare("SELECT * FROM visits ORDER BY visited_at DESC LIMIT 20").all(),
          env.weird_baby_db.prepare("SELECT page, COUNT(*) as count FROM visits GROUP BY page ORDER BY count DESC").all(),
        ]);
        return new Response(JSON.stringify({
          guestbook: entries.results,
          totalVisits: visitCount.count,
          recentVisits: recentVisits.results,
          pageBreakdown: pageBreakdown.results,
        }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
