import { Bell, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsPopup() {
  const navigate = useNavigate();
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const handleNotificationClick = async (notification: any) => {
    try {
      await markAsRead(notification.id);

      // Navigate based on notification type and metadata
      switch (notification.type) {
        case 'contract_created':
          if (notification.metadata?.contract_id) {
            navigate(`/contracts/${notification.metadata.contract_id}`);
          }
          break;
        case 'tenant_added':
          if (notification.metadata?.tenant_id) {
            navigate(`/tenants/${notification.metadata.tenant_id}`);
          }
          break;
        case 'unit_added':
          if (notification.metadata?.unit_id) {
            navigate(`/units/${notification.metadata.unit_id}`);
          }
          break;
        case 'invoice_issued':
        case 'rent_due':
          if (notification.metadata?.payable_id) {
            navigate(`/payables/${notification.metadata.payable_id}`);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  if (loading) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          <button 
            onClick={() => markAllAsRead()}
            className="text-xs text-indigo-600 font-medium hover:text-indigo-700"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                !notification.is_read ? 'bg-indigo-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Bell className={`w-5 h-5 ${
                    !notification.is_read ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="ml-2 flex flex-col space-y-2">
                  {!notification.is_read && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}