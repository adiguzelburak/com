import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

export interface FilterValues {
    recency: [number, number];
    frequency: [number, number];
    monetary: [number, number];
}

interface RFMFiltersProps {
    filters: FilterValues;
    onFiltersChange: (filters: FilterValues) => void;
    ranges: {
        recency: { min: number; max: number };
        frequency: { min: number; max: number };
        monetary: { min: number; max: number };
    };
}

export function RFMFilters({
    filters,
    onFiltersChange,
    ranges,
}: RFMFiltersProps) {
    const handleReset = () => {
        onFiltersChange({
            recency: [ranges.recency.min, ranges.recency.max],
            frequency: [ranges.frequency.min, ranges.frequency.max],
            monetary: [ranges.monetary.min, ranges.monetary.max],
        });
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Recency Filter */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Recency (days)</label>
                        <span className="text-sm text-muted-foreground">
                            {filters.recency[0]} - {filters.recency[1]}
                        </span>
                    </div>
                    <Slider
                        value={filters.recency}
                        min={ranges.recency.min}
                        max={ranges.recency.max}
                        step={1}
                        onValueChange={(value) =>
                            onFiltersChange({
                                ...filters,
                                recency: value as [number, number],
                            })
                        }
                    />
                </div>

                {/* Frequency Filter */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Frequency (purchases)</label>
                        <span className="text-sm text-muted-foreground">
                            {filters.frequency[0]} - {filters.frequency[1]}
                        </span>
                    </div>
                    <Slider
                        value={filters.frequency}
                        min={ranges.frequency.min}
                        max={ranges.frequency.max}
                        step={1}
                        onValueChange={(value) =>
                            onFiltersChange({
                                ...filters,
                                frequency: value as [number, number],
                            })
                        }
                    />
                </div>

                {/* Monetary Filter */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Monetary ($)</label>
                        <span className="text-sm text-muted-foreground">
                            ${filters.monetary[0].toLocaleString()} - $
                            {filters.monetary[1].toLocaleString()}
                        </span>
                    </div>
                    <Slider
                        value={filters.monetary}
                        min={ranges.monetary.min}
                        max={ranges.monetary.max}
                        step={10}
                        onValueChange={(value) =>
                            onFiltersChange({
                                ...filters,
                                monetary: value as [number, number],
                            })
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
