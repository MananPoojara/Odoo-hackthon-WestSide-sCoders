
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, Heart, Settings } from "lucide-react";

interface NotificationDropdownProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    type: "answer",
    title: "New answer on your question",
    message: "alex_senior answered your question about JWT authentication",
    time: "2 minutes ago",
    unread: true,
    icon: MessageSquare,
    user: "alex_senior"
  },
  {
    id: 2,
    type: "vote",
    title: "Your answer was upvoted",
    message: "Someone upvoted your answer on TypeScript best practices",
    time: "1 hour ago",
    unread: true,
    icon: Heart,
    user: null
  },
  {
    id: 3,
    type: "follow",
    title: "New follower",
    message: "emma_react started following you",
    time: "3 hours ago",
    unread: false,
    icon: UserPlus,
    user: "emma_react"
  }
];

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className="absolute top-16 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {mockNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.user ? (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {notification.user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-700">
              View all notifications
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};
