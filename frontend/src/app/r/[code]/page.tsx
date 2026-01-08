"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const code = params?.code as string;

  useEffect(() => {
    const redirect = async () => {
      if (!code) {
        router.push("/");
        return;
      }

      try {
        // Get the original URL from backend
        const response = await axiosPublic.get(`/api/redirect/${code}`);

        if (response.data?.success && response.data?.data?.originalUrl) {
          // Increment clicks and redirect
          window.location.href = response.data.data.originalUrl;
        } else {
          router.push("/");
        }
      } catch (error: any) {
        console.error("Redirect error:", error);
        // If error, redirect to home
        router.push("/");
      }
    };

    redirect();
  }, [code, router, axiosPublic]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

