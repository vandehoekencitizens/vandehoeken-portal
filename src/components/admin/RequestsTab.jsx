import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { toast } from 'sonner';

export default function RequestsTab() {
  const queryClient = useQueryClient();
  const { data: serviceRequests = [] } = useQuery({ 
    queryKey: ['admin-requests'], 
    queryFn: () => base44.entities.ServiceRequest.list('-created_date') 
  });

  const handleApprove = async (req) => {
    await base44.entities.ServiceRequest.update(req.id, { ...req, status: 'approved', admin_notes: 'Approved by admin' });
    await base44.integrations.Core.SendEmail({
      to: req.user_email,
      subject: 'Service Request Approved',
      body: `Your service request "${req.title}" has been approved.`
    });
    queryClient.invalidateQueries(['admin-requests']);
    toast.success('Request approved');
  };

  const handleReject = async (req) => {
    await base44.entities.ServiceRequest.update(req.id, { ...req, status: 'rejected', admin_notes: 'Rejected by admin' });
    await base44.integrations.Core.SendEmail({
      to: req.user_email,
      subject: 'Service Request Update',
      body: `Your service request "${req.title}" has been reviewed.`
    });
    queryClient.invalidateQueries(['admin-requests']);
    toast.success('Request rejected');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceRequests.map(req => (
            <div key={req.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{req.title}</h4>
                  <p className="text-sm text-slate-600">{req.description}</p>
                  <p className="text-xs text-slate-500 mt-1">From: {req.user_email} | Type: {req.request_type}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-slate-100'}`}>
                  {req.status}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => handleApprove(req)}>
                  <CheckCircle className="w-4 h-4 mr-1" />Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleReject(req)}>
                  <XCircle className="w-4 h-4 mr-1" />Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
