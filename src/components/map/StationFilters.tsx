
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StationFiltersProps {
  selectedVehicleType: '2W' | '4W' | 'all';
  onVehicleTypeChange: (type: '2W' | '4W' | 'all') => void;
}

const StationFilters = ({ 
  selectedVehicleType, 
  onVehicleTypeChange 
}: StationFiltersProps) => {
  return (
    <Card className="p-4 mb-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-ev-blue" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>
        
        <div className="flex space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                {selectedVehicleType === 'all' && 'All Vehicles'}
                {selectedVehicleType === '2W' && '2-Wheelers'}
                {selectedVehicleType === '4W' && '4-Wheelers'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onVehicleTypeChange('all')}>
                  <span>All Vehicles</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVehicleTypeChange('2W')}>
                  <span>2-Wheelers</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVehicleTypeChange('4W')}>
                  <span>4-Wheelers</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default StationFilters;
