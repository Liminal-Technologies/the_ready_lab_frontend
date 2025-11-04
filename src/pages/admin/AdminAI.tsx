import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Bot, 
  Plus,
  Settings,
  MessageSquare,
  HelpCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Save
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock FAQ data
const mockFAQs = [
  {
    id: "1",
    question: "How do I upgrade to an educator account?",
    answer: "You can upgrade to an educator account by purchasing one of our educator subscription plans ($49, $129, or $349). Once purchased, you'll automatically gain educator privileges.",
    category: "Account",
    is_active: true,
    order_index: 1,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    question: "What's included in the educator plans?",
    answer: "Educator plans include course creation tools, community management, digital product marketplace access, and advanced analytics. Higher tiers offer additional features like custom branding and priority support.",
    category: "Plans",
    is_active: true,
    order_index: 2,
    created_at: "2024-01-14T15:45:00Z"
  }
];

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export function AdminAI() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "General" });
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    response_delay: 2000,
    max_response_length: 500,
    fallback_to_human: true
  });
  const { toast } = useToast();

  const saveFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({
        title: "Error",
        description: "Please fill in both question and answer",
        variant: "destructive",
      });
      return;
    }

    const faq: FAQ = {
      id: Date.now().toString(),
      ...newFAQ,
      is_active: true,
      order_index: faqs.length + 1,
      created_at: new Date().toISOString()
    };

    setFaqs([...faqs, faq]);
    setNewFAQ({ question: "", answer: "", category: "General" });
    
    toast({
      title: "Success",
      description: "FAQ added successfully",
    });
  };

  const updateFAQ = () => {
    if (!editingFAQ) return;

    setFaqs(faqs.map(faq => 
      faq.id === editingFAQ.id ? editingFAQ : faq
    ));
    setEditingFAQ(null);
    
    toast({
      title: "Success",
      description: "FAQ updated successfully",
    });
  };

  const toggleFAQStatus = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, is_active: !faq.is_active } : faq
    ));
  };

  const deleteFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    toast({
      title: "Success",
      description: "FAQ deleted successfully",
    });
  };

  const saveAISettings = () => {
    toast({
      title: "Success",
      description: "AI assistant settings saved",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant Controls</h1>
          <p className="text-muted-foreground">
            Configure the AI assistant and manage FAQ responses
          </p>
        </div>
        <Badge variant="secondary">BETA FEATURE</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active FAQs</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {faqs.filter(faq => faq.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for AI responses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Questions answered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallback Rate</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13%</div>
            <p className="text-xs text-muted-foreground">
              Escalated to human
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faqs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="faqs">FAQ Management</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-6">
          {/* Add FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New FAQ
              </CardTitle>
              <CardDescription>
                Create frequently asked questions for the AI assistant to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="Enter the question..."
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Account, Plans, Technical"
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Enter the detailed answer..."
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={saveFAQ}>
                <Save className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ Database ({faqs.length})</CardTitle>
              <CardDescription>
                Manage all frequently asked questions for the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{faq.question}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {faq.answer}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{faq.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={faq.is_active}
                              onCheckedChange={() => toggleFAQStatus(faq.id)}
                            />
                            <span className="text-sm">
                              {faq.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{faq.order_index}</TableCell>
                        <TableCell>
                          {new Date(faq.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setEditingFAQ(faq);
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit FAQ
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Edit FAQ</DialogTitle>
                                    <DialogDescription>
                                      Update the question and answer for this FAQ
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editingFAQ && (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>Question</Label>
                                        <Input
                                          value={editingFAQ.question}
                                          onChange={(e) => setEditingFAQ({
                                            ...editingFAQ,
                                            question: e.target.value
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input
                                          value={editingFAQ.category}
                                          onChange={(e) => setEditingFAQ({
                                            ...editingFAQ,
                                            category: e.target.value
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Answer</Label>
                                        <Textarea
                                          value={editingFAQ.answer}
                                          onChange={(e) => setEditingFAQ({
                                            ...editingFAQ,
                                            answer: e.target.value
                                          })}
                                          rows={4}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingFAQ(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={updateFAQ}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteFAQ(faq.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Assistant Configuration
              </CardTitle>
              <CardDescription>
                Configure how the AI assistant behaves and responds to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow the AI to respond to user questions automatically
                  </p>
                </div>
                <Switch
                  checked={aiSettings.enabled}
                  onCheckedChange={(checked) => 
                    setAiSettings({ ...aiSettings, enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Response Delay (ms)</Label>
                <Input
                  type="number"
                  value={aiSettings.response_delay}
                  onChange={(e) => setAiSettings({
                    ...aiSettings,
                    response_delay: parseInt(e.target.value)
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  How long to wait before the AI responds (simulates typing)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Response Length</Label>
                <Input
                  type="number"
                  value={aiSettings.max_response_length}
                  onChange={(e) => setAiSettings({
                    ...aiSettings,
                    max_response_length: parseInt(e.target.value)
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of characters in AI responses
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Fallback to Human Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Escalate to human support when AI can't answer
                  </p>
                </div>
                <Switch
                  checked={aiSettings.fallback_to_human}
                  onCheckedChange={(checked) => 
                    setAiSettings({ ...aiSettings, fallback_to_human: checked })
                  }
                />
              </div>

              <Button onClick={saveAISettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-8 text-center">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Analytics</h3>
              <p className="text-muted-foreground">Detailed AI performance analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}