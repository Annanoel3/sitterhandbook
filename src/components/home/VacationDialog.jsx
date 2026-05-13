import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';

export default function VacationDialog({ open, onClose, vacation, onSaved }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (vacation) {
      setTitle(vacation.title || '');
      setStartDate(vacation.start_date || '');
      setEndDate(vacation.end_date || '');
      setDestination(vacation.destination || '');
      setNotes(vacation.notes || '');
    } else {
      setTitle('');
      setStartDate('');
      setEndDate('');
      setDestination('');
      setNotes('');
    }
  }, [vacation, open]);

  const handleSave = async () => {
    if (!title.trim() || !startDate) return;
    setSaving(true);
    const data = { title, start_date: startDate, end_date: endDate || startDate, destination, notes };
    if (vacation?.id) {
      await base44.entities.Vacation.update(vacation.id, data);
    } else {
      await base44.entities.Vacation.create(data);
    }
    setSaving(false);
    onSaved();
  };

  const handleDelete = async () => {
    if (!vacation?.id) return;
    setDeleting(true);
    await base44.entities.Vacation.delete(vacation.id);
    setDeleting(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{vacation ? 'Edit Trip' : 'Add Trip'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs mb-1 block">Trip Name *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Beach Trip" className="rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Start Date *</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-lg" />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Destination</Label>
            <Input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Cancun" className="rounded-lg" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any extra info..." className="rounded-lg min-h-[80px] resize-none text-sm" />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {vacation && (
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting} className="text-destructive hover:text-destructive mr-auto">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !title.trim() || !startDate} className="rounded-lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {vacation ? 'Save Changes' : 'Add Trip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}