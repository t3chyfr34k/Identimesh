import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import { Search, ArrowRight } from "lucide-react";
import { listSearchResults, type SearchListItem } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";

export default function History() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [platform, setPlatform] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [confidenceRange, setConfidenceRange] = useState("");
  const [items, setItems] = useState<SearchListItem[]>([]);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await listSearchResults()
        if (mounted) setItems(res.data)
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!socket) return
    const handler = () => listSearchResults().then((r) => setItems(r.data)).catch(() => {})
    socket.on('search-result:created', handler)
    return () => { socket.off('search-result:created', handler) }
  }, [socket])

  const filteredEntries = useMemo(() => {
    return items.filter(it => {
      const username = it.sourceProfile?.username || ''
      const platformName = it.sourceProfile?.platform || ''
      const dateStr = it.searchDate || it.createdAt || ''
      const top = it.matches?.[0]
      const confidence = Math.round(top?.confidence || 0)

      if (searchTerm && !username.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (platform && platform !== 'all' && platformName.toLowerCase() !== platform.toLowerCase()) return false

      if (dateRange) {
        const now = new Date()
        const entryDate = dateStr ? new Date(dateStr) : new Date(0)
        const diff = now.getTime() - entryDate.getTime()
        if (dateRange === 'week' && diff > 7 * 24 * 60 * 60 * 1000) return false
        if (dateRange === 'month' && diff > 30 * 24 * 60 * 60 * 1000) return false
      }

      if (confidenceRange) {
        if (confidenceRange === 'high' && confidence < 80) return false
        if (confidenceRange === 'medium' && (confidence < 60 || confidence >= 80)) return false
        if (confidenceRange === 'low' && confidence >= 60) return false
      }

      return true
    })
  }, [items, searchTerm, platform, dateRange, confidenceRange])

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Match History</h1>
          <p className="text-muted-foreground mt-1">View and manage your previous identity matches</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Searches</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      placeholder="Search by username"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                      icon={<Search className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger id="date">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={confidenceRange} onValueChange={setConfidenceRange}>
                      <SelectTrigger id="confidence">
                        <SelectValue placeholder="Confidence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Scores</SelectItem>
                        <SelectItem value="high">High (80%+)</SelectItem>
                        <SelectItem value="medium">Medium (60-79%)</SelectItem>
                        <SelectItem value="low">Low (Below 60%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches found with the current filters</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setPlatform("");
                      setDateRange("");
                      setConfidenceRange("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEntries.map((entry) => (
                    <Card key={entry._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                          <div className="space-y-1 mb-2 sm:mb-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">@{entry.sourceProfile?.username || entry.searchTerm || entry._id}</h3>
                              <span className="text-xs bg-muted py-1 px-2 rounded-full">
                                {entry.sourceProfile?.platform || '—'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Searched on {new Date(entry.searchDate || entry.createdAt || '').toLocaleDateString()} · {(entry.totalMatches ?? entry.matches?.length ?? 0)} matches found
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(entry.matches?.[0]?.status as any)}
                              <span className={`text-sm font-medium ${
                                (entry.matches?.[0]?.confidence || 0) >= 80 ? 'text-green-500' : 
                                (entry.matches?.[0]?.confidence || 0) >= 60 ? 'text-amber-500' : 
                                'text-muted-foreground'
                              }`}>
                                {Math.round(entry.matches?.[0]?.confidence || 0)}% confidence
                              </span>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-auto"
                              onClick={() => navigate(`/results/${entry._id}`)}
                            >
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="confirmed" className="space-y-4">
            {filteredEntries
              .filter(entry => (entry.matches?.[0]?.status as any) === "confirmed")
              .map(entry => (
                <Card key={entry._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">@{entry.sourceProfile?.username || entry.searchTerm || entry._id}</h3>
                          <span className="text-xs bg-muted py-1 px-2 rounded-full">
                            {entry.sourceProfile?.platform || '—'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Searched on {new Date(entry.searchDate || entry.createdAt || '').toLocaleDateString()} · {(entry.totalMatches ?? entry.matches?.length ?? 0)} matches found
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">Confirmed</Badge>
                          <span className="text-sm font-medium text-green-500">
                            {Math.round(entry.matches?.[0]?.confidence || 0)}% confidence
                          </span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => navigate(`/results/${entry._id}`)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {filteredEntries
              .filter(entry => (entry.matches?.[0]?.status as any) === "pending")
              .map(entry => (
                <Card key={entry._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">@{entry.sourceProfile?.username || entry.searchTerm || entry._id}</h3>
                          <span className="text-xs bg-muted py-1 px-2 rounded-full">
                            {entry.sourceProfile?.platform || '—'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Searched on {new Date(entry.searchDate || entry.createdAt || '').toLocaleDateString()} · {(entry.totalMatches ?? entry.matches?.length ?? 0)} matches found
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pending</Badge>
                          <span className="text-sm font-medium text-amber-500">
                            {Math.round(entry.matches?.[0]?.confidence || 0)}% confidence
                          </span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => navigate(`/results/${entry._id}`)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="flagged" className="space-y-4">
            {filteredEntries
              .filter(entry => (entry.matches?.[0]?.status as any) === "flagged")
              .map(entry => (
                <Card key={entry._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">@{entry.sourceProfile?.username || entry.searchTerm || entry._id}</h3>
                          <span className="text-xs bg-muted py-1 px-2 rounded-full">
                            {entry.sourceProfile?.platform || '—'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Searched on {new Date(entry.searchDate || entry.createdAt || '').toLocaleDateString()} · {(entry.totalMatches ?? entry.matches?.length ?? 0)} matches found
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Flagged</Badge>
                          <span className="text-sm font-medium text-muted-foreground">
                            {Math.round(entry.matches?.[0]?.confidence || 0)}% confidence
                          </span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => navigate(`/results/${entry._id}`)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
