import { useMemo } from "react";
import { TrendingUp, Eye, MousePointer, DollarSign, Target, Users } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { PlatformComparison } from "@/components/dashboard/PlatformComparison";
import { TopPerformingAds } from "@/components/dashboard/TopPerformingAds";
import { rawCampaignData } from "@/data/campaignData";

const Index = () => {
  const metrics = useMemo(() => {
    const totalSpend = rawCampaignData.reduce((sum, item) => sum + item.amountSpent, 0);
    const totalReach = rawCampaignData.reduce((sum, item) => sum + item.reach, 0);
    const totalImpressions = rawCampaignData.reduce((sum, item) => sum + item.impressions, 0);
    const totalClicks = rawCampaignData.reduce((sum, item) => sum + item.linkClicks, 0);
    const totalConversations = rawCampaignData.reduce((sum, item) => sum + item.results, 0);
    const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return { totalSpend, totalReach, totalImpressions, totalClicks, totalConversations, avgCTR };
  }, []);

  const dailyPerformance = useMemo(() => {
    const grouped = rawCampaignData.reduce((acc: any, item) => {
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
  }, []);

  const platformData = useMemo(() => {
    const grouped = rawCampaignData.reduce((acc: any, item) => {
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
  }, []);

  const topAds = useMemo(() => {
    const adPerformance = rawCampaignData.reduce((acc: any, item) => {
      const key = `${item.adName}-${item.platform}`;
      if (!acc[key]) {
        acc[key] = {
          adName: item.adName,
          platform: item.platform,
          impressions: 0,
          clicks: 0,
          spend: 0,
          ctr: 0
        };
      }
      acc[key].impressions += item.impressions;
      acc[key].clicks += item.linkClicks;
      acc[key].spend += item.amountSpent;
      return acc;
    }, {});

    return Object.values(adPerformance)
      .map((ad: any) => ({
        ...ad,
        ctr: ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0
      }))
      .sort((a: any, b: any) => b.impressions - a.impressions)
      .slice(0, 5);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Dashboard - VOCÊ+ MAGRA
          </h1>
          <p className="text-muted-foreground">Análise de performance da campanha</p>
        </div>

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
