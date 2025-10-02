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
        <CardTitle>Anúncios com Melhor Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anúncio</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead className="text-right">Impressões</TableHead>
              <TableHead className="text-right">Cliques</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Gasto</TableHead>
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
                <TableCell className="text-right">{ad.impressions.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">{ad.clicks}</TableCell>
                <TableCell className="text-right">{ad.ctr.toFixed(2)}%</TableCell>
                <TableCell className="text-right">R$ {ad.spend.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
