import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from 'lucide-react';

export type OrderFilterOptions = {
  status?: string;
  sortBy?: string;
  search?: string;
  dateRange?: string;
};

interface OrderFiltersProps {
  filters: OrderFilterOptions;
  onFilterChange: (filters: OrderFilterOptions) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = React.useState(filters.search || '');
  
  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value });
  };
  
  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sortBy: value });
  };
  
  const handleDateRangeChange = (value: string) => {
    onFilterChange({ ...filters, dateRange: value });
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchInput });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center mb-4">
        <SlidersHorizontal className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium">Filter Orders</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <Input
            placeholder="Search orders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="sm" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Date Range Filter */}
        <Select
          value={filters.dateRange || 'all'}
          onValueChange={handleDateRangeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="last3months">Last 3 Months</SelectItem>
            <SelectItem value="last6months">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Sort By */}
        <Select
          value={filters.sortBy || 'newest'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highestTotal">Highest Total</SelectItem>
            <SelectItem value="lowestTotal">Lowest Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderFilters;