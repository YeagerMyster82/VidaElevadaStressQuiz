export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const {
    name = "",
    email = "",
    nervous_system_state = "",
    quiz_optin = false,
  } = request.body || {};

  if (!name.trim() || !email.trim() || !nervous_system_state.trim()) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const webhookUrl = process.env.CAPTIVATION_HUB_WEBHOOK_URL || "";
  const defaultRedirectUrl =
    request.headers.origin
      ? `${request.headers.origin}/one-time-offer/`
      : "https://vidaelevada.com/one-time-offer/";
  const redirectUrl = process.env.OTO_PAGE_URL || defaultRedirectUrl;

  const payload = {
    name: name.trim(),
    email: email.trim(),
    nervous_system_state: nervous_system_state.trim(),
    quiz_optin: Boolean(quiz_optin),
    source: "vida-elevada-quiz",
  };

  if (!webhookUrl) {
    return response.status(200).json({
      ok: true,
      mode: "demo",
      redirectUrl,
    });
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      const text = await webhookResponse.text();
      return response.status(502).json({
        error: "Webhook request failed",
        details: text,
      });
    }

    return response.status(200).json({
      ok: true,
      redirectUrl,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Unexpected webhook error",
      details: error.message,
    });
  }
}
