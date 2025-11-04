import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import {
  Upload,
  Users,
  Video,
  FileText,
  BookOpen,
  Settings,
} from "lucide-react";
import { CreateMicrolearningModal } from "@/components/educator/CreateMicrolearningModal";
import { CreateDeepLearningModal } from "@/components/educator/CreateDeepLearningModal";
import { UploadDigitalProductModal } from "@/components/educator/UploadDigitalProductModal";
import { CreateLiveEventModal } from "@/components/educator/CreateLiveEventModal";
import { CreateCommunityModal } from "@/components/educator/CreateCommunityModal";
import { MyContentTable } from "@/components/educator/MyContentTable";
import { NotificationsList } from "@/components/educator/NotificationsList";
import { PayoutManagement } from "@/components/settings/PayoutManagement";
import { CommunityManager } from "@/components/community/CommunityManager";

export const EducatorDashboard = () => {
  const navigate = useNavigate();
  const [microlearningModalOpen, setMicrolearningModalOpen] = useState(false);
  const [deepLearningModalOpen, setDeepLearningModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Educator Dashboard</h1>
                <p className="text-lg opacity-90">
                  Create, manage, and track all your content in one place
                </p>
              </div>
              <div className="hidden md:block">
                <BookOpen className="h-16 w-16" />
              </div>
            </div>
          </div>

          {/* Quick Upload Actions */}
          <div className="grid md:grid-cols-5 gap-4">
            <Button
              variant="hero"
              className="h-32 flex-col gap-2 text-center"
              onClick={() => setMicrolearningModalOpen(true)}
            >
              <Upload className="h-6 w-6" />
              <div>
                <div className="font-semibold">Microlearning</div>
                <div className="text-xs opacity-80">2-8 min video</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex-col gap-2 text-center"
              onClick={() => setDeepLearningModalOpen(true)}
            >
              <BookOpen className="h-6 w-6" />
              <div>
                <div className="font-semibold">Deep Learning</div>
                <div className="text-xs opacity-80">Full course</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex-col gap-2 text-center"
              onClick={() => setProductModalOpen(true)}
            >
              <FileText className="h-6 w-6" />
              <div>
                <div className="font-semibold">Digital Product</div>
                <div className="text-xs opacity-80">PDF, eBook</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex-col gap-2 text-center"
              onClick={() => setEventModalOpen(true)}
            >
              <Video className="h-6 w-6" />
              <div>
                <div className="font-semibold">Live Streaming</div>
                <div className="text-xs opacity-80">
                  Stream directly on platform
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex-col gap-2 text-center"
              onClick={() => setCommunityModalOpen(true)}
            >
              <Users className="h-6 w-6" />
              <div>
                <div className="font-semibold">Community</div>
                <div className="text-xs opacity-80">Group</div>
              </div>
            </Button>
          </div>

          {/* My Content Table */}
          <MyContentTable key={refreshKey} />

          {/* Communities Manager */}
          <CommunityManager />

          {/* Payout Overview */}
          <PayoutManagement />

          {/* Notifications */}
          <NotificationsList />

          {/* Settings Link */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateMicrolearningModal
        open={microlearningModalOpen}
        onOpenChange={setMicrolearningModalOpen}
        onSuccess={handleSuccess}
      />
      <CreateDeepLearningModal
        open={deepLearningModalOpen}
        onOpenChange={setDeepLearningModalOpen}
        onSuccess={handleSuccess}
      />
      <UploadDigitalProductModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        onSuccess={handleSuccess}
      />
      <CreateLiveEventModal
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
        onSuccess={handleSuccess}
      />
      <CreateCommunityModal
        open={communityModalOpen}
        onOpenChange={setCommunityModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
};
