
"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Trash2, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminNotifications() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Mock Test Alert', message: 'Mock Test for Electrician Year 1 starts tomorrow.', date: '2 hours ago', target: 'Electrician' },
    { id: 2, title: 'Fee Deadline', message: 'Fees for Semester 2 last date is 30th May.', date: '1 day ago', target: 'All Students' },
  ]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote = {
      id: Date.now(),
      title,
      message,
      date: 'Just now',
      target: 'All Students'
    };
    setNotifications([newNote, ...notifications]);
    setTitle('');
    setMessage('');
    toast({
      title: "Notification Published",
      description: "It is now visible on the student dashboard.",
    });
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      variant: "destructive",
      title: "Notification Removed",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl text-slate-900 font-bold">Broadcast Notifications</h1>
          <p className="text-muted-foreground">Announce updates to students directly on their dashboards</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary"/> Create Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="space-y-2">
                  <Label>Short Title</Label>
                  <Input 
                    placeholder="e.g. Workshop Holiday" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Body</Label>
                  <Textarea 
                    placeholder="Provide full details of the announcement..."
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2 bg-primary">
                  <Send className="w-4 h-4" /> Publish to Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 px-2">
              <Bell className="w-5 h-5 text-secondary" /> Active Announcements
            </h3>
            {notifications.map((n) => (
              <Card key={n.id} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-[10px]">{n.target}</Badge>
                    <span className="text-[10px] text-muted-foreground">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">{n.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8"
                      onClick={() => handleDelete(n.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notifications.length === 0 && (
              <div className="bg-white border-2 border-dashed rounded-xl p-12 text-center opacity-40">
                No active announcements
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
