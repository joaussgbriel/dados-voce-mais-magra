import { useMemo, useState } from "react";
import { TrendingUp, Eye, MousePointer, DollarSign, Target, Users, Calendar } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { PlatformComparison } from "@/components/dashboard/PlatformComparison";
import { TopPerformingAds } from "@/components/dashboard/TopPerformingAds";
import { ThemeToggle } from "@/components/ThemeToggle";
import { rawCampaignData } from "@/data/campaignData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Index = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const filteredData = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return rawCampaignData;
    
    return rawCampaignData.filter((item) => {
      const itemDate = new Date(item.date);
      if (dateRange.from && dateRange.to) {
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      } else if (dateRange.from) {
        return itemDate >= dateRange.from;
      } else if (dateRange.to) {
        return itemDate <= dateRange.to;
      }
      return true;
    });
  }, [dateRange]);

  const metrics = useMemo(() => {
    const totalSpend = filteredData.reduce((sum, item) => sum + item.amountSpent, 0);
    const totalReach = filteredData.reduce((sum, item) => sum + item.reach, 0);
    const totalImpressions = filteredData.reduce((sum, item) => sum + item.impressions, 0);
    const totalClicks = filteredData.reduce((sum, item) => sum + item.linkClicks, 0);
    const totalConversations = filteredData.reduce((sum, item) => sum + item.results, 0);
    const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return { totalSpend, totalReach, totalImpressions, totalClicks, totalConversations, avgCTR };
  }, [filteredData]);

  const dailyPerformance = useMemo(() => {
    const grouped = filteredData.reduce((acc: any, item) => {
      const date = new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (!acc[date]) {
        acc[date] = { date, impressions: 0, reach: 0, clicks: 0 };
      }
      acc[date].impressions += item.impressions;
      acc[date].reach += item.reach;
      acc[date].clicks += item.linkClicks;
      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) => {
      const [dayA, monthA] = a.date.split('/');
      const [dayB, monthB] = b.date.split('/');
      return new Date(2025, parseInt(monthA) - 1, parseInt(dayA)).getTime() - 
             new Date(2025, parseInt(monthB) - 1, parseInt(dayB)).getTime();
    });
  }, [filteredData]);

  const platformData = useMemo(() => {
    const grouped = filteredData.reduce((acc: any, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = { 
          platform: item.platform === 'facebook' ? 'Facebook' : 'Instagram', 
          impressions: 0, 
          clicks: 0, 
          spend: 0 
        };
      }
      acc[item.platform].impressions += item.impressions;
      acc[item.platform].clicks += item.linkClicks;
      acc[item.platform].spend += item.amountSpent;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [filteredData]);

  const topAds = useMemo(() => {
    const adPerformance = filteredData.reduce((acc: any, item) => {
      const key = `${item.adName}-${item.platform}`;
      if (!acc[key]) {
        acc[key] = {
          adName: item.adName,
          platform: item.platform,
          impressions: 0,
          clicks: 0,
          spend: 0,
          reach: 0,
          results: 0,
          frequency: 0,
          cpm: 0,
          cpc: 0,
          ctr: 0,
          count: 0
        };
      }
      acc[key].impressions += item.impressions;
      acc[key].clicks += item.linkClicks;
      acc[key].spend += item.amountSpent;
      acc[key].reach += item.reach;
      acc[key].results += item.results;
      acc[key].frequency += item.frequency;
      acc[key].cpm += item.cpm;
      acc[key].cpc += item.cpc;
      acc[key].ctr += item.ctr;
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.values(adPerformance)
      .map((ad: any) => ({
        ...ad,
        frequency: ad.frequency / ad.count,
        cpm: ad.cpm / ad.count,
        cpc: ad.cpc / ad.count,
        ctr: ad.ctr / ad.count,
      }))
      .sort((a: any, b: any) => b.impressions - a.impressions);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Dashboard - VOCÊ+ MAGRA
            </h1>
            <p className="text-muted-foreground">Análise de performance da campanha</p>
          </div>
          <ThemeToggle />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label>Período</Label>
                <div className="flex gap-2 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {(dateRange.from || dateRange.to) && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Investimento Total"
            value={`R$ ${metrics.totalSpend.toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-chart-3"
          />
          <MetricCard
            title="Alcance Total"
            value={metrics.totalReach.toLocaleString('pt-BR')}
            icon={Users}
            iconColor="text-chart-2"
          />
          <MetricCard
            title="Impressões"
            value={metrics.totalImpressions.toLocaleString('pt-BR')}
            icon={Eye}
            iconColor="text-chart-1"
          />
          <MetricCard
            title="Cliques no Link"
            value={metrics.totalClicks}
            icon={MousePointer}
            iconColor="text-chart-4"
          />
          <MetricCard
            title="CTR Médio"
            value={`${metrics.avgCTR.toFixed(2)}%`}
            icon={TrendingUp}
            iconColor="text-success"
          />
          <MetricCard
            title="Conversas Iniciadas"
            value={metrics.totalConversations}
            icon={Target}
            iconColor="text-primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceChart data={dailyPerformance} title="Performance ao Longo do Tempo" />
          <PlatformComparison data={platformData} />
        </div>

        <TopPerformingAds data={topAds} />
      </div>
    </div>
  );
};

export default Index;
