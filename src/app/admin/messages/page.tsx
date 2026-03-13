
"use client";

import React, { useState } from 'react';
import { draftAdminMessage } from '@/ai/flows/admin-message-drafting-assistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MessageSquare, Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const [intent, setIntent] = useState('');
  const [recipient, setRecipient] = useState<'Principal' | 'Student Manager'>('Principal');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [draftedMessage, setDraftedMessage] = useState<string | null>(null);

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await draftAdminMessage({
        messageIntent: intent,
        recipient,
        keyPoints: keyPoints || undefined,
        tone: tone || undefined
      });
      setDraftedMessage(result.draftedMessage);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Drafting Failed',
        description: 'There was an error generating your message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (draftedMessage) {
      navigator.clipboard.writeText(draftedMessage);
      toast({
        title: 'Copied!',
        description: 'Message draft copied to clipboard.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="font-headline text-4xl text-slate-900 font-bold">Message Drafting Assistant</h1>
          <p className="text-muted-foreground">Draft professional internal communications for the Institute</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Message Configuration</CardTitle>
              <CardDescription>Tell the AI what kind of message you need to draft.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDraft} className="space-y-6">
                <div className="space-y-2">
                  <Label>Recipient</Label>
                  <Select onValueChange={(v: any) => setRecipient(v)} defaultValue={recipient}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Student Manager">Student Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Message Intent / Subject</Label>
                  <Input 
                    placeholder="e.g. Request for workshop equipment maintenance" 
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Key Points (Optional)</Label>
                  <Textarea 
                    placeholder="e.g. Electrician workshop needs 5 new multimeters, current ones are faulty."
                    className="min-h-[100px]"
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Desired Tone</Label>
                  <Select onValueChange={setTone} defaultValue={tone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Encouraging">Encouraging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Drafting Message...</> : "Generate Draft"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {!draftedMessage && !loading && (
              <div className="h-full bg-white border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center opacity-40">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p>Your AI-drafted message will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="h-full bg-white rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
                <p className="animate-pulse">Analyzing context and drafting professional message...</p>
              </div>
            )}

            {draftedMessage && (
              <Card className="border-none shadow-lg animate-in fade-in slide-in-from-bottom-4">
                <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Generated Draft</CardTitle>
                    <CardDescription>To: {recipient}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="whitespace-pre-wrap font-body text-slate-800 leading-relaxed">
                    {draftedMessage}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
