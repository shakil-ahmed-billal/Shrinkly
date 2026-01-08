import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Link2, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = ({ handleSignOut }: any) => {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={"/"}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Link2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Shrinkly</span>
        </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          {user ? (
            <Button variant="ghost" className="bg-red-500 hover:bg-red-400" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="glow">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
