import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TopPerformingAdsProps {
  data: any[];
}

export function TopPerformingAds({ data }: TopPerformingAdsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Detalhada por Criativo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anúncio</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead className="text-right">Alcance</TableHead>
                <TableHead className="text-right">Impressões</TableHead>
                <TableHead className="text-right">Frequência</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">CTR (%)</TableHead>
                <TableHead className="text-right">Conversas</TableHead>
                <TableHead className="text-right">CPC (R$)</TableHead>
                <TableHead className="text-right">CPM (R$)</TableHead>
                <TableHead className="text-right">Gasto (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((ad, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ad.adName}</TableCell>
                  <TableCell>
                    <Badge variant={ad.platform === 'facebook' ? 'default' : 'secondary'}>
                      {ad.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{ad.reach.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">{ad.impressions.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">{ad.frequency.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{ad.clicks}</TableCell>
                  <TableCell className="text-right">{ad.ctr.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{ad.results}</TableCell>
                  <TableCell className="text-right">R$ {ad.cpc.toFixed(2)}</TableCell>
                  <TableCell className="text-right">R$ {ad.cpm.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">R$ {ad.spend.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
