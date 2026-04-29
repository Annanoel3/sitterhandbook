import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Loader2, PawPrint, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function MySheets() {
  const { data: sheets = [], isLoading, refetch } = useQuery({
    queryKey: ['sheets'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.InstructionSheet.filter({ created_by: user.email }, '-created_date', 50);
    },
  });

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await base44.entities.InstructionSheet.delete(id);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">My Sheets</h1>
            <p className="text-muted-foreground mt-1">All your saved instruction sheets</p>
          </div>
          <Link to="/create">
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> New Sheet
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sheets.length === 0 ? (
          <div className="text-center py-20">
            <PawPrint className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No instruction sheets yet</p>
            <Link to="/create">
              <Button className="rounded-xl">Create Your First Sheet</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sheets.map((sheet, i) => (
              <motion.div
                key={sheet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={sheet.status === 'ready' ? `/review?id=${sheet.id}` : `/create`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60 group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{sheet.title || 'Untitled Sheet'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sheet.created_date && format(new Date(sheet.created_date), 'MMM d, yyyy')}
                          {sheet.status === 'organizing' && ' • Processing...'}
                          {sheet.status === 'ready' && ' • Ready'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(sheet.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}