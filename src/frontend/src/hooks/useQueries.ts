import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  BookingInput,
  BookingStatus,
  Battery,
  BatteryPrice,
  TechnicianProfile,
  UserProfile,
  Warranty,
  WarrantyInput,
  FleetAccount,
  Customer,
} from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Bookings
export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingsByTechnician(technicianId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['bookings', 'technician', technicianId],
    queryFn: async () => {
      if (!actor || !technicianId) return [];
      return actor.getBookingsByTechnician(technicianId);
    },
    enabled: !!actor && !isFetching && !!technicianId,
  });
}

export function useGetMyBookings() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BookingInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBooking(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useAssignTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, technicianId }: { bookingId: string; technicianId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignTechnician(bookingId, technicianId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
  });
}

export function useGetBookingStatusCounts() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['bookingStatusCounts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBookingStatusCounts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Batteries
export function useGetAvailableBatteries() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['batteries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableBatteries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFindCompatibleBatteries(make: string, model: string, year: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['compatibleBatteries', make, model, year],
    queryFn: async () => {
      if (!actor) return [];
      const yearNum = parseInt(year, 10);
      if (isNaN(yearNum)) return [];
      return actor.findCompatibleBatteries(make, model, BigInt(yearNum));
    },
    enabled: !!actor && !isFetching && !!make && !!model && !!year,
  });
}

export function useUpdateBatteryInventory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (battery: Battery) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBatteryInventory(battery);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteries'] });
    },
  });
}

export function useDeleteBatteryInventory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batteryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBatteryInventory(batteryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteries'] });
    },
  });
}

// Battery Prices
export function useGetAllBatteryPrices() {
  const { actor, isFetching } = useActor();

  return useQuery<BatteryPrice[]>({
    queryKey: ['batteryPrices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBatteryPrices('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBatteryPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (price: BatteryPrice) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBatteryPrice(price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteryPrices'] });
    },
  });
}

export function useUpdateBatteryPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, price }: { index: bigint; price: BatteryPrice }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBatteryPrice(index, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteryPrices'] });
    },
  });
}

export function useDeleteBatteryPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBatteryPrice(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteryPrices'] });
    },
  });
}

// Technicians
export function useGetTechnicianAvailability() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTechnicianAvailability();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: TechnicianProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTechnician(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
  });
}

export function useUpdateTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: TechnicianProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTechnician(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
  });
}

// Warranties
export function useGetAllWarranties() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['warranties'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllWarranties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWarranty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WarrantyInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWarranty(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
    },
  });
}

// Fleet Accounts
export function useGetAllFleetAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['fleets'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllFleetAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Service Areas
export function useGetServiceAreas() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['serviceAreas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServiceAreas();
    },
    enabled: !!actor && !isFetching,
  });
}

// Store Locations
export function useGetStoreLocations() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['storeLocations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoreLocations();
    },
    enabled: !!actor && !isFetching,
  });
}
