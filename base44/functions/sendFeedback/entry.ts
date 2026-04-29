import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const { message } = await req.json();
    if (!message) return Response.json({ error: 'Message required' }, { status: 400 });

    const from = user?.email || 'anonymous';

    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'mediocreatbestdev@outlook.com' }] }],
        from: { email: 'noreply@sitterhandbook.com', name: 'SitterHandbook Feedback' },
        subject: 'SitterHandbook Feedback',
        content: [{ type: 'text/plain', value: `From: ${from}\n\n${message}` }],
      }),
    });

    // Fallback: use base44 integrations to notify via the app owner's email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user?.email || 'mediocreatbestdev@outlook.com',
      subject: '[SitterHandbook] Feedback received',
      body: `Feedback submitted by ${from}:\n\n${message}\n\n---\nA copy has been logged.`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});