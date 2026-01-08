"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { Link2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const urlSchema = z.string().url({ message: "Please enter a valid URL" });

interface UrlShortenerProps {
  onUrlCreated: () => void;
  urlCount: number;
  maxUrls: number;
}

function generateShortCode() {
  // Generate random length between 6-8 characters
  const length = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export default function UrlShortener({
  onUrlCreated,
  urlCount,
  maxUrls,
}: UrlShortenerProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const axiosPublic = useAxiosPublic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (urlCount >= maxUrls) return;

    let validatedUrl = url.trim();
    if (!validatedUrl.startsWith("http")) {
      validatedUrl = `https://${validatedUrl}`;
    }

    const result = urlSchema.safeParse(validatedUrl);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      // Check if limit reached
      if (urlCount >= maxUrls) {
        toast({
          variant: "destructive",
          title: "Limit Reached",
          description: `You've reached the maximum of ${maxUrls} URLs. Please upgrade to create more.`,
        });
        return;
      }

      const shortCode = generateShortCode(); // Generate 6-8 character code
      const payload = {
        originalUrl: validatedUrl,
        shortCode: shortCode,
      };

      const res = await axiosPublic.post("/api/v1/shorten", payload);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "URL shortening failed");
      }

      toast({
        title: "URL shortened!",
        description: "Your link is ready to share 🎉",
      });

      setUrl("");
      onUrlCreated();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to shorten URL";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const isLimitReached = urlCount >= maxUrls;

  return (
    <div className="glass-strong rounded-2xl p-6">
      {isLimitReached && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm font-medium">
              You've reached the limit of {maxUrls} URLs. Upgrade to create
              more!
            </p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL..."
            className="pl-10"
            disabled={isLimitReached}
          />
        </div>
        <Button disabled={loading || !url || isLimitReached}>
          {loading ? <Loader2 className="animate-spin" /> : "Shorten"}
        </Button>
      </form>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
