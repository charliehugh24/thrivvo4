
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, BellIcon, UserIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import DirectMessages from './DirectMessages';

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
          <div className="w-8 h-8 invisible">
            {/* Placeholder for spacing */}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/8772df01-f105-4eae-aa70-173c7563a131.png" 
                    alt="Location Pin" 
                    className="h-7 w-7"
                  />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-30%] text-xs font-medium text-white">
                    2mi
                  </span>
                </div>
              </div>
            </div>
            <DirectMessages />
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
      <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm border-t p-3">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="w-full bg-muted/50">
              <TabsTrigger value="discover" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
                <Link to="/">
                  <SearchIcon size={20} />
                </Link>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
                <Link to="/search">
                  <SearchIcon size={20} />
                </Link>
              </TabsTrigger>
              <TabsTrigger value="add" className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white" asChild>
                <Link to="/add-event">
                  <PlusIcon size={20} />
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
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
