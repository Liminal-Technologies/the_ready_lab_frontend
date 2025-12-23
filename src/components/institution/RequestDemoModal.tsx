import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Calendar, CheckCircle2, Loader2 } from "lucide-react";

interface RequestDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ORGANIZATION_TYPES = [
  "University / College",
  "Community College",
  "K-12 School / District",
  "Nonprofit Organization",
  "Enterprise / Corporation",
  "Government Agency",
  "Training Provider",
  "Other",
];

const AREAS_OF_INTEREST = [
  "Funding & Grant Writing",
  "Legal & Compliance",
  "Marketing & Communications",
  "Infrastructure & Operations",
  "Finance & Accounting",
  "AI & Technology",
  "Leadership Development",
  "Sales & Business Development",
];

export function RequestDemoModal({ open, onOpenChange }: RequestDemoModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    orgType: "",
    areasOfInterest: [] as string[],
    numUsers: "",
    customRequests: "",
    debarmentCheck: false,
  });

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.includes(area)
        ? prev.areasOfInterest.filter(a => a !== area)
        : [...prev.areasOfInterest, area]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orgName || !formData.contactName || !formData.email || !formData.orgType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build detailed message from form data
      const message = [
        `Organization Type: ${formData.orgType}`,
        formData.phone ? `Phone: ${formData.phone}` : null,
        formData.numUsers ? `Estimated Users: ${formData.numUsers}` : null,
        formData.areasOfInterest.length > 0 ? `Areas of Interest: ${formData.areasOfInterest.join(', ')}` : null,
        formData.debarmentCheck ? 'Debarment certification: Confirmed' : null,
        formData.customRequests ? `\nSpecial Requirements:\n${formData.customRequests}` : null,
      ].filter(Boolean).join('\n');

      // Submit to API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/demo-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.contactName.trim(),
          email: formData.email.trim(),
          company: formData.orgName.trim(),
          role: formData.orgType,
          message: message,
          source: 'institution-demo',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      // Also save to localStorage as backup
      const inquiries = JSON.parse(localStorage.getItem('demoInquiries') || '[]');
      inquiries.push({
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('demoInquiries', JSON.stringify(inquiries));

      setShowConfirmation(true);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setFormData({
      orgName: "",
      contactName: "",
      email: "",
      phone: "",
      orgType: "",
      areasOfInterest: [],
      numUsers: "",
      customRequests: "",
      debarmentCheck: false,
    });
    onOpenChange(false);
  };

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank You for Your Interest!</h3>
            <p className="text-muted-foreground mb-6">
              Our team will reach out within 24 hours to schedule your personalized demo.
            </p>

            {/* Fake Calendly Embed */}
            <div className="bg-muted/30 rounded-lg p-8 mb-6 border-2 border-dashed">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                You can also schedule directly using our calendar
              </p>
              <Button variant="outline" asChild data-testid="button-schedule-calendly">
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                  Open Calendly Scheduler
                </a>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>What's next?</strong></p>
              <p>1. Review your requirements</p>
              <p>2. Schedule a personalized demo</p>
              <p>3. Discuss custom pricing and implementation</p>
            </div>

            <Button 
              className="mt-6"
              onClick={handleClose}
              data-testid="button-close-confirmation"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Demo</DialogTitle>
          <DialogDescription>
            Tell us about your organization and we'll schedule a personalized demo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name *</Label>
            <Input
              id="org-name"
              placeholder="e.g., Community Foundation of Greater Atlanta"
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              data-testid="input-org-name"
            />
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name *</Label>
              <Input
                id="contact-name"
                placeholder="John Doe"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                data-testid="input-contact-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@organization.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              data-testid="input-phone"
            />
          </div>

          {/* Organization Type */}
          <div className="space-y-2">
            <Label htmlFor="org-type">Organization Type *</Label>
            <Select value={formData.orgType} onValueChange={(value) => setFormData({ ...formData, orgType: value })}>
              <SelectTrigger data-testid="select-org-type">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Areas of Interest */}
          <div className="space-y-3">
            <Label>Areas of Interest (Select all that apply)</Label>
            <div className="grid md:grid-cols-2 gap-2">
              {AREAS_OF_INTEREST.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area-${area}`}
                    checked={formData.areasOfInterest.includes(area)}
                    onCheckedChange={() => handleAreaToggle(area)}
                    data-testid={`checkbox-area-${area.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <label
                    htmlFor={`area-${area}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Users */}
          <div className="space-y-2">
            <Label htmlFor="num-users">Estimated Number of Users</Label>
            <Input
              id="num-users"
              type="number"
              placeholder="e.g., 50, 500, 5000"
              value={formData.numUsers}
              onChange={(e) => setFormData({ ...formData, numUsers: e.target.value })}
              data-testid="input-num-users"
            />
          </div>

          {/* Custom Requests */}
          <div className="space-y-2">
            <Label htmlFor="custom-requests">Special Requirements or Questions (Optional)</Label>
            <Textarea
              id="custom-requests"
              placeholder="Tell us about any specific needs, integrations, or questions you have..."
              value={formData.customRequests}
              onChange={(e) => setFormData({ ...formData, customRequests: e.target.value })}
              rows={4}
              data-testid="textarea-custom-requests"
            />
          </div>

          {/* Debarment Checkbox (Optional) */}
          <div className="flex items-start space-x-2 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id="debarment"
              checked={formData.debarmentCheck}
              onCheckedChange={(checked) => setFormData({ ...formData, debarmentCheck: checked as boolean })}
              data-testid="checkbox-debarment"
            />
            <div>
              <label
                htmlFor="debarment"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Debarment & Suspension Certification (Optional)
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                I certify that my organization is not currently debarred, suspended, or otherwise excluded from participation in federal assistance programs.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit-demo"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Demo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
