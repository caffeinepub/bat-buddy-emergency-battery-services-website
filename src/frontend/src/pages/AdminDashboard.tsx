import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  useGetAllBookings,
  useGetAvailableBatteries,
  useGetTechnicianAvailability,
  useGetAllWarranties,
  useGetAllFleetAccounts,
  useAssignTechnician,
  useUpdateBookingStatus,
  useUpdateBatteryInventory,
  useDeleteBatteryInventory,
  useCreateTechnician,
  useGetBookingStatusCounts,
  useIsCallerAdmin,
} from '../hooks/useQueries';
import { BookingStatus, Battery, TechnicianProfile } from '../backend';
import {
  Package,
  Users,
  Wrench,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: bookings = [] } = useGetAllBookings();
  const { data: batteries = [] } = useGetAvailableBatteries();
  const { data: technicians = [] } = useGetTechnicianAvailability();
  const { data: warranties = [] } = useGetAllWarranties();
  const { data: fleets = [] } = useGetAllFleetAccounts();
  const { data: statusCounts = [] } = useGetBookingStatusCounts();

  const assignTechnician = useAssignTechnician();
  const updateBookingStatus = useUpdateBookingStatus();
  const updateBattery = useUpdateBatteryInventory();
  const deleteBattery = useDeleteBatteryInventory();
  const createTechnician = useCreateTechnician();

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [batteryDialogOpen, setBatteryDialogOpen] = useState(false);
  const [technicianDialogOpen, setTechnicianDialogOpen] = useState(false);

  // Battery form state
  const [batteryForm, setBatteryForm] = useState({
    id: '',
    brand: '',
    model: '',
    capacity: '',
    price: '',
    warrantyMonths: '',
    stock: '',
  });

  // Technician form state
  const [technicianForm, setTechnicianForm] = useState({
    id: '',
    name: '',
    phone: '',
    isActive: true,
  });

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <p className="text-muted-foreground mb-6">You don't have permission to access the admin dashboard.</p>
          <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAssignTechnician = async () => {
    if (!selectedBooking || !selectedTechnicianId) {
      toast.error('Please select a technician');
      return;
    }

    try {
      await assignTechnician.mutateAsync({
        bookingId: selectedBooking,
        technicianId: selectedTechnicianId,
      });
      toast.success('Technician assigned successfully!');
      setSelectedBooking(null);
      setSelectedTechnicianId('');
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error('Failed to assign technician');
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus.mutateAsync({ bookingId, newStatus });
      toast.success('Booking status updated!');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleSaveBattery = async () => {
    if (!batteryForm.id || !batteryForm.brand || !batteryForm.model) {
      toast.error('Please fill in all required fields');
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
      toast.success('Battery saved successfully!');
      setBatteryDialogOpen(false);
      setBatteryForm({ id: '', brand: '', model: '', capacity: '', price: '', warrantyMonths: '', stock: '' });
    } catch (error) {
      console.error('Battery save error:', error);
      toast.error('Failed to save battery');
    }
  };

  const handleDeleteBattery = async (batteryId: string) => {
    try {
      await deleteBattery.mutateAsync(batteryId);
      toast.success('Battery deleted successfully!');
    } catch (error) {
      console.error('Battery delete error:', error);
      toast.error('Failed to delete battery');
    }
  };

  const handleCreateTechnician = async () => {
    if (!technicianForm.id || !technicianForm.name || !technicianForm.phone) {
      toast.error('Please fill in all required fields');
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
          address: 'Dubai',
          city: 'Dubai',
          emirate: 'Dubai',
        },
      };

      await createTechnician.mutateAsync(technician);
      toast.success('Technician created successfully!');
      setTechnicianDialogOpen(false);
      setTechnicianForm({ id: '', name: '', phone: '', isActive: true });
    } catch (error) {
      console.error('Technician create error:', error);
      toast.error('Failed to create technician');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      inProgress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Active Technicians',
      value: technicians.filter((t) => t.isActive).length,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Battery Stock',
      value: batteries.reduce((sum, b) => sum + Number(b.stock), 0),
      icon: Wrench,
      color: 'text-amber-600',
    },
    {
      title: 'Fleet Accounts',
      value: fleets.length,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings, inventory, technicians, and more</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Booking Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {statusCounts.map(([status, count]) => (
                <div key={status} className="text-center">
                  <p className="text-2xl font-bold">{Number(count)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="warranties">Warranties</TabsTrigger>
            <TabsTrigger value="fleets">Fleets</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage all service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{booking.id}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">Customer: {booking.customerId}</p>
                            <p className="text-sm text-muted-foreground">
                              Location: {booking.location.city}, {booking.location.emirate}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Service: {booking.serviceType.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            {booking.technicianId && (
                              <p className="text-sm text-muted-foreground">Technician: {booking.technicianId}</p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {!booking.technicianId && booking.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedBooking(booking.id)}
                                className="bg-gradient-to-r from-amber-500 to-orange-500"
                              >
                                Assign Technician
                              </Button>
                            )}
                            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                              <Select
                                value={booking.status}
                                onValueChange={(value) => handleStatusUpdate(booking.id, value as BookingStatus)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="inProgress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Battery Inventory</CardTitle>
                    <CardDescription>Manage battery stock and pricing</CardDescription>
                  </div>
                  <Button
                    onClick={() => setBatteryDialogOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Battery
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batteries.map((battery) => (
                    <Card key={battery.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <img
                              src="/assets/generated/car-battery-product.dim_400x400.jpg"
                              alt={`${battery.brand} ${battery.model}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {battery.brand} {battery.model}
                              </h3>
                              <p className="text-sm text-muted-foreground">Capacity: {Number(battery.capacity)}Ah</p>
                              <p className="text-sm text-muted-foreground">
                                Warranty: {Number(battery.warrantyMonths)} months
                              </p>
                              <p className="text-sm text-muted-foreground">Stock: {Number(battery.stock)} units</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold text-amber-600">AED {Number(battery.price)}</p>
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
                                  warrantyMonths: battery.warrantyMonths.toString(),
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicians">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Technician Management</CardTitle>
                    <CardDescription>Manage technician profiles and availability</CardDescription>
                  </div>
                  <Button
                    onClick={() => setTechnicianDialogOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Technician
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((tech) => (
                    <Card key={tech.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{tech.name}</h3>
                              <Badge variant={tech.isActive ? 'default' : 'secondary'}>
                                {tech.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {tech.id}</p>
                            <p className="text-sm text-muted-foreground">Phone: {tech.phone}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed Jobs: {Number(tech.completedJobs)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Assigned Jobs: {tech.assignedJobs.length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warranties">
            <Card>
              <CardHeader>
                <CardTitle>Warranty Management</CardTitle>
                <CardDescription>Track and manage battery warranties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warranties.map((warranty) => (
                    <Card key={warranty.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{warranty.id}</h3>
                            <p className="text-sm text-muted-foreground">Battery: {warranty.batteryId}</p>
                            <p className="text-sm text-muted-foreground">Customer: {warranty.customerId}</p>
                            <p className="text-sm text-muted-foreground">
                              Duration: {Number(warranty.warrantyMonths)} months
                            </p>
                          </div>
                          <Badge variant={warranty.isActive ? 'default' : 'secondary'}>
                            {warranty.isActive ? 'Active' : 'Expired'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fleets">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Management</CardTitle>
                <CardDescription>Manage corporate fleet accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fleets.map((fleet) => (
                    <Card key={fleet.id}>
                      <CardContent className="pt-6">
                        <div>
                          <h3 className="font-semibold">{fleet.companyName}</h3>
                          <p className="text-sm text-muted-foreground">Contact: {fleet.contactName}</p>
                          <p className="text-sm text-muted-foreground">Phone: {fleet.phone}</p>
                          <p className="text-sm text-muted-foreground">Email: {fleet.email}</p>
                          <p className="text-sm text-muted-foreground">Vehicles: {fleet.vehicles.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Assign Technician Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>Select a technician for booking {selectedBooking}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Technician</Label>
              <Select value={selectedTechnicianId} onValueChange={setSelectedTechnicianId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians
                    .filter((t) => t.isActive)
                    .map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} - {tech.assignedJobs.length} active jobs
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAssignTechnician}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
              disabled={assignTechnician.isPending}
            >
              {assignTechnician.isPending ? 'Assigning...' : 'Assign Technician'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Battery Dialog */}
      <Dialog open={batteryDialogOpen} onOpenChange={setBatteryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{batteryForm.id ? 'Edit Battery' : 'Add Battery'}</DialogTitle>
            <DialogDescription>Enter battery details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Battery ID</Label>
              <Input
                value={batteryForm.id}
                onChange={(e) => setBatteryForm({ ...batteryForm, id: e.target.value })}
                placeholder="BAT-001"
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                value={batteryForm.brand}
                onChange={(e) => setBatteryForm({ ...batteryForm, brand: e.target.value })}
                placeholder="e.g., Bosch"
              />
            </div>
            <div>
              <Label>Model</Label>
              <Input
                value={batteryForm.model}
                onChange={(e) => setBatteryForm({ ...batteryForm, model: e.target.value })}
                placeholder="e.g., S4 005"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Capacity (Ah)</Label>
                <Input
                  type="number"
                  value={batteryForm.capacity}
                  onChange={(e) => setBatteryForm({ ...batteryForm, capacity: e.target.value })}
                  placeholder="60"
                />
              </div>
              <div>
                <Label>Price (AED)</Label>
                <Input
                  type="number"
                  value={batteryForm.price}
                  onChange={(e) => setBatteryForm({ ...batteryForm, price: e.target.value })}
                  placeholder="450"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Warranty (months)</Label>
                <Input
                  type="number"
                  value={batteryForm.warrantyMonths}
                  onChange={(e) => setBatteryForm({ ...batteryForm, warrantyMonths: e.target.value })}
                  placeholder="24"
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={batteryForm.stock}
                  onChange={(e) => setBatteryForm({ ...batteryForm, stock: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveBattery}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
              disabled={updateBattery.isPending}
            >
              {updateBattery.isPending ? 'Saving...' : 'Save Battery'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Technician Dialog */}
      <Dialog open={technicianDialogOpen} onOpenChange={setTechnicianDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Technician</DialogTitle>
            <DialogDescription>Enter technician details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Technician ID</Label>
              <Input
                value={technicianForm.id}
                onChange={(e) => setTechnicianForm({ ...technicianForm, id: e.target.value })}
                placeholder="TECH-001"
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={technicianForm.name}
                onChange={(e) => setTechnicianForm({ ...technicianForm, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={technicianForm.phone}
                onChange={(e) => setTechnicianForm({ ...technicianForm, phone: e.target.value })}
                placeholder="+971 50 123 4567"
              />
            </div>
            <Button
              onClick={handleCreateTechnician}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
              disabled={createTechnician.isPending}
            >
              {createTechnician.isPending ? 'Creating...' : 'Create Technician'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
