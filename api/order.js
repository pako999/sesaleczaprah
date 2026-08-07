export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || {};
  const required = ['name','email','phone','address','postal','city','country','quantity'];
  if (required.some((key) => !String(body[key] || '').trim())) return res.status(400).json({ error: 'Missing fields' });

  const apiKey = process.env.RESEND_API_KEY;
  const orderEmail = process.env.ORDER_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || 'orders@resend.dev';

  // If email sending is not configured, fail clearly so the front-end can use checkoutUrl fallback.
  if (!apiKey || !orderEmail) return res.status(503).json({ error: 'Order email not configured' });

  const safe = (value) => String(value || '').replace(/[<>]/g, '');
  const html = `
    <h2>New Drill Dust Collector order</h2>
    <p><b>Name:</b> ${safe(body.name)}</p>
    <p><b>Email:</b> ${safe(body.email)}</p>
    <p><b>Phone:</b> ${safe(body.phone)}</p>
    <p><b>Address:</b> ${safe(body.address)}, ${safe(body.postal)} ${safe(body.city)}, ${safe(body.country)}</p>
    <p><b>Quantity:</b> ${safe(body.quantity)}</p>
    <p><b>Language:</b> ${safe(body.language)}</p>
    <p><b>Displayed price:</b> ${safe(body.price)}</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: fromEmail, to: [orderEmail], reply_to: body.email, subject: `New order — Drill Dust Collector — ${safe(body.name)}`, html })
  });
  if (!response.ok) return res.status(502).json({ error: 'Email provider error' });
  return res.status(200).json({ ok: true });
}