import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, BellIcon, UserIcon, PlusIcon, CrownIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import DirectMessages from './DirectMessages';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-2 md:p-4">
          <div>
            <Link to="/">
              <img 
                src="/lovable-uploads/130ab7bf-f6ad-4a28-8c87-4a266c70a707.png" 
                alt="THRIVVO Logo" 
                className="h-6 md:h-8 cursor-pointer" 
              />
            </Link>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/subscription">
              <Button 
                variant="ghost" 
                size={isMobile ? "sm" : "default"} 
                className="text-thrivvo-teal flex items-center gap-1 font-medium text-xs md:text-sm py-1 px-2 md:py-2 md:px-3"
              >
                <CrownIcon size={isMobile ? 12 : 14} />
                {isMobile ? "+" : "Thrivvo+"}
              </Button>
            </Link>
            <DirectMessages />
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
      <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm border-t p-2 md:p-3">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="w-full bg-muted/50 h-12 md:h-14 p-1">
              <TabsTrigger 
                value="discover" 
                className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white h-10 md:h-12" 
                asChild
              >
                <Link to="/">
                  <img 
                    src="/lovable-uploads/1493954c-3788-441f-9e0a-bab1dd94c24b.png" 
                    alt="Discover" 
                    className="h-5 w-5 md:h-6 md:w-6" 
                  />
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white h-10 md:h-12" 
                asChild
              >
                <Link to="/search">
                  <SearchIcon size={isMobile ? 18 : 20} />
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white h-10 md:h-12" 
                asChild
              >
                <Link to="/add-event">
                  <PlusIcon size={isMobile ? 18 : 20} />
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white h-10 md:h-12" 
                asChild
              >
                <Link to="/notifications">
                  <BellIcon size={isMobile ? 18 : 20} />
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex-1 data-[state=active]:bg-thrivvo-teal data-[state=active]:text-white h-10 md:h-12" 
                asChild
              >
                <Link to="/profile">
                  <UserIcon size={isMobile ? 18 : 20} />
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
