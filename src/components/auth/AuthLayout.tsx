
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IdentiMesh
          </h1>
          <p className="text-muted-foreground mt-2">
            Cross-platform identity matching
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
