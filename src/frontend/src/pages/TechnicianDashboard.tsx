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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BookingStatus } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  useGetBookingsByTechnician,
  useGetCallerUserProfile,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const technicianId = userProfile?.technicianId || "";
  const { data: bookings = [] } = useGetBookingsByTechnician(technicianId);
  const updateBookingStatus = useUpdateBookingStatus();

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    try {
      await updateBookingStatus.mutateAsync({ bookingId, newStatus });
      toast.success("Job status updated!");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  if (!userProfile || userProfile.userType !== "technician") {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the technician dashboard.
          </p>
          <Button onClick={() => navigate({ to: "/" })}>Go to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const activeJobs = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "inProgress",
  );
  const completedJobs = bookings.filter((b) => b.status === "completed");

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

  return (
    <div className="min-h-screen">
      <Header />

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold mt-1">{activeJobs.length}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completed Today
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {completedJobs.length}
                  </p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Assigned
                  </p>
                  <p className="text-3xl font-bold mt-1">{bookings.length}</p>
                </div>
                <MapPin className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Jobs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
            <CardDescription>Jobs currently assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active jobs at the moment
                </p>
              ) : (
                activeJobs.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{booking.id}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Service:{" "}
                              {booking.serviceType
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {booking.location.address},{" "}
                                {booking.location.city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>Customer: {booking.customerId}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Select
                              value={booking.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(
                                  booking.id,
                                  value as BookingStatus,
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="inProgress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${booking.location.latitude},${booking.location.longitude}`,
                                  "_blank",
                                )
                              }
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Open in Maps
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
            <CardDescription>
              Your recently completed service calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No completed jobs yet
                </p>
              ) : (
                completedJobs.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{booking.id}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booking.location.city}, {booking.location.emirate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Service:{" "}
                            {booking.serviceType
                              .replace(/([A-Z])/g, " $1")
                              .trim()}
                          </p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
