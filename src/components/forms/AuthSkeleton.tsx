"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      {/* Header */}
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-32 mx-auto" /> {/* Title */}
        <Skeleton className="h-4 w-48 mx-auto" /> {/* Subtitle */}
      </CardHeader>

      {/* Form Fields */}
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Forgot password / link */}
        <Skeleton className="h-4 w-40 mx-auto" /> {/* Sign up / Sign in link */}
      </CardFooter>
    </Card>
  );
}
