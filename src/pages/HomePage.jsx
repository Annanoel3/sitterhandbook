import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, PawPrint, ChevronRight, Loader2, CalendarDays, Home, Pencil, Plane } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import VacationDialog from '@/components/home/VacationDialog';

export default function HomePage() {
  const navigate = useNavigate();
  const [vacationDialogOpen, setVacationDialogOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState(null);

  const { data: vacations = [], isLoading: loadingVacations, refetch: refetchVacations } = useQuery({
    queryKey: ['vacations'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Vacation.filter({ created_by: user.email }, 'start_date', 50);
    },
  });

  const { data: household, isLoading: loadingHousehold } = useQuery({
    queryKey: ['household'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.HouseholdInfo.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  const upcomingVacations = vacations.filter(v => !isPast(parseISO(v.end_date || v.start_date)));
  const pastVacations = vacations.filter(v => isPast(parseISO(v.end_date || v.start_date)));

  const openNew = () => {
    setEditingVacation(null);
    setVacationDialogOpen(true);
  };

  const openEdit = (v, e) => {
    e.stopPropagation();
    setEditingVacation(v);
    setVacationDialogOpen(true);
  };

  const handleVacationClick = (v) => {
    if (v.sheet_id) {
      navigate(`/review?id=${v.sheet_id}`);
    } else {
      navigate(`/create`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <PawPrint className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2">SitterHandbook</h1>
          <p className="text-muted-foreground">Your pet/home sitting instructions, organized.</p>
        </motion.div>

        {/* Upcoming Vacations */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-lg">Upcoming Trips</h2>
            </div>
            <Button size="sm" variant="outline" onClick={openNew} className="rounded-lg gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Trip
            </Button>
          </div>

          {loadingVacations ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : upcomingVacations.length === 0 ? (
            <Card className="border-dashed border-border/80">
              <CardContent className="py-10 text-center">
                <Plane className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No upcoming trips yet</p>
                <Button size="sm" variant="outline" onClick={openNew} className="rounded-lg">Plan a Trip</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingVacations.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card
                    className="hover:shadow-md transition-shadow cursor-pointer border-border/60 group"
                    onClick={() => handleVacationClick(v)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                        <Plane className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{v.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(parseISO(v.start_date), 'MMM d')}
                          {v.end_date && v.end_date !== v.start_date && ` – ${format(parseISO(v.end_date), 'MMM d, yyyy')}`}
                          {v.destination && ` · ${v.destination}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {v.sheet_id ? (
                          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Sheet ready</span>
                        ) : (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">No sheet</span>
                        )}
                        <button
                          onClick={(e) => openEdit(v, e)}
                          className="ml-1 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Past trips */}
          {pastVacations.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Past trips ({pastVacations.length})</p>
              <div className="space-y-2">
                {pastVacations.slice(0, 3).map(v => (
                  <Card
                    key={v.id}
                    className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity border-border/40"
                    onClick={() => handleVacationClick(v)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Plane className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{v.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{format(parseISO(v.start_date), 'MMM d, yyyy')}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* Household Overview */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-lg">My Household</h2>
            </div>
            <Link to="/household">
              <Button size="sm" variant="outline" className="rounded-lg gap-1 text-xs">
                <Pencil className="w-3.5 h-3.5" /> Edit Info
              </Button>
            </Link>
          </div>

          {loadingHousehold ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : !household ? (
            <Card className="border-dashed border-border/80">
              <CardContent className="py-10 text-center">
                <Home className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No household info saved yet</p>
                <Link to="/household">
                  <Button size="sm" variant="outline" className="rounded-lg">Set Up My Household</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60">
              <CardContent className="p-5 space-y-4">
                {household.owner_name && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Owner</p>
                    <p className="font-medium">{household.owner_name}</p>
                    {household.owner_phone && <p className="text-sm text-muted-foreground">{household.owner_phone}</p>}
                  </div>
                )}

                {household.pets?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Pets</p>
                    <div className="flex flex-wrap gap-2">
                      {household.pets.map((pet, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5">
                          <PawPrint className="w-3.5 h-3.5 text-accent" />
                          <span className="text-sm font-medium">{pet.name}</span>
                          {(pet.species || pet.breed) && (
                            <span className="text-xs text-muted-foreground">· {pet.breed || pet.species}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {household.house_access && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">House Access</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{household.house_access}</p>
                  </div>
                )}

                <Link to="/household" className="block">
                  <div className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                    View full details <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.section>

      </div>

      <VacationDialog
        open={vacationDialogOpen}
        onClose={() => setVacationDialogOpen(false)}
        vacation={editingVacation}
        onSaved={() => { refetchVacations(); setVacationDialogOpen(false); }}
      />
    </div>
  );
}