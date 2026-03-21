"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, Bell, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '' });

  useEffect(() => {
    fetchNotifications();
  }, [firestore]);

  const fetchNotifications = async () => {
    try {
      const q = query(collection(firestore, 'notifications'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast({ title: "Error", description: "Failed to load notifications.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newNotif.title || !newNotif.message) return;
    setSaving(true);
    try {
      const payload = { ...newNotif, timestamp: Date.now() };
      const docRef = await addDoc(collection(firestore, 'notifications'), payload);
      setNotifications(prev => [{ id: docRef.id, ...payload }, ...prev]);
      setNewNotif({ title: '', message: '' });
      toast({ title: "Success", description: "Notification published." });
    } catch (err) {
      toast({ title: "Error", description: "Could not publish.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(firestore, 'notifications', id));
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: "Deleted", description: "Notification removed." });
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary">Live Notifications</h1>
      <Card className="border-t-4 border-t-secondary shadow-md">
        <CardHeader><CardTitle>Broadcast New Notification</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={newNotif.title} onChange={e => setNewNotif(prev => ({ ...prev, title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea value={newNotif.message} onChange={e => setNewNotif(prev => ({ ...prev, message: e.target.value }))} />
          </div>
          <Button onClick={handleAdd} disabled={saving} className="bg-secondary hover:bg-secondary/90 text-white font-bold">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />} Broadcast
          </Button>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {notifications.map(n => (
          <Card key={n.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(n.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
