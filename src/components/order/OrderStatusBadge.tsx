import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  AlertCircle,
  XCircle
} from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Pending'
  },
  processing: {
    icon: Package,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Processing'
  },
  shipped: {
    icon: Truck,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'Shipped'
  },
  delivered: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Delivered'
  },
  cancelled: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Cancelled'
  },
  refunded: {
    icon: AlertCircle,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Refunded'
  }
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
  size = 'md'
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border ${config.color} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} ${size !== 'sm' ? 'mr-1.5' : 'mr-1'}`} />}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;