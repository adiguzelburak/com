import { type RFMCustomer, getSegmentLabel, getSegmentColor } from "@/lib/rfm-utils";
import { cn } from "@/lib/utils";

interface RFMGridProps {
    groupedCustomers: Map<string, RFMCustomer[]>;
    selectedCell: string | null;
    onCellClick: (cellKey: string) => void;
}

export function RFMGrid({
    groupedCustomers,
    selectedCell,
    onCellClick,
}: RFMGridProps) {
    // Y-axis labels (Monetary Score) from 5 to 1 (top to bottom)
    const yLabels = [5, 4, 3, 2, 1];
    // X-axis labels (Frequency Score) from 1 to 5 (left to right)
    const xLabels = [1, 2, 3, 4, 5];

    return (
        <div className="w-full">
            <div className="flex">
                {/* Y-axis label */}
                <div className="flex flex-col justify-center items-center pr-3 w-12">
                    <span className="text-sm font-medium text-muted-foreground -rotate-90 whitespace-nowrap">
                        Monetary Score
                    </span>
                </div>

                <div className="flex-1">
                    {/* Grid */}
                    <div className="flex flex-col gap-2">
                        {yLabels.map((y) => (
                            <div key={y} className="flex gap-2 items-center">
                                {/* Y-axis value */}
                                <div className="w-6 text-center text-sm font-medium text-muted-foreground">
                                    {y}
                                </div>

                                {/* Grid cells */}
                                {xLabels.map((x) => {
                                    const cellKey = `${x}-${y}`;
                                    const customers = groupedCustomers.get(cellKey) || [];
                                    const isSelected = selectedCell === cellKey;
                                    const segmentLabel = getSegmentLabel(x, y);
                                    const colorClass = getSegmentColor(x, y);

                                    return (
                                        <button
                                            key={cellKey}
                                            onClick={() => onCellClick(cellKey)}
                                            className={cn(
                                                "flex-1 min-h-[80px] rounded-lg border-2 transition-all duration-200",
                                                "flex flex-col items-center justify-center p-2",
                                                "hover:scale-105 hover:shadow-lg",
                                                colorClass,
                                                isSelected && "ring-2 ring-primary ring-offset-2 scale-105 shadow-lg"
                                            )}
                                        >
                                            <span className="text-2xl font-bold">{customers.length}</span>
                                            <span className="text-xs text-center leading-tight mt-1 opacity-80">
                                                {segmentLabel}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}

                        {/* X-axis labels */}
                        <div className="flex gap-2 mt-2">
                            <div className="w-6" /> {/* Spacer for Y-axis */}
                            {xLabels.map((x) => (
                                <div
                                    key={x}
                                    className="flex-1 text-center text-sm font-medium text-muted-foreground"
                                >
                                    {x}
                                </div>
                            ))}
                        </div>

                        {/* X-axis label */}
                        <div className="text-center text-sm font-medium text-muted-foreground mt-1">
                            Frequency Score
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
