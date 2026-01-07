import { useState } from 'react';
import { Link2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const urlSchema = z.string().url({ message: 'Please enter a valid URL' });

interface UrlShortenerProps {
  onUrlCreated: () => void;
  urlCount: number;
  maxUrls: number;
}

function generateShortCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function UrlShortener({ onUrlCreated, urlCount, maxUrls }: UrlShortenerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (urlCount >= maxUrls) {
      toast({
        variant: 'destructive',
        title: 'Limit reached',
        description: `You've reached your limit of ${maxUrls} URLs. Upgrade to create more!`,
      });
      return;
    }

    // Validate URL
    let validatedUrl = url.trim();
    if (!validatedUrl.startsWith('http://') && !validatedUrl.startsWith('https://')) {
      validatedUrl = 'https://' + validatedUrl;
    }

    const result = urlSchema.safeParse(validatedUrl);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    // try {
    //   // Generate unique short code
    //   let shortCode = generateShortCode(6);
    //   let attempts = 0;
    //   const maxAttempts = 5;

    //   while (attempts < maxAttempts) {
    //     const { data: existing } = await supabase
    //       .from('shortened_urls')
    //       .select('id')
    //       .eq('short_code', shortCode)
    //       .maybeSingle();

    //     if (!existing) break;
    //     shortCode = generateShortCode(7);
    //     attempts++;
    //   }

    //   // Insert the URL
    //   const { error: insertError } = await supabase
    //     .from('shortened_urls')
    //     .insert({
    //       user_id: user?.id,
    //       original_url: validatedUrl,
    //       short_code: shortCode,
    //     });

    //   if (insertError) throw insertError;

    //   // Update user's URL count
    //   await supabase
    //     .from('profiles')
    //     .update({ url_count: urlCount + 1 })
    //     .eq('id', user?.id);

    //   toast({
    //     title: 'URL shortened!',
    //     description: 'Your link is ready to share.',
    //   });

    //   setUrl('');
    //   onUrlCreated();
    // } catch (err: any) {
    //   toast({
    //     variant: 'destructive',
    //     title: 'Error',
    //     description: err.message || 'Failed to shorten URL',
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  const limitReached = urlCount >= maxUrls;

  return (
    <div className="glass-strong rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Shorten a URL</h2>
          <p className="text-sm text-muted-foreground">
            {urlCount} / {maxUrls} URLs used
          </p>
        </div>
      </div>

      {limitReached && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive font-medium">
            You've reached your limit of {maxUrls} URLs. Upgrade to Pro for unlimited links!
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Upgrade to Pro
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10"
            disabled={limitReached}
          />
        </div>
        <Button
          type="submit"
          variant="glow"
          disabled={loading || !url.trim() || limitReached}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Shorten'
          )}
        </Button>
      </form>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
