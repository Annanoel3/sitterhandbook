import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { sheet_id } = await req.json();
    if (!sheet_id) return Response.json({ error: 'sheet_id required' }, { status: 400 });

    const sheets = await base44.entities.InstructionSheet.list();
    const sheet = sheets.find(s => s.id === sheet_id);
    if (!sheet) return Response.json({ error: 'Sheet not found' }, { status: 404 });

    // Reconstruct meta from current organized_data if it's the char-indexed mess
    const rawMeta = sheet.organized_data || {};
    let existingOwner = rawMeta._owner || {};
    let existingSitter = rawMeta._sitter || {};
    let existingPay = rawMeta._pay || '';

    // If organized_data keys are numeric (char-by-char mess), reconstruct the JSON string
    const keys = Object.keys(rawMeta);
    const isCharIndexed = keys.length > 10 && keys.every(k => !isNaN(k));
    if (isCharIndexed) {
      const jsonStr = keys.sort((a, b) => Number(a) - Number(b)).map(k => rawMeta[k]).join('');
      try {
        const parsed = JSON.parse(jsonStr);
        existingOwner = parsed._owner || parsed.owner || {};
        existingSitter = parsed._sitter || parsed.sitter || {};
        existingPay = parsed._pay || parsed.pay || '';
      } catch {}
    }

    const photoContext = (sheet.photo_labels || [])
      .map((label, i) => {
        const caption = sheet.photo_captions?.[i] || '';
        return `Photo ${i + 1}: ${label}${caption ? ` — ${caption}` : ''}`;
      })
      .filter(Boolean)
      .join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      model: "claude_sonnet_4_6",
      prompt: `You are an expert at organizing pet/house sitting instructions. Take the following rambled notes from a pet owner and organize them into a clear, comprehensive instruction sheet.

CRITICAL RULES:
1. NEVER invent, assume, or add ANY information not explicitly stated in the notes.
2. NEVER add negative statements about things not mentioned.
3. NEVER use placeholder text like "unspecified", "unknown", "not mentioned", or "N/A".
4. COMPLETENESS IS THE MOST IMPORTANT THING. Include EVERY detail — exact amounts, times, brand names, specific steps.
5. If something applies to multiple pets, write it out for EACH pet.
6. Do not paraphrase or summarize. Use the owner's own words wherever possible.
7. List EVERY pet mentioned. Do not skip any animal.
8. Only include categories that have explicit content from the notes.

RAW NOTES:
${sheet.raw_text || ''}

${photoContext ? `PHOTO DESCRIPTIONS:\n${photoContext}` : ''}

Organize into these categories (only include categories with relevant info). Use "• " prefix for bullet points:

1. owner_contact - Owner name, phone, email, trip destination, return date, emergency contacts, vet
2. house_access - Door codes, key locations, alarm, wifi, parking
3. pets_overview - Names, breeds, ages, personalities
4. feeding_schedule - What, when, how much, where stored, treats
5. medications - Medications, dosages, times, how to administer
6. walking_exercise - Walk schedules, leash locations, exercise needs
7. pet_quirks - Behavioral notes, fears, things to avoid, comfort items
8. plants_garden - Which plants, watering schedule
9. fish_aquarium - Feeding schedule, tank care
10. other_pets - Other animals and their care
11. house_rules - Garbage, mail, thermostat, lights, appliances
12. emergency_info - Emergency vet, poison control (888-426-4435), what to do if pet is sick
13. additional_notes - Anything else the sitter should know

Return ONLY valid JSON with these exact keys (omit keys with no content):
{
  "owner_contact": "bullet points...",
  "house_access": "bullet points...",
  ...
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          owner_contact: { type: 'string' },
          house_access: { type: 'string' },
          pets_overview: { type: 'string' },
          feeding_schedule: { type: 'string' },
          medications: { type: 'string' },
          walking_exercise: { type: 'string' },
          pet_quirks: { type: 'string' },
          plants_garden: { type: 'string' },
          fish_aquarium: { type: 'string' },
          other_pets: { type: 'string' },
          house_rules: { type: 'string' },
          emergency_info: { type: 'string' },
          additional_notes: { type: 'string' },
        },
      },
    });

    // The SDK may return { response: "json string" } or { response: {...} } or the object directly
    let aiData = result;
    if (aiData?.response !== undefined) aiData = aiData.response;
    if (typeof aiData === 'string') {
      try { aiData = JSON.parse(aiData); } catch { aiData = {}; }
    }

    const finalData = {
      ...aiData,
      _owner: existingOwner,
      _sitter: existingSitter,
      _pay: existingPay,
    };

    await base44.entities.InstructionSheet.update(sheet_id, {
      organized_data: finalData,
      status: 'ready',
    });

    return Response.json({ success: true, data: finalData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});