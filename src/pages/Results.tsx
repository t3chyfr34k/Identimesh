
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import { CheckCircle2, XCircle, ArrowRight, ThumbsUp, ThumbsDown, Save, RefreshCw, Link as LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Mock data for the profile - in real app this would come from MongoDB
const generateMatchData = (username: string, platform: string) => {
  // Generate potential matches based on the input
  const matches = [
    {
      id: "1",
      username: username.replace(/[._-]/g, '') + (Math.random() > 0.5 ? "123" : ""),
      platform: platform === "twitter" ? "instagram" : "twitter",
      profilePic: `https://i.pravatar.cc/150?u=${Math.random()}`,
      bio: "Digital enthusiast and tech lover. Photography, travel, and good coffee.",
      location: "San Francisco, CA",
      joinDate: "2019-03-15",
      posts: 342,
      followers: 1248,
      confidence: Math.floor(85 + Math.random() * 10),
      matchPoints: {
        username: Math.random() > 0.3,
        bio: Math.random() > 0.5,
        location: Math.random() > 0.6,
        joinDate: Math.random() > 0.7,
        postingPattern: Math.random() > 0.4,
      }
    },
    {
      id: "2",
      username: username + (Math.random() > 0.5 ? ".official" : "_real"),
      platform: platform === "instagram" ? "tiktok" : "instagram",
      profilePic: `https://i.pravatar.cc/150?u=${Math.random()}`,
      bio: "Creating content about tech and lifestyle. DMs open for collabs.",
      location: "New York, NY",
      joinDate: "2020-05-22",
      posts: 189,
      followers: 867,
      confidence: Math.floor(70 + Math.random() * 15),
      matchPoints: {
        username: Math.random() > 0.4,
        bio: Math.random() > 0.6,
        location: Math.random() > 0.7,
        joinDate: Math.random() > 0.8,
        postingPattern: Math.random() > 0.5,
      }
    },
    {
      id: "3",
      username: username.slice(0, 5) + "_" + Math.random().toString(36).substring(2, 5),
      platform: platform === "facebook" ? "linkedin" : "facebook",
      profilePic: `https://i.pravatar.cc/150?u=${Math.random()}`,
      bio: "Always learning, always growing. Tech enthusiast and avid reader.",
      location: "Austin, TX",
      joinDate: "2021-01-10",
      posts: 97,
      followers: 524,
      confidence: Math.floor(60 + Math.random() * 15),
      matchPoints: {
        username: Math.random() > 0.5,
        bio: Math.random() > 0.7,
        location: Math.random() > 0.8,
        joinDate: Math.random() > 0.9,
        postingPattern: Math.random() > 0.6,
      }
    }
  ];
  
  return {
    sourceProfile: {
      username,
      platform,
      profilePic: `https://i.pravatar.cc/150?u=${username}`,
      bio: "Technology enthusiast | Developer | Coffee lover",
      location: "San Francisco, CA",
      joinDate: "2018-07-20",
      posts: 415,
      followers: 2340
    },
    matches
  };
};

export default function Results() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<any>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [liveUpdateCount, setLiveUpdateCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get data from navigation state or generate mock data
      const username = location.state?.username || "techuser42";
      const platform = location.state?.platform || "twitter";
      
      const data = generateMatchData(username, platform);
      setMatchData(data);
      
      // Select first match by default
      if (data.matches.length > 0) {
        setSelectedMatch(data.matches[0].id);
      }
      
      setLoading(false);
    };
    
    fetchData();

    // This would be a WebSocket connection in a real app
    let liveUpdateInterval: number | null = null;
    
    if (isLiveTracking) {
      liveUpdateInterval = window.setInterval(() => {
        setLiveUpdateCount(prev => prev + 1);
        toast.info("Scanning for new connections...", {
          description: `Live update #${liveUpdateCount + 1}`
        });
      }, 15000) as unknown as number;
    }

    return () => {
      if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
      }
    };
  }, [id, location.state, isLiveTracking, liveUpdateCount]);

  const handleConfirmMatch = (matchId: string) => {
    toast.success("Match confirmed and added to your database", {
      description: "We've linked these identities in your account"
    });
    // In a real app, this would update MongoDB
  };

  const handleReportIncorrect = (matchId: string) => {
    toast.success("Match reported as incorrect", {
      description: "We'll improve our algorithms based on your feedback"
    });
    // In a real app, this would update MongoDB
  };

  const handleSaveMatch = (matchId: string) => {
    toast.success("Match saved to your history", {
      description: "You can access this match anytime from your history"
    });
    // In a real app, this would update MongoDB
  };

  const toggleLiveTracking = () => {
    setIsLiveTracking(prev => !prev);
    if (!isLiveTracking) {
      toast.success("Live tracking enabled", {
        description: "We'll continuously scan for new connections"
      });
    } else {
      toast.info("Live tracking disabled");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 w-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!matchData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No results found</h2>
          <p className="text-muted-foreground mt-2">Please try another search</p>
          <Button className="mt-6" onClick={() => navigate("/search")}>
            Find Someone Else to Stalk
          </Button>
        </div>
      </AppLayout>
    );
  }

  const currentMatch = matchData.matches.find((m: any) => m.id === selectedMatch);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Digital Doppelgängers Found</h1>
              <p className="text-muted-foreground mt-1">
                Found {matchData.matches.length} potential identities for @{matchData.sourceProfile.username}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={toggleLiveTracking}
                className={isLiveTracking ? "border-primary text-primary" : ""}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLiveTracking ? "animate-spin" : ""}`} />
                {isLiveTracking ? "Hunting Live..." : "Hunt in Real-Time"}
              </Button>
              <Button onClick={() => navigate("/search")}>
                New Digital Detective Mission
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  Source Profile
                  <span className="bg-muted text-xs py-1 px-2 rounded-full">
                    {matchData.sourceProfile.platform.charAt(0).toUpperCase() + matchData.sourceProfile.platform.slice(1)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted overflow-hidden border-2 border-primary">
                    <img 
                      src={matchData.sourceProfile.profilePic}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">@{matchData.sourceProfile.username}</h3>
                    <p className="text-sm text-muted-foreground">{matchData.sourceProfile.location}</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground">{matchData.sourceProfile.bio}</p>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="hover:bg-muted/30 p-2 rounded-md transition-all duration-300">
                      <p className="font-medium">{matchData.sourceProfile.posts}</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div className="hover:bg-muted/30 p-2 rounded-md transition-all duration-300">
                      <p className="font-medium">{matchData.sourceProfile.followers}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="hover:bg-muted/30 p-2 rounded-md transition-all duration-300">
                      <p className="font-medium">{new Date(matchData.sourceProfile.joinDate).getFullYear()}</p>
                      <p className="text-xs text-muted-foreground">Joined</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Digital Fingerprints Found</h3>
              
              <div className="space-y-3">
                {matchData.matches.map((match: any) => (
                  <Card 
                    key={match.id}
                    className={`cursor-pointer transition-all duration-300 ${selectedMatch === match.id ? 'border-primary shadow-md' : 'border-border/50 hover:border-border hover:shadow'}`}
                    onClick={() => setSelectedMatch(match.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                          <img 
                            src={match.profilePic}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">@{match.username}</h4>
                              <p className="text-xs text-muted-foreground">
                                {match.platform.charAt(0).toUpperCase() + match.platform.slice(1)}
                              </p>
                            </div>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <div className={`text-sm font-medium cursor-help ${match.confidence >= 85 ? 'text-green-500' : match.confidence >= 70 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                  {match.confidence}%
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">Confidence Score Explanation</h4>
                                  <p className="text-xs text-muted-foreground">Our algorithm analyzes pattern matching across multiple data points:</p>
                                  <ul className="text-xs space-y-1">
                                    <li>• Username similarity: {match.matchPoints.username ? 'High' : 'Low'}</li>
                                    <li>• Bio content matching: {match.matchPoints.bio ? 'High' : 'Low'}</li>
                                    <li>• Location data: {match.matchPoints.location ? 'Match' : 'No match'}</li>
                                    <li>• Account creation timing: {match.matchPoints.joinDate ? 'Suspicious correlation' : 'Different timeframes'}</li>
                                  </ul>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress value={match.confidence} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {currentMatch ? (
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Identity Match Analysis</CardTitle>
                  <CardDescription>
                    Compare digital fingerprints and view confidence breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                            <img 
                              src={matchData.sourceProfile.profilePic}
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Source Identity</p>
                            <h4 className="font-medium">@{matchData.sourceProfile.username}</h4>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{matchData.sourceProfile.bio}</p>
                        <p className="text-sm mt-2">{matchData.sourceProfile.location}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Joined {new Date(matchData.sourceProfile.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="relative flex-1 p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-all duration-300">
                        <LinkIcon className="absolute top-2 right-2 text-primary/30" size={20} />
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                            <img 
                              src={currentMatch.profilePic}
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Potential alias</p>
                            <h4 className="font-medium">@{currentMatch.username}</h4>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{currentMatch.bio}</p>
                        <p className="text-sm mt-2">{currentMatch.location}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Joined {new Date(currentMatch.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold mb-4">Digital Fingerprint Analysis</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            {currentMatch.matchPoints.username ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span>Username pattern match</span>
                          </div>
                          <span className="text-sm font-medium">
                            {currentMatch.matchPoints.username ? 'High correlation' : 'Low correlation'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            {currentMatch.matchPoints.bio ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span>Bio content analysis</span>
                          </div>
                          <span className="text-sm font-medium">
                            {currentMatch.matchPoints.bio ? 'Linguistic match' : 'Different writing style'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            {currentMatch.matchPoints.location ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span>Geolocation data</span>
                          </div>
                          <span className="text-sm font-medium">
                            {currentMatch.matchPoints.location ? 'Same region' : 'Different regions'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            {currentMatch.matchPoints.joinDate ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span>Account creation timeline</span>
                          </div>
                          <span className="text-sm font-medium">
                            {currentMatch.matchPoints.joinDate ? 'Suspicious pattern' : 'No correlation'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            {currentMatch.matchPoints.postingPattern ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span>Posting behavior analysis</span>
                          </div>
                          <span className="text-sm font-medium">
                            {currentMatch.matchPoints.postingPattern ? 'Similar patterns' : 'Different habits'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Digital identity match confidence</span>
                          <span className={`text-lg font-bold ${currentMatch.confidence >= 85 ? 'text-green-500' : currentMatch.confidence >= 70 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {currentMatch.confidence}%
                          </span>
                        </div>
                        <Progress value={currentMatch.confidence} className="h-2 mt-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" onClick={() => handleReportIncorrect(currentMatch.id)}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Totally Wrong Match
                  </Button>
                  <Button variant="outline" onClick={() => handleSaveMatch(currentMatch.id)}>
                    <Save className="mr-2 h-4 w-4" />
                    File for Later
                  </Button>
                  <Button onClick={() => handleConfirmMatch(currentMatch.id)}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Confirm It's Them
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a match to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
