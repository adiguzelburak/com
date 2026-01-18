import { useState, useEffect, useMemo } from "react";
import {
    type Customer,
    calculateRFMScores,
    groupByGridPosition,
} from "@/lib/rfm-utils";
import { postSelectedIds } from "@/lib/api";
import { RFMFilters, type FilterValues } from "@/components/rfm-filters";
import { RFMGrid } from "@/components/rfm-grid";
import { CustomerList } from "@/components/customer-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { Send, Users, Grid3X3, Filter } from "lucide-react";

export function RFMApp() {
    const [rawData, setRawData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [submitting, setSubmitting] = useState(false);

    // Calculate data ranges for filters
    const ranges = useMemo(() => {
        if (rawData.length === 0) {
            return {
                recency: { min: 0, max: 365 },
                frequency: { min: 0, max: 50 },
                monetary: { min: 0, max: 10000 },
            };
        }
        return {
            recency: {
                min: Math.min(...rawData.map((c) => c.recency)),
                max: Math.max(...rawData.map((c) => c.recency)),
            },
            frequency: {
                min: Math.min(...rawData.map((c) => c.frequency)),
                max: Math.max(...rawData.map((c) => c.frequency)),
            },
            monetary: {
                min: Math.min(...rawData.map((c) => c.monetary)),
                max: Math.max(...rawData.map((c) => c.monetary)),
            },
        };
    }, [rawData]);

    const [filters, setFilters] = useState<FilterValues>({
        recency: [0, 365],
        frequency: [0, 50],
        monetary: [0, 10000],
    });

    // Load data
    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data: Customer[]) => {
                setRawData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
                setLoading(false);
            });
    }, []);

    // Initialize filters when data loads
    useEffect(() => {
        if (rawData.length > 0) {
            setFilters({
                recency: [ranges.recency.min, ranges.recency.max],
                frequency: [ranges.frequency.min, ranges.frequency.max],
                monetary: [ranges.monetary.min, ranges.monetary.max],
            });
        }
    }, [rawData.length, ranges]);

    // Filter and calculate RFM scores
    const filteredData = useMemo(() => {
        return rawData.filter(
            (c) =>
                c.recency >= filters.recency[0] &&
                c.recency <= filters.recency[1] &&
                c.frequency >= filters.frequency[0] &&
                c.frequency <= filters.frequency[1] &&
                c.monetary >= filters.monetary[0] &&
                c.monetary <= filters.monetary[1]
        );
    }, [rawData, filters]);

    const rfmData = useMemo(() => {
        return calculateRFMScores(filteredData);
    }, [filteredData]);

    const groupedCustomers = useMemo(() => {
        return groupByGridPosition(rfmData);
    }, [rfmData]);

    // Get customers in selected cell
    const selectedCellCustomers = useMemo(() => {
        if (!selectedCell) return [];
        return groupedCustomers.get(selectedCell) || [];
    }, [selectedCell, groupedCustomers]);

    // Handle submit
    const handleSubmit = async () => {
        if (selectedIds.size === 0) {
            toast.error("No customers selected", {
                description: "Please select at least one customer before submitting.",
            });
            return;
        }

        setSubmitting(true);
        try {
            const response = await postSelectedIds(Array.from(selectedIds));
            if (response.success) {
                toast.success("Submitted successfully!", {
                    description: response.message,
                });
                setSelectedIds(new Set());
                setSelectedCell(null);
            }
        } catch (error) {
            toast.error("Submission failed", {
                description: "Please try again later.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-muted-foreground">Loading RFM data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            <Toaster richColors position="top-right" />

            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <Grid3X3 className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">RFM Segmentation</h1>
                                <p className="text-sm text-muted-foreground">
                                    Customer Analysis Grid
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-1">
                                    <Users className="w-3 h-3" />
                                    {rfmData.length} customers
                                </Badge>
                                {selectedIds.size > 0 && (
                                    <Badge variant="default" className="gap-1">
                                        {selectedIds.size} selected
                                    </Badge>
                                )}
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedIds.size === 0 || submitting}
                                className="gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {submitting ? "Submitting..." : "Submit Selected IDs"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar - Filters */}
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                                Filter Customers
                            </span>
                        </div>
                        <RFMFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            ranges={ranges}
                        />

                        {/* Stats Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Customers</span>
                                    <span className="font-medium">{rawData.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Filtered</span>
                                    <span className="font-medium">{rfmData.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Selected</span>
                                    <span className="font-medium">{selectedIds.size}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Grid Area */}
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        {/* Grid */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Grid3X3 className="w-5 h-5" />
                                    RFM Segment Grid
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RFMGrid
                                    groupedCustomers={groupedCustomers}
                                    selectedCell={selectedCell}
                                    onCellClick={setSelectedCell}
                                />
                            </CardContent>
                        </Card>

                        {/* Selected Cell Customers */}
                        {selectedCell && selectedCellCustomers.length > 0 && (
                            <CustomerList
                                customers={selectedCellCustomers}
                                selectedIds={selectedIds}
                                onSelectionChange={setSelectedIds}
                                cellKey={selectedCell}
                                onClose={() => setSelectedCell(null)}
                            />
                        )}

                        {selectedCell && selectedCellCustomers.length === 0 && (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No customers in this segment with current filters.
                                </CardContent>
                            </Card>
                        )}

                        {/* Legend */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Segment Legend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                    {[
                                        { label: "Champions", color: "bg-emerald-500/20 border-emerald-500/50" },
                                        { label: "Loyal", color: "bg-green-500/20 border-green-500/50" },
                                        { label: "Potential Loyalists", color: "bg-teal-500/20 border-teal-500/50" },
                                        { label: "Need Attention", color: "bg-yellow-500/20 border-yellow-500/50" },
                                        { label: "At Risk", color: "bg-orange-500/20 border-orange-500/50" },
                                        { label: "Hibernating", color: "bg-red-500/20 border-red-500/50" },
                                        { label: "Lost", color: "bg-red-500/20 border-red-500/50" },
                                    ].map(({ label, color }) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded border ${color}`} />
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
