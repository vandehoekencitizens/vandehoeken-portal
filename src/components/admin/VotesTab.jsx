import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/UI/dialog';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { toast } from 'sonner';

export default function VotesTab() {
  const queryClient = useQueryClient();
  const { data: votes = [] } = useQuery({ 
    queryKey: ['admin-votes'], 
    queryFn: () => base44.entities.Vote.list() 
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Voting Management</CardTitle>
        <VoteDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {votes.map(vote => (
            <div key={vote.id} className="p-4 border rounded-lg">
              <h4 className="font-semibold">{vote.title}</h4>
              <p className="text-sm text-slate-600">{vote.description}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={async () => {
                  await base44.entities.Vote.update(vote.id, { ...vote, status: 'active' });
                  queryClient.invalidateQueries(['admin-votes']);
                  toast.success('Vote activated');
                }}>Activate</Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  await base44.entities.Vote.update(vote.id, { ...vote, status: 'closed' });
                  queryClient.invalidateQueries(['admin-votes']);
                  toast.success('Vote closed');
                }}>Close</Button>
                <Button size="sm" variant="destructive" onClick={async () => {
                  await base44.entities.Vote.delete(vote.id);
                  queryClient.invalidateQueries(['admin-votes']);
                  toast.success('Vote deleted');
                }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function VoteDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', description: '', vote_type: 'poll',
    options: ['', ''], start_date: '', end_date: ''
  });
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.Vote.create({
      ...formData,
      options: formData.options.filter(o => o.trim() !== ''),
      status: 'draft'
    });
    queryClient.invalidateQueries(['admin-votes']);
    toast.success('Vote created');
    setOpen(false);
    setFormData({ title: '', description: '', vote_type: 'poll', options: ['', ''], start_date: '', end_date: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Create Vote</Button></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Create Vote/Referendum</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
          <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
          <div>
            <Label>Type</Label>
            <Select value={formData.vote_type} onValueChange={(val) => setFormData({...formData, vote_type: val})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="poll">Poll</SelectItem>
                <SelectItem value="referendum">Referendum</SelectItem>
                <SelectItem value="election">Election</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Options</Label>
            {formData.options.map((opt, idx) => (
              <Input 
                key={idx} className="mt-2" value={opt} 
                onChange={(e) => {
                  const newOpts = [...formData.options];
                  newOpts[idx] = e.target.value;
                  setFormData({...formData, options: newOpts});
                }}
                placeholder={`Option ${idx + 1}`}
              />
            ))}
            <Button type="button" size="sm" className="mt-2" onClick={() => setFormData({...formData, options: [...formData.options, '']})}>
              <Plus className="w-4 h-4 mr-1" />Add Option
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Date</Label><Input type="datetime-local" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} /></div>
            <div><Label>End Date</Label><Input type="datetime-local" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} /></div>
          </div>
          <Button type="submit" className="w-full">Create Vote</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
