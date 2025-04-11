
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Station } from '@/hooks/use-stations';
import { useBookings } from '@/hooks/use-bookings';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  station: Station;
  onSuccess?: () => void;
}

// Generate available time slots (1-hour slots from 8AM to 8PM)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? 'AM' : 'PM';
    slots.push({
      value: `${hour}:00`,
      label: `${formattedHour}:00 ${amPm}`,
    });
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const BookingForm = ({ station, onSuccess }: BookingFormProps) => {
  const { bookSlot, checkSlotAvailability, generateICSFile } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedInfo, setBookedInfo] = useState<{ date: Date; timeSlot: string } | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });
  
  const selectedDate = form.watch('date');
  const selectedTimeSlot = form.watch('timeSlot');
  
  const [slotAvailability, setSlotAvailability] = useState<{ [key: string]: boolean | null }>({});
  
  const checkAvailability = async (date: Date, timeSlot: string) => {
    if (!date || !timeSlot) return;
    
    const key = `${format(date, 'yyyy-MM-dd')}-${timeSlot}`;
    
    if (slotAvailability[key] !== undefined) return;
    
    setSlotAvailability((prev) => ({
      ...prev,
      [key]: null, // loading state
    }));
    
    const isAvailable = await checkSlotAvailability(station.id, date, timeSlot);
    
    setSlotAvailability((prev) => ({
      ...prev,
      [key]: isAvailable,
    }));
    
    return isAvailable;
  };
  
  // Check availability when date or time slot changes
  const onDateChange = (date: Date | undefined) => {
    if (!date) return;
    form.setValue('date', date);
    
    if (selectedTimeSlot) {
      checkAvailability(date, selectedTimeSlot);
    }
  };
  
  const onTimeSlotChange = (timeSlot: string) => {
    form.setValue('timeSlot', timeSlot);
    
    if (selectedDate) {
      checkAvailability(selectedDate, timeSlot);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    const key = `${format(data.date, 'yyyy-MM-dd')}-${data.timeSlot}`;
    let isAvailable = slotAvailability[key];
    
    if (isAvailable === null || isAvailable === undefined) {
      isAvailable = await checkAvailability(data.date, data.timeSlot);
    }
    
    if (!isAvailable) {
      toast({
        title: 'Slot Unavailable',
        description: 'This time slot is already booked. Please select another time.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await bookSlot({
        stationId: station.id,
        stationName: station.name,
        date: data.date,
        timeSlot: data.timeSlot,
      });
      
      if (success) {
        setBookingSuccess(true);
        setBookedInfo({
          date: data.date,
          timeSlot: data.timeSlot,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error booking slot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Find the selected time slot label
  const getTimeSlotLabel = (value: string) => {
    const slot = timeSlots.find((slot) => slot.value === value);
    return slot ? slot.label : value;
  };
  
  const handleDownloadICS = () => {
    if (!bookedInfo) return;
    
    // Create a temporary booking object for ICS generation
    const tempBooking = {
      id: 'temp-' + Date.now(),
      userId: '',
      userName: '',
      stationId: station.id,
      stationName: station.name,
      date: bookedInfo.date,
      timeSlot: bookedInfo.timeSlot,
      status: 'confirmed' as const,
      createdAt: new Date(),
    };
    
    generateICSFile(tempBooking);
  };
  
  if (bookingSuccess) {
    return (
      <div className="py-4 space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-800 font-semibold text-lg mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-green-700">
            Your charging slot at {station.name} has been successfully booked.
          </p>
          <p className="text-green-700 mt-2">
            <span className="font-medium">Date:</span> {format(bookedInfo!.date, 'MMMM d, yyyy')}
          </p>
          <p className="text-green-700">
            <span className="font-medium">Time:</span> {getTimeSlotLabel(bookedInfo!.timeSlot)}
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={handleDownloadICS} className="w-full sm:w-auto">
            Download Calendar Invite (.ics)
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={onDateChange}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot</FormLabel>
              <Select
                onValueChange={onTimeSlotChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((slot) => {
                    const key = selectedDate ? `${format(selectedDate, 'yyyy-MM-dd')}-${slot.value}` : '';
                    const availability = key ? slotAvailability[key] : undefined;
                    
                    return (
                      <SelectItem 
                        key={slot.value} 
                        value={slot.value}
                        disabled={availability === false}
                        className={cn(
                          availability === false && "text-red-500 line-through",
                          availability === true && "text-green-500"
                        )}
                      >
                        {slot.label}
                        {availability === false && " (Booked)"}
                        {availability === true && " (Available)"}
                        {availability === null && " (Checking...)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            'Book Slot'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
