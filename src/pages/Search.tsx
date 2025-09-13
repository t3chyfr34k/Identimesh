import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search as SearchIcon, Loader2, User, ShieldAlert, Fingerprint } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { apiFetch } from "@/lib/api";

export default function Search() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !platform) {
      toast.error("Missing critical intel, genius", {
        description: "A username and platform would be nice. Just saying."
      });
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/search-results', {
        method: 'POST',
        body: JSON.stringify({
          sourceProfile: { username, platform },
          matches: [],
          searchTerm: username,
          totalMatches: 0,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to create search')
      toast.success('Search created')
      navigate(`/results/${data.id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create search')
    } finally {
      setLoading(false)
    }
  };

  const platforms = [
    { id: "twitter", name: "Twitter" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "tiktok", name: "TikTok" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "github", name: "GitHub" },
    { id: "reddit", name: "Reddit" }
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Digital Identity Search</h1>
          <p className="text-muted-foreground mt-1">Because privacy is so 2010</p>
        </div>

        <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Begin Your Totally Ethical Surveillance</CardTitle>
            <CardDescription>Enter a username and we'll find all their embarrassing internet footprints</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Target Identifier</Label>
                <Input
                  id="username"
                  placeholder="Their username or that sketchy URL you found"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                  required
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Digital Habitat</Label>
                <Select value={platform} onValueChange={setPlatform} required>
                  <SelectTrigger id="platform" className="w-full">
                    <SelectValue placeholder="Where do they hide?" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full group relative overflow-hidden" disabled={loading}>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invading Privacy...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Stalk With Zero Regrets
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <p>We're not legally responsible for your questionable life choices</p>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">How We Invade Privacy With Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Card className="border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex justify-center">
                  <Fingerprint className="h-6 w-6 mb-2 text-primary" />
                </CardTitle>
                <CardTitle className="text-lg">1. Find Your Victim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enter any username and watch as our algorithms violate multiple platform terms of service
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex justify-center">
                  <SearchIcon className="h-6 w-6 mb-2 text-primary" />
                </CardTitle>
                <CardTitle className="text-lg">2. Expose Their Secrets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our definitely-not-illegal scrapers find all those profiles they thought were separate
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex justify-center">
                  <ShieldAlert className="h-6 w-6 mb-2 text-primary" />
                </CardTitle>
                <CardTitle className="text-lg">3. Judge Their Life Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Review our detailed confidence scores on how badly they've failed at maintaining privacy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
