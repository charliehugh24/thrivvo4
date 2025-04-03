
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ImageIcon, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EventPhotosStep = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    type: '',
    name: '',
    category: '',
    description: '',
    location: '',
    date: '',
    images: [] as string[]
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load saved data from session storage
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setEventData(prevData => ({
        ...prevData,
        ...parsedData,
        images: parsedData.images || []
      }));
    } else {
      // If no data, go back to the start
      navigate('/add-event');
    }
  }, [navigate]);

  const handleBack = () => {
    // Save current images before going back
    const updatedEventData = { ...eventData };
    sessionStorage.setItem('newEventData', JSON.stringify(updatedEventData));
    navigate('/add-event/details-info');
  };

  const handleNext = () => {
    // Save the data including images
    sessionStorage.setItem('newEventData', JSON.stringify(eventData));
    
    // Go to the review step
    navigate('/add-event/review');
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
      const updatedImages = [...eventData.images, ...newImages];
      setEventData(prev => ({ ...prev, images: updatedImages }));
      setUploading(false);
      toast({
        title: "Images uploaded",
        description: `${newImages.length} image(s) added successfully.`,
      });
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = eventData.images.filter((_, i) => i !== index);
    setEventData(prev => ({ ...prev, images: updatedImages }));
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Event Photos</h1>
        </div>

        <p className="text-muted-foreground">
          Upload photos to showcase your event. Adding multiple images will help attract more attendees.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {eventData.images.map((img, index) => (
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

          <div className="pt-4">
            <Button 
              onClick={handleNext} 
              className="w-full"
              disabled={uploading}
            >
              Continue to Review
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventPhotosStep;
