import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, CheckCircle2 } from "lucide-react";

interface ContactSalesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactSalesModal({ open, onOpenChange }: ContactSalesModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.organization) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage (optional)
    const contacts = JSON.parse(localStorage.getItem('salesContacts') || '[]');
    contacts.push({
      ...formData,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('salesContacts', JSON.stringify(contacts));

    setShowConfirmation(true);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setFormData({ name: "", email: "", organization: "", message: "" });
    onOpenChange(false);
  };

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-muted-foreground mb-6">
              Our sales team will contact you within 24 hours.
            </p>
            <div className="text-sm text-muted-foreground space-y-2 mb-6">
              <p className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                sales@thereadylab.com
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </p>
            </div>
            <Button onClick={handleClose} data-testid="button-close-sales">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Sales</DialogTitle>
          <DialogDescription>
            Get in touch with our sales team for custom pricing and enterprise solutions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sales-name">Name *</Label>
            <Input
              id="sales-name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-sales-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sales-email">Email *</Label>
            <Input
              id="sales-email"
              type="email"
              placeholder="you@organization.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              data-testid="input-sales-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sales-org">Organization *</Label>
            <Input
              id="sales-org"
              placeholder="Your organization name"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              data-testid="input-sales-org"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sales-message">Message (Optional)</Label>
            <Textarea
              id="sales-message"
              placeholder="Tell us about your needs..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              data-testid="textarea-sales-message"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-sales"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-sales">
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
