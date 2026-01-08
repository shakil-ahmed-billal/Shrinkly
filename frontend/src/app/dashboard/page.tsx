"use client"

import { useState, useEffect } from 'react';
import { Link2, LogOut, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UrlShortener from '@/components/UrlShortener';
import UrlTable from '@/components/UrlTable';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Header from '@/components/header/Header';

interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  clicks: number;
  created_at: string;
}

interface Profile {
  url_count: number;
  max_urls: number;
}

export default function Dashboard() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch URL count
      const profileResponse = await axiosPublic.get("/api/short-urls/count");
      if (profileResponse.data?.success) {
        setProfile({
          url_count: profileResponse.data.data.url_count,
          max_urls: profileResponse.data.data.max_urls,
        });
      }

      // Fetch URLs
      const urlsResponse = await axiosPublic.get("/api/short-urls");
      if (urlsResponse.data?.success) {
        setUrls(urlsResponse.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header handleSignOut={handleSignOut}/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{urls.length}</p>
                <p className="text-sm text-muted-foreground">Total Links</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-4 animate-fade-in stagger-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-4 animate-fade-in stagger-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">
                  {profile ? Math.round((profile.url_count / profile.max_urls) * 100) : 0}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {profile?.url_count || 0} / {profile?.max_urls || 100}
                </p>
                <p className="text-sm text-muted-foreground">URLs Used</p>
              </div>
            </div>
          </div>
        </div>

        {/* URL Shortener */}
        <div className="mb-8">
          <UrlShortener
            onUrlCreated={fetchData}
            urlCount={profile?.url_count || 0}
            maxUrls={profile?.max_urls || 100}
          />
        </div>

        {/* URL Table */}
        <UrlTable urls={urls} onUrlDeleted={fetchData} />
      </main>
    </div>
  );
}
