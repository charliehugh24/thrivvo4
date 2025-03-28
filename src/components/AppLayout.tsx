
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, SearchIcon, BellIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeTab = 'discover',
  onTabChange = () => {} 
}) => {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="w-8 h-8">
            <img 
              src="/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png" 
              alt="Thrivvo Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h1 className="text-xl font-bold text-thrivvo-orange absolute left-1/2 transform -translate-x-1/2">
            Thrivvo
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-1">beta</span>
          </h1>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center text-sm text-muted-foreground gap-1 bg-muted px-2 py-1 rounded-full">
              <MapPin size={14} />
              <span>2mi</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
      <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm border-t p-3">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full bg-muted/50">
            <TabsTrigger value="discover" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
              <Link to="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shuffle"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
              <Link to="/search">
                <SearchIcon size={20} />
              </Link>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
              <Link to="/notifications">
                <BellIcon size={20} />
              </Link>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
              <Link to="/profile">
                <UserIcon size={20} />
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};

export default AppLayout;
