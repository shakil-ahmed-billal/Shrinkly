import { useState } from 'react';
import { Copy, Trash2, ExternalLink, Check, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { format } from 'date-fns';

interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  clicks: number;
  created_at: string;
}

interface UrlTableProps {
  urls: ShortenedUrl[];
  onUrlDeleted: () => void;
}

export default function UrlTable({ urls, onUrlDeleted }: UrlTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const axiosPublic = useAxiosPublic();

  const baseUrl = window.location.origin;

  const copyToClipboard = async (shortCode: string, id: string) => {
    const fullUrl = `${baseUrl}/r/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard',
    });
  };

  const handleDelete = async (code: string) => {
    setDeletingId(code);
    try {
      const response = await axiosPublic.delete(`/api/short-urls/${code}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete URL');
      }

      toast({
        title: 'Deleted',
        description: 'URL has been removed',
      });

      onUrlDeleted();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete URL';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (urls.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <MousePointerClick className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No URLs yet</h3>
        <p className="text-muted-foreground">
          Create your first shortened URL to get started
        </p>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Your Links</h2>
        <p className="text-sm text-muted-foreground">{urls.length} total URLs</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Original URL</TableHead>
              <TableHead className="text-muted-foreground">Short Link</TableHead>
              <TableHead className="text-muted-foreground text-center">Clicks</TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url, index) => (
              <TableRow 
                key={url.id} 
                className="border-border hover:bg-secondary/30 transition-colors"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell className="max-w-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={url.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="truncate">{truncateUrl(url.original_url)}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-md">
                      <p className="break-all">{url.original_url}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-secondary text-primary text-sm font-mono">
                      {url.short_code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(url.short_code, url.id)}
                    >
                      {copiedId === url.id ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-sm font-medium">
                    <MousePointerClick className="w-3 h-3" />
                    {url.clicks.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(url.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={deletingId === url.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-strong border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this link?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the shortened URL. Anyone with the link will no longer be able to access it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(url.short_code)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
