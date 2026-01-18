import { type RFMCustomer } from "@/lib/rfm-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckSquare, Square, X } from "lucide-react";

interface CustomerListProps {
    customers: RFMCustomer[];
    selectedIds: Set<string>;
    onSelectionChange: (ids: Set<string>) => void;
    cellKey: string;
    onClose: () => void;
}

export function CustomerList({
    customers,
    selectedIds,
    onSelectionChange,
    cellKey,
    onClose,
}: CustomerListProps) {
    const allSelected = customers.every((c) => selectedIds.has(c.id));
    const someSelected = customers.some((c) => selectedIds.has(c.id));

    const handleSelectAll = () => {
        const newSelected = new Set(selectedIds);
        if (allSelected) {
            customers.forEach((c) => newSelected.delete(c.id));
        } else {
            customers.forEach((c) => newSelected.add(c.id));
        }
        onSelectionChange(newSelected);
    };

    const handleToggle = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        onSelectionChange(newSelected);
    };

    const [x, y] = cellKey.split("-").map(Number);

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Customers</CardTitle>
                        <Badge variant="secondary">
                            Cell ({x}, {y})
                        </Badge>
                        <Badge variant="outline">{customers.length} customers</Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="gap-2"
                    >
                        {allSelected ? (
                            <>
                                <Square className="w-4 h-4" />
                                Deselect All
                            </>
                        ) : (
                            <>
                                <CheckSquare className="w-4 h-4" />
                                Select All ({customers.length})
                            </>
                        )}
                    </Button>
                    {someSelected && (
                        <Badge variant="default">
                            {customers.filter((c) => selectedIds.has(c.id)).length} selected
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <Checkbox
                                    checked={selectedIds.has(customer.id)}
                                    onCheckedChange={() => handleToggle(customer.id)}
                                />
                                <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">ID:</span>{" "}
                                        <span className="font-medium">{customer.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">R:</span>{" "}
                                        <span className="font-medium">{customer.recency}d</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">F:</span>{" "}
                                        <span className="font-medium">{customer.frequency}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">M:</span>{" "}
                                        <span className="font-medium">
                                            ${customer.monetary.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
