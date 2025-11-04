import { Bell } from "lucide-react";

interface EmptyNotificationsProps {
  message?: string;
  description?: string;
}

export const EmptyNotifications = ({
  message = "No notifications yet",
  description = "You'll see notifications here when you have updates"
}: EmptyNotificationsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        {description}
      </p>
    </div>
  );
};
