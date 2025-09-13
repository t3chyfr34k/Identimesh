import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, LineChart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import { listSearchResults, type SearchListItem } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [items, setItems] = useState<SearchListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await listSearchResults()
        if (mounted) setItems(res.data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!socket) return
    const handler = () => {
      listSearchResults().then((res) => setItems(res.data)).catch(() => {})
    }
    socket.on('search-result:created', handler)
    return () => { socket.off('search-result:created', handler) }
  }, [socket])

  const totals = useMemo(() => {
    const total = items.length
    let confirmed = 0
    let avgConfidence = 0
    items.forEach((it) => {
      const top = it.matches?.[0]
      if (top?.status === 'confirmed') confirmed += 1
      if (top?.confidence) avgConfidence += top.confidence
    })
    avgConfidence = items.length ? Math.round(avgConfidence / items.length) : 0
    return { total, confirmed, avgConfidence }
  }, [items])

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your identity matches</p>
          </div>
          <Button size="lg" className="gap-2" onClick={() => navigate("/search")}>
            <SearchIcon className="h-4 w-4" />
            Start New Match Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Profile Searches</span>
                <SearchIcon className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>Total profiles you've searched</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totals.total}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Confirmed Matches</span>
                <LineChart className="h-5 w-5 text-secondary" />
              </CardTitle>
              <CardDescription>Matches you've verified</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totals.confirmed}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Confidence Score</CardTitle>
              <CardDescription>Average match confidence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{totals.avgConfidence}%</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.slice(0, 6).map((search) => (
              <Card key={search._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">@{search.sourceProfile?.username || search.searchTerm || search._id}</CardTitle>
                    <span className="text-xs bg-muted py-1 px-2 rounded-full">{search.sourceProfile?.platform || '—'}</span>
                  </div>
                  <CardDescription>
                    Searched on {new Date(search.searchDate || search.createdAt || '').toLocaleDateString()} · {search.totalMatches ?? search.matches?.length ?? 0} matches
                  </CardDescription>
                </CardHeader>
                {search.matches?.length ? (
                  <CardContent className="bg-muted/30 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Top Match: @{search.matches[0]?.username || '—'}</p>
                        <p className="text-xs text-muted-foreground">{search.matches[0]?.platform || '—'}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${search.matches[0]?.confidence > 90 ? 'text-green-500' : 'text-amber-500'}`}>
                          {Math.round(search.matches[0]?.confidence || 0)}% match
                        </span>
                      </div>
                    </div>
                  </CardContent>
                ) : null}
                <CardFooter className="pt-3 pb-4">
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate(`/results/${search._id}`)}>
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => navigate("/history")}>View All History</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
