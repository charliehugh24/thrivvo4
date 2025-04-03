
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventCategories } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';
import { ImageIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  location: z.string().min(3, { message: "Location must be provided" }),
  date: z.string().refine(val => !!val, { message: "Please select a date and time" })
});

type FormValues = z.infer<typeof formSchema>;

const AddEvent = () => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      date: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    console.log("Images:", images);
    
    toast({
      title: "Event submitted successfully!",
      description: "Your event will be reviewed shortly.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const newFiles = Array.from(e.target.files);
    
    // Process each file
    const filesProcessed = newFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });
    
    // When all files are processed
    Promise.all(filesProcessed).then(newImages => {
      setImages(prev => [...prev, ...newImages]);
      setUploading(false);
      toast({
        title: "Images uploaded",
        description: `${newImages.length} image(s) added successfully.`,
      });
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Add New Event</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Textarea placeholder="Describe your event" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Event Photos Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Event Photos
              </label>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                    <img 
                      src={img} 
                      alt={`Event image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)} 
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1" 
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {/* Image Upload Button */}
                <label 
                  className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed 
                    ${uploading ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'} 
                    rounded-md cursor-pointer transition-colors`}
                >
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <ImageIcon 
                      size={24} 
                      className={`mb-1 ${uploading ? 'text-gray-400' : 'text-gray-500'}`} 
                    />
                    <span className="text-xs font-medium text-gray-500">
                      {uploading ? 'Uploading...' : 'Add Photo'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                  />
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Upload photos to showcase your event. Adding multiple images will help attract more attendees.
              </p>
            </div>
            
            <Button type="submit" className="w-full">Create Event</Button>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default AddEvent;
