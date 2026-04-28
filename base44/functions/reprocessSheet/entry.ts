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

    const rawMeta = sheet.organized_data || {};
    const existingOwner = rawMeta._owner || {};
    const existingSitter = rawMeta._sitter || {};
    const existingPay = rawMeta._pay || '';

    const photoContext = (sheet.photo_labels || [])
      .map((label, i) => {
        const caption = sheet.photo_captions?.[i] || '';
        return `Photo ${i + 1}: ${label}${caption ? ` — ${caption}` : ''}`;
      })
      .filter(Boolean)
      .join('\n');

    // Use InvokeLLM WITHOUT response_json_schema so we get a plain string back
    // then parse it ourselves — avoids SDK wrapping issues
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

Return ONLY a valid JSON object (no markdown, no code fences) with these exact string keys (omit keys with no content):
{"owner_contact":"...","house_access":"...","pets_overview":"...",...}`,
    });

    console.log('LLM raw result type:', typeof result);
    console.log('LLM raw result (first 300):', JSON.stringify(result).slice(0, 300));

    // Unwrap all possible SDK response shapes
    let rawStr = result;
    if (rawStr && typeof rawStr === 'object' && rawStr.response !== undefined) rawStr = rawStr.response;
    if (typeof rawStr !== 'string') rawStr = JSON.stringify(rawStr);

    // Strip markdown code fences if present
    rawStr = rawStr.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    let aiData = {};
    try {
      aiData = JSON.parse(rawStr);
    } catch (e) {
      console.error('JSON parse error:', e.message, 'raw:', rawStr.slice(0, 200));
      return Response.json({ error: 'Failed to parse AI response', raw: rawStr.slice(0, 500) }, { status: 500 });
    }

    console.log('Parsed aiData keys:', Object.keys(aiData));

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