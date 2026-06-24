import { Card, CardContent } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";

export function StatCard({
  label,
  value,
  currency
}: {
  label: string;
  value: number;
  currency?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold">{currency ? formatNaira(value) : value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
