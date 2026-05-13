import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, PawPrint, Flower2, Home, Phone, StickyNote, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const emptyPet = () => ({ name: '', species: '', breed: '', age: '', feeding: '', medical: '', quirks: '' });

export default function HouseholdInfoPage() {
  const [info, setInfo] = useState(null);
  const [infoId, setInfoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form fields
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [pets, setPets] = useState([emptyPet()]);
  const [plants, setPlants] = useState('');
  const [houseAccess, setHouseAccess] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState('');
  const [miscNotes, setMiscNotes] = useState('');

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const user = await base44.auth.me();
    const results = await base44.entities.HouseholdInfo.filter({ created_by: user.email });
    if (results.length > 0) {
      const record = results[0];
      setInfo(record);
      setInfoId(record.id);
      setOwnerName(record.owner_name || '');
      setOwnerPhone(record.owner_phone || '');
      setOwnerEmail(record.owner_email || '');
      setPets(record.pets?.length > 0 ? record.pets : [emptyPet()]);
      setPlants(record.plants || '');
      setHouseAccess(record.house_access || '');
      setEmergencyContacts(record.emergency_contacts || '');
      setMiscNotes(record.misc_notes || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      owner_name: ownerName,
      owner_phone: ownerPhone,
      owner_email: ownerEmail,
      pets: pets.filter(p => p.name.trim()),
      plants,
      house_access: houseAccess,
      emergency_contacts: emergencyContacts,
      misc_notes: miscNotes,
    };
    if (infoId) {
      await base44.entities.HouseholdInfo.update(infoId, data);
    } else {
      const created = await base44.entities.HouseholdInfo.create(data);
      setInfoId(created.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updatePet = (i, field, val) => {
    setPets(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  };

  const addPet = () => setPets(prev => [...prev, emptyPet()]);
  const removePet = (i) => setPets(prev => prev.filter((_, idx) => idx !== i));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-1">My Household Info</h1>
          <p className="text-muted-foreground">Keep your pets, plants, and home info here. It'll be available to pull into any new sheet you create.</p>
        </motion.div>

        <div className="space-y-6">

          {/* Owner Info */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> Owner Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs mb-1 block">Name</Label>
                <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Your name" className="rounded-lg" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Phone</Label>
                <Input value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} placeholder="Phone number" className="rounded-lg" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Email</Label>
                <Input value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="Email" className="rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Pets */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-primary" /> My Pets
                </CardTitle>
                <Button size="sm" variant="outline" onClick={addPet} className="rounded-lg text-xs gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Pet
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {pets.map((pet, i) => (
                <div key={i} className="relative border border-border/50 rounded-xl p-4 space-y-3">
                  {pets.length > 1 && (
                     <button
                       onClick={() => removePet(i)}
                       style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', margin: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.color = 'hsl(0, 72%, 51%)';
                         e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.color = 'hsl(30, 8%, 42%)';
                         e.currentTarget.style.backgroundColor = 'transparent';
                       }}
                     >
                       <Trash2 style={{ width: '16px', height: '16px', flexShrink: 0, pointerEvents: 'none' }} />
                     </button>
                   )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs mb-1 block">Name *</Label>
                      <Input value={pet.name} onChange={e => updatePet(i, 'name', e.target.value)} placeholder="e.g. Biscuit" className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Species</Label>
                      <Input value={pet.species} onChange={e => updatePet(i, 'species', e.target.value)} placeholder="Dog / Cat / etc." className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Breed</Label>
                      <Input value={pet.breed} onChange={e => updatePet(i, 'breed', e.target.value)} placeholder="e.g. Golden Retriever" className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Age</Label>
                      <Input value={pet.age} onChange={e => updatePet(i, 'age', e.target.value)} placeholder="e.g. 3 years" className="rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Feeding Notes</Label>
                    <Textarea value={pet.feeding} onChange={e => updatePet(i, 'feeding', e.target.value)} placeholder="What, how much, when..." className="rounded-lg min-h-[60px] resize-none text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Medical / Medications</Label>
                    <Textarea value={pet.medical} onChange={e => updatePet(i, 'medical', e.target.value)} placeholder="Any meds, allergies, vet info..." className="rounded-lg min-h-[60px] resize-none text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Quirks & Personality</Label>
                    <Textarea value={pet.quirks} onChange={e => updatePet(i, 'quirks', e.target.value)} placeholder="Fears, habits, favorite toys..." className="rounded-lg min-h-[60px] resize-none text-sm" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Plants */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-primary" /> Plants & Garden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={plants} onChange={e => setPlants(e.target.value)} placeholder="List your plants and their watering schedules..." className="rounded-xl min-h-[100px] resize-y text-sm" />
            </CardContent>
          </Card>

          {/* House Access */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" /> House Access & Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={houseAccess} onChange={e => setHouseAccess(e.target.value)} placeholder="Door codes, key location, alarm info, wifi password..." className="rounded-xl min-h-[100px] resize-y text-sm" />
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> Emergency Contacts & Vet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={emergencyContacts} onChange={e => setEmergencyContacts(e.target.value)} placeholder="Vet name & number, emergency contact, animal hospital..." className="rounded-xl min-h-[100px] resize-y text-sm" />
            </CardContent>
          </Card>

          {/* Misc Notes */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-primary" /> Miscellaneous Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={miscNotes} onChange={e => setMiscNotes(e.target.value)} placeholder="Garbage schedule, house rules, mail, thermostat settings..." className="rounded-xl min-h-[100px] resize-y text-sm" />
            </CardContent>
          </Card>

          {/* Save */}
          <div className="pb-12">
            <Button size="lg" onClick={handleSave} disabled={saving} className="w-full rounded-xl py-6 shadow-lg shadow-primary/20">
              {saving ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</>
              ) : saved ? (
                <><CheckCircle2 className="w-5 h-5 mr-2" />Saved!</>
              ) : (
                <><Save className="w-5 h-5 mr-2" />Save Household Info</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}