
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, BellIcon, UserIcon, PlusIcon, CrownIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import DirectMessages from './DirectMessages';
import { Button } from './ui/button';

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
  return <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <Link to="/">
              <img 
                src="/lovable-uploads/130ab7bf-f6ad-4a28-8c87-4a266c70a707.png" 
                alt="THRIVVO Logo" 
                className="h-8 cursor-pointer" 
              />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/subscription">
              <Button variant="ghost" size="sm" className="text-thrivvo-teal flex items-center gap-1 font-medium">
                <CrownIcon size={14} />
                Thrivvo+
              </Button>
            </Link>
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
                  <img 
                    src="/lovable-uploads/9a2151c2-f4a9-4478-af2d-a90f4e168678.png" 
                    alt="Discover" 
                    className="h-6 w-6" 
                  />
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
    </div>;
};

export default AppLayout;
