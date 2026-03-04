import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  Package,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type BankAccountDetails,
  type Battery,
  BookingStatus,
  type TechnicianProfile,
} from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  useAssignTechnician,
  useCreateTechnician,
  useDeleteBatteryInventory,
  useGetAllBookings,
  useGetAllFleetAccounts,
  useGetAllWarranties,
  useGetAvailableBatteries,
  useGetBookingStatusCounts,
  useGetReceiverBankAccountDetails,
  useGetTechnicianAvailability,
  useIsCallerAdmin,
  useUpdateBatteryInventory,
  useUpdateBookingStatus,
  useUpdateReceiverBankAccountDetails,
} from "../hooks/useQueries";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: bookings = [] } = useGetAllBookings();
  const { data: batteries = [] } = useGetAvailableBatteries();
  const { data: technicians = [] } = useGetTechnicianAvailability();
  const { data: warranties = [] } = useGetAllWarranties();
  const { data: fleets = [] } = useGetAllFleetAccounts();
  const { data: statusCounts = [] } = useGetBookingStatusCounts();
  const { data: bankAccountDetails, isLoading: bankDetailsLoading } =
    useGetReceiverBankAccountDetails();

  const assignTechnician = useAssignTechnician();
  const updateBookingStatus = useUpdateBookingStatus();
  const updateBattery = useUpdateBatteryInventory();
  const deleteBattery = useDeleteBatteryInventory();
  const createTechnician = useCreateTechnician();
  const updateBankAccount = useUpdateReceiverBankAccountDetails();

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [batteryDialogOpen, setBatteryDialogOpen] = useState(false);
  const [technicianDialogOpen, setTechnicianDialogOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Battery form state
  const [batteryForm, setBatteryForm] = useState({
    id: "",
    brand: "",
    model: "",
    capacity: "",
    price: "",
    warrantyMonths: "",
    stock: "",
  });

  // Technician form state
  const [technicianForm, setTechnicianForm] = useState({
    id: "",
    name: "",
    phone: "",
    isActive: true,
  });

  // Bank account form state
  const [bankAccountForm, setBankAccountForm] = useState<BankAccountDetails>({
    accountHolderName: "",
    accountNumber: "",
    iban: "",
    swiftBic: "",
    bankName: "",
  });

  // Initialize bank account form when data is loaded
  useEffect(() => {
    if (bankAccountDetails) {
      setBankAccountForm(bankAccountDetails);
    }
  }, [bankAccountDetails]);

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => navigate({ to: "/" })}>Go to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAssignTechnician = async () => {
    if (!selectedBooking || !selectedTechnicianId) {
      toast.error("Please select a technician");
      return;
    }

    try {
      await assignTechnician.mutateAsync({
        bookingId: selectedBooking,
        technicianId: selectedTechnicianId,
      });
      toast.success("Technician assigned successfully!");
      setSelectedBooking(null);
      setSelectedTechnicianId("");
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to assign technician");
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    try {
      await updateBookingStatus.mutateAsync({ bookingId, newStatus });
      toast.success("Booking status updated!");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSaveBattery = async () => {
    if (!batteryForm.id || !batteryForm.brand || !batteryForm.model) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const battery: Battery = {
        id: batteryForm.id,
        brand: batteryForm.brand,
        model: batteryForm.model,
        capacity: BigInt(batteryForm.capacity || 0),
        price: BigInt(batteryForm.price || 0),
        warrantyMonths: BigInt(batteryForm.warrantyMonths || 0),
        stock: BigInt(batteryForm.stock || 0),
      };

      await updateBattery.mutateAsync(battery);
      toast.success("Battery saved successfully!");
      setBatteryDialogOpen(false);
      setBatteryForm({
        id: "",
        brand: "",
        model: "",
        capacity: "",
        price: "",
        warrantyMonths: "",
        stock: "",
      });
    } catch (error) {
      console.error("Battery save error:", error);
      toast.error("Failed to save battery");
    }
  };

  const handleDeleteBattery = async (batteryId: string) => {
    try {
      await deleteBattery.mutateAsync(batteryId);
      toast.success("Battery deleted successfully!");
    } catch (error) {
      console.error("Battery delete error:", error);
      toast.error("Failed to delete battery");
    }
  };

  const handleCreateTechnician = async () => {
    if (!technicianForm.id || !technicianForm.name || !technicianForm.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const technician: TechnicianProfile = {
        id: technicianForm.id,
        name: technicianForm.name,
        phone: technicianForm.phone,
        isActive: technicianForm.isActive,
        assignedJobs: [],
        completedJobs: BigInt(0),
        location: {
          latitude: 25.2048,
          longitude: 55.2708,
          address: "Dubai",
          city: "Dubai",
          emirate: "Dubai",
        },
      };

      await createTechnician.mutateAsync(technician);
      toast.success("Technician created successfully!");
      setTechnicianDialogOpen(false);
      setTechnicianForm({ id: "", name: "", phone: "", isActive: true });
    } catch (error) {
      console.error("Technician create error:", error);
      toast.error("Failed to create technician");
    }
  };

  const handleSaveBankAccount = async () => {
    if (
      !bankAccountForm.accountHolderName ||
      !bankAccountForm.accountNumber ||
      !bankAccountForm.bankName ||
      !bankAccountForm.iban ||
      !bankAccountForm.swiftBic
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateBankAccount.mutateAsync(bankAccountForm);
      toast.success("Bank account details saved successfully!");
    } catch (error: any) {
      console.error("Bank account save error:", error);
      const errorMessage =
        error?.message || "Failed to save bank account details";
      toast.error(errorMessage);
    }
  };

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (_error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      confirmed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      inProgress:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.status === BookingStatus.inProgress,
  ).length;
  const totalRevenue =
    bookings.filter((b) => b.status === BookingStatus.completed).length * 350;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your battery service operations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">AED {totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                From completed jobs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Technicians</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{technicians.length}</div>
              <p className="text-xs text-muted-foreground">
                Active technicians
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="warranties">Warranties</TabsTrigger>
            <TabsTrigger value="fleets">Fleet Accounts</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  View and manage all service bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No bookings found
                    </p>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{booking.id}</span>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: {booking.customerId} | Location:{" "}
                            {booking.location.city}
                          </p>
                          {booking.technicianId && (
                            <p className="text-sm text-muted-foreground">
                              Technician: {booking.technicianId}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!booking.technicianId && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBooking(booking.id)}
                            >
                              Assign Tech
                            </Button>
                          )}
                          <Select
                            value={booking.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(
                                booking.id,
                                value as BookingStatus,
                              )
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={BookingStatus.pending}>
                                Pending
                              </SelectItem>
                              <SelectItem value={BookingStatus.confirmed}>
                                Confirmed
                              </SelectItem>
                              <SelectItem value={BookingStatus.inProgress}>
                                In Progress
                              </SelectItem>
                              <SelectItem value={BookingStatus.completed}>
                                Completed
                              </SelectItem>
                              <SelectItem value={BookingStatus.cancelled}>
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Booking Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {statusCounts.map(([status, count]) => (
                    <div
                      key={status}
                      className="text-center p-4 border rounded-lg"
                    >
                      <div className="text-2xl font-bold">{Number(count)}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Battery Inventory</CardTitle>
                  <CardDescription>
                    Manage battery stock and pricing
                  </CardDescription>
                </div>
                <Button onClick={() => setBatteryDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Battery
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batteries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No batteries in inventory
                    </p>
                  ) : (
                    batteries.map((battery) => (
                      <div
                        key={battery.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {battery.brand} {battery.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Capacity: {Number(battery.capacity)}Ah | Price: AED{" "}
                            {Number(battery.price)} | Stock:{" "}
                            {Number(battery.stock)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Warranty: {Number(battery.warrantyMonths)} months
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setBatteryForm({
                                id: battery.id,
                                brand: battery.brand,
                                model: battery.model,
                                capacity: battery.capacity.toString(),
                                price: battery.price.toString(),
                                warrantyMonths:
                                  battery.warrantyMonths.toString(),
                                stock: battery.stock.toString(),
                              });
                              setBatteryDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBattery(battery.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technicians Tab */}
          <TabsContent value="technicians" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Technician Management</CardTitle>
                  <CardDescription>
                    Manage your service technicians
                  </CardDescription>
                </div>
                <Button onClick={() => setTechnicianDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Technician
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No technicians found
                    </p>
                  ) : (
                    technicians.map((tech) => (
                      <div
                        key={tech.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{tech.name}</h3>
                            <Badge
                              variant={tech.isActive ? "default" : "secondary"}
                            >
                              {tech.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {tech.id} | Phone: {tech.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Assigned Jobs: {tech.assignedJobs.length} |
                            Completed: {Number(tech.completedJobs)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Warranties Tab */}
          <TabsContent value="warranties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Warranty Management</CardTitle>
                <CardDescription>
                  Track and manage battery warranties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warranties.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No warranties found
                    </p>
                  ) : (
                    warranties.map((warranty) => (
                      <div key={warranty.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{warranty.id}</span>
                          <Badge
                            variant={
                              warranty.isActive ? "default" : "secondary"
                            }
                          >
                            {warranty.isActive ? "Active" : "Expired"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Battery: {warranty.batteryId} | Customer:{" "}
                          {warranty.customerId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {Number(warranty.warrantyMonths)} months
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fleet Accounts Tab */}
          <TabsContent value="fleets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Fleet Account Management
                </CardTitle>
                <CardDescription>
                  Manage corporate and fleet accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fleets.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No fleet accounts found
                    </p>
                  ) : (
                    fleets.map((fleet) => (
                      <div key={fleet.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">
                          {fleet.companyName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Contact: {fleet.contactName} | Phone: {fleet.phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Email: {fleet.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Vehicles: {fleet.vehicles.length}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Account Tab */}
          <TabsContent value="bank" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Receiver Bank Account Configuration
                </CardTitle>
                <CardDescription>
                  Configure the bank account details that will be displayed to
                  customers for bank transfer payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bankDetailsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Loading bank account details...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name *</Label>
                        <Input
                          id="bankName"
                          placeholder="e.g., Emirates NBD"
                          value={bankAccountForm.bankName}
                          onChange={(e) =>
                            setBankAccountForm({
                              ...bankAccountForm,
                              bankName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">
                          Account Holder Name *
                        </Label>
                        <Input
                          id="accountHolderName"
                          placeholder="e.g., BAT-BUDDY LLC"
                          value={bankAccountForm.accountHolderName}
                          onChange={(e) =>
                            setBankAccountForm({
                              ...bankAccountForm,
                              accountHolderName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          id="accountNumber"
                          placeholder="e.g., 1234567890"
                          value={bankAccountForm.accountNumber}
                          onChange={(e) =>
                            setBankAccountForm({
                              ...bankAccountForm,
                              accountNumber: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN *</Label>
                        <Input
                          id="iban"
                          placeholder="e.g., AE070331234567890123456"
                          value={bankAccountForm.iban}
                          onChange={(e) =>
                            setBankAccountForm({
                              ...bankAccountForm,
                              iban: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="swiftBic">SWIFT/BIC Code *</Label>
                        <Input
                          id="swiftBic"
                          placeholder="e.g., EBILAEAD"
                          value={bankAccountForm.swiftBic}
                          onChange={(e) =>
                            setBankAccountForm({
                              ...bankAccountForm,
                              swiftBic: e.target.value.toUpperCase(),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveBankAccount}
                        disabled={updateBankAccount.isPending}
                        className="flex-1"
                      >
                        {updateBankAccount.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Bank Account Details
                          </>
                        )}
                      </Button>
                    </div>

                    {bankAccountDetails && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                          <strong>Preview:</strong> This is how customers will
                          see your bank account details when they select bank
                          transfer as payment method.
                        </p>
                        <div className="space-y-2 bg-white dark:bg-gray-900 p-3 rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Bank Name
                              </div>
                              <div className="font-semibold">
                                {bankAccountDetails.bankName}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Account Holder
                              </div>
                              <div className="font-semibold">
                                {bankAccountDetails.accountHolderName}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground">
                                Account Number
                              </div>
                              <div className="font-mono font-semibold">
                                {bankAccountDetails.accountNumber}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCopyToClipboard(
                                  bankAccountDetails.accountNumber,
                                  "Account Number",
                                )
                              }
                            >
                              {copiedField === "Account Number" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground">
                                IBAN
                              </div>
                              <div className="font-mono font-semibold uppercase break-all">
                                {bankAccountDetails.iban}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCopyToClipboard(
                                  bankAccountDetails.iban,
                                  "IBAN",
                                )
                              }
                            >
                              {copiedField === "IBAN" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground">
                                SWIFT/BIC Code
                              </div>
                              <div className="font-mono font-semibold uppercase">
                                {bankAccountDetails.swiftBic}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCopyToClipboard(
                                  bankAccountDetails.swiftBic,
                                  "SWIFT/BIC",
                                )
                              }
                            >
                              {copiedField === "SWIFT/BIC" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Assign Technician Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              Select a technician for booking {selectedBooking}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={selectedTechnicianId}
              onValueChange={setSelectedTechnicianId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name} ({tech.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={handleAssignTechnician}
                disabled={!selectedTechnicianId}
              >
                Assign
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Battery Dialog */}
      <Dialog open={batteryDialogOpen} onOpenChange={setBatteryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {batteryForm.id ? "Edit Battery" : "Add Battery"}
            </DialogTitle>
            <DialogDescription>Enter battery details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="battery-id">Battery ID *</Label>
              <Input
                id="battery-id"
                value={batteryForm.id}
                onChange={(e) =>
                  setBatteryForm({ ...batteryForm, id: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="battery-brand">Brand *</Label>
              <Input
                id="battery-brand"
                value={batteryForm.brand}
                onChange={(e) =>
                  setBatteryForm({ ...batteryForm, brand: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="battery-model">Model *</Label>
              <Input
                id="battery-model"
                value={batteryForm.model}
                onChange={(e) =>
                  setBatteryForm({ ...batteryForm, model: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="battery-capacity">Capacity (Ah)</Label>
                <Input
                  id="battery-capacity"
                  type="number"
                  value={batteryForm.capacity}
                  onChange={(e) =>
                    setBatteryForm({ ...batteryForm, capacity: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-price">Price (AED)</Label>
                <Input
                  id="battery-price"
                  type="number"
                  value={batteryForm.price}
                  onChange={(e) =>
                    setBatteryForm({ ...batteryForm, price: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="battery-warranty">Warranty (months)</Label>
                <Input
                  id="battery-warranty"
                  type="number"
                  value={batteryForm.warrantyMonths}
                  onChange={(e) =>
                    setBatteryForm({
                      ...batteryForm,
                      warrantyMonths: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="battery-stock">Stock</Label>
                <Input
                  id="battery-stock"
                  type="number"
                  value={batteryForm.stock}
                  onChange={(e) =>
                    setBatteryForm({ ...batteryForm, stock: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveBattery}>Save</Button>
              <Button
                variant="outline"
                onClick={() => setBatteryDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Technician Dialog */}
      <Dialog
        open={technicianDialogOpen}
        onOpenChange={setTechnicianDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Technician</DialogTitle>
            <DialogDescription>Enter technician details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tech-id">Technician ID *</Label>
              <Input
                id="tech-id"
                value={technicianForm.id}
                onChange={(e) =>
                  setTechnicianForm({ ...technicianForm, id: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-name">Name *</Label>
              <Input
                id="tech-name"
                value={technicianForm.name}
                onChange={(e) =>
                  setTechnicianForm({ ...technicianForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-phone">Phone *</Label>
              <Input
                id="tech-phone"
                value={technicianForm.phone}
                onChange={(e) =>
                  setTechnicianForm({
                    ...technicianForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTechnician}>Create</Button>
              <Button
                variant="outline"
                onClick={() => setTechnicianDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
