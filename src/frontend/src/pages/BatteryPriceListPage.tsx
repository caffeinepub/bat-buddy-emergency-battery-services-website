import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Battery as BatteryIcon,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BatteryPrice } from "../backend";
import { useGetAllBatteryPrices } from "../hooks/useQueries";

type SortField =
  | "brand"
  | "model"
  | "batteryType"
  | "batterySize"
  | "economyPrice"
  | "standardPrice"
  | "premiumPrice";
type SortDirection = "asc" | "desc";

export default function BatteryPriceListPage() {
  const { data: batteryPrices = [], isLoading } = useGetAllBatteryPrices();

  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("brand");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Extract unique values for filters
  const uniqueBrands = useMemo(() => {
    const brands = new Set(batteryPrices.map((p) => p.brand));
    return Array.from(brands).sort();
  }, [batteryPrices]);

  const uniqueModels = useMemo(() => {
    const models = new Set(batteryPrices.map((p) => p.model));
    return Array.from(models).sort();
  }, [batteryPrices]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(batteryPrices.map((p) => p.batteryType));
    return Array.from(types).sort();
  }, [batteryPrices]);

  // Filter and sort data
  const filteredAndSortedPrices = useMemo(() => {
    let filtered = batteryPrices.filter((price) => {
      const matchesSearch =
        searchTerm === "" ||
        price.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.batteryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.batterySize.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = brandFilter === "all" || price.brand === brandFilter;
      const matchesModel = modelFilter === "all" || price.model === modelFilter;
      const matchesType =
        typeFilter === "all" || price.batteryType === typeFilter;

      return matchesSearch && matchesBrand && matchesModel && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [
    batteryPrices,
    searchTerm,
    brandFilter,
    modelFilter,
    typeFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const formatPrice = (price: number, discount: number) => {
    const discountedPrice = price - discount;
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          AED {discountedPrice.toFixed(2)}
        </span>
        {discount > 0 && (
          <span className="text-xs text-gray-500 line-through">
            AED {price.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BatteryIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Battery Price List
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our comprehensive battery catalog with transparent pricing
            for Economy, Standard, and Premium categories
          </p>
        </div>

        {/* Filters Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find the perfect battery for your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search batteries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="All Models" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {uniqueModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="type">Battery Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPrices.length} of {batteryPrices.length}{" "}
              batteries
            </div>
          </CardContent>
        </Card>

        {/* Price Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading battery prices...
                  </p>
                </div>
              </div>
            ) : filteredAndSortedPrices.length === 0 ? (
              <div className="text-center py-12">
                <BatteryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No batteries found matching your criteria
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50 dark:bg-gray-800">
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("brand")}
                          className="font-semibold flex items-center"
                        >
                          Brand
                          <SortIcon field="brand" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("model")}
                          className="font-semibold flex items-center"
                        >
                          Model
                          <SortIcon field="model" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("batteryType")}
                          className="font-semibold flex items-center"
                        >
                          Type
                          <SortIcon field="batteryType" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("batterySize")}
                          className="font-semibold flex items-center"
                        >
                          Size
                          <SortIcon field="batterySize" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("economyPrice")}
                          className="font-semibold flex items-center"
                        >
                          Economy
                          <SortIcon field="economyPrice" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("standardPrice")}
                          className="font-semibold flex items-center"
                        >
                          Standard
                          <SortIcon field="standardPrice" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("premiumPrice")}
                          className="font-semibold flex items-center"
                        >
                          Premium
                          <SortIcon field="premiumPrice" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedPrices.map((price) => (
                      <TableRow
                        key={`${price.brand}-${price.model}-${price.batteryType}`}
                        className="hover:bg-amber-50/50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium">
                          {price.brand}
                        </TableCell>
                        <TableCell>{price.model}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{price.batteryType}</Badge>
                        </TableCell>
                        <TableCell>{price.batterySize}</TableCell>
                        <TableCell>
                          {formatPrice(
                            price.economyPrice,
                            price.economyDiscount,
                          )}
                        </TableCell>
                        <TableCell>
                          {formatPrice(
                            price.standardPrice,
                            price.standardDiscount,
                          )}
                        </TableCell>
                        <TableCell>
                          {formatPrice(
                            price.premiumPrice,
                            price.premiumDiscount,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg">Economy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Budget-friendly option with reliable performance and 12-month
                warranty
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg">Standard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Best value with enhanced durability and 18-month warranty
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg">Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Top-tier performance with advanced technology and 24-month
                warranty
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
