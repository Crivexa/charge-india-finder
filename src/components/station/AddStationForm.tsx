
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useStations } from '@/hooks/use-stations';
import { useGeolocation } from '@/hooks/use-geolocation';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Station name must be at least 3 characters' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  pricePerHour: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  availableSlots: z.coerce.number().int().positive({ message: 'Slots must be a positive integer' }),
  twoWheeler: z.boolean().default(false),
  fourWheeler: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  useCurrentLocation: z.boolean().default(true),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddStationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { addStation } = useStations();
  const { latitude, longitude } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      pricePerHour: 50,
      availableSlots: 1,
      twoWheeler: false,
      fourWheeler: false,
      isActive: true,
      isPublic: true,
      useCurrentLocation: true,
    },
  });
  
  const useCurrentLocation = form.watch('useCurrentLocation');
  
  const onSubmit = async (data: FormValues) => {
    const vehicleTypes: ('2W' | '4W')[] = [];
    if (data.twoWheeler) vehicleTypes.push('2W');
    if (data.fourWheeler) vehicleTypes.push('4W');
    
    if (vehicleTypes.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one vehicle type',
        variant: 'destructive',
      });
      return;
    }
    
    let stationLatitude: number;
    let stationLongitude: number;
    
    if (data.useCurrentLocation) {
      if (!latitude || !longitude) {
        toast({
          title: 'Location Error',
          description: 'Could not access your current location. Please enter coordinates manually.',
          variant: 'destructive',
        });
        return;
      }
      stationLatitude = latitude;
      stationLongitude = longitude;
    } else {
      if (!data.latitude || !data.longitude) {
        toast({
          title: 'Validation Error',
          description: 'Please enter valid latitude and longitude',
          variant: 'destructive',
        });
        return;
      }
      stationLatitude = data.latitude;
      stationLongitude = data.longitude;
    }
    
    setIsSubmitting(true);
    
    try {
      await addStation({
        name: data.name,
        latitude: stationLatitude,
        longitude: stationLongitude,
        vehicleTypes,
        pricePerHour: data.pricePerHour,
        availableSlots: data.availableSlots,
        description: data.description,
        address: data.address,
        isActive: data.isActive,
        isPublic: data.isPublic,
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding station:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Station Name</FormLabel>
              <FormControl>
                <Input placeholder="Electric Avenue Charging Hub" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Electric Avenue, New Delhi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your charging station, hours of operation, amenities, etc." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pricePerHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Hour (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="availableSlots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Slots</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Vehicle Types</h3>
            <p className="text-sm text-muted-foreground">
              Select the types of vehicles your station can charge
            </p>
          </div>
          
          <div className="flex space-x-8">
            <FormField
              control={form.control}
              name="twoWheeler"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    2-Wheeler
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fourWheeler"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    4-Wheeler
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="useCurrentLocation"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Use my current location
                </FormLabel>
              </FormItem>
            )}
          />
          
          {!useCurrentLocation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        
        <div className="flex space-x-8">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="font-normal cursor-pointer">
                    Active
                  </FormLabel>
                  <FormDescription>
                    Is this station currently operational?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="font-normal cursor-pointer">
                    Public
                  </FormLabel>
                  <FormDescription>
                    Should this station be visible to all users?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Station...
            </>
          ) : (
            'Add Station'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddStationForm;
