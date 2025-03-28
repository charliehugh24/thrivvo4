
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-thrivvo-purple to-thrivvo-teal text-transparent bg-clip-text">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! This page doesn't exist</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for might have been removed, renamed, or never existed in the first place.
        </p>
        <Button asChild className="bg-thrivvo-purple hover:bg-thrivvo-deep-purple">
          <a href="/">Return to Thrivvo</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
