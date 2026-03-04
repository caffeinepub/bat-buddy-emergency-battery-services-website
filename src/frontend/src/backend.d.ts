import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude: number;
    city: string;
    longitude: number;
    address: string;
    emirate: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Battery {
    id: string;
    model: string;
    stock: bigint;
    warrantyMonths: bigint;
    brand: string;
    capacity: bigint;
    price: bigint;
}
export interface WarrantyInput {
    batteryId: string;
    purchaseDate: Time;
    warrantyMonths: bigint;
    customerId: string;
}
export interface TechnicianProfile {
    id: string;
    completedJobs: bigint;
    name: string;
    isActive: boolean;
    assignedJobs: Array<string>;
    phone: string;
    photo?: Uint8Array;
    location: Location;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface BankAccountDetails {
    swiftBic: string;
    iban: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
}
export interface Booking {
    id: string;
    status: BookingStatus;
    serviceType: ServiceType;
    paymentStatus: Variant_pending_paid_failed;
    batteryId?: string;
    customerPrincipal?: Principal;
    technicianId?: string;
    timestamp: Time;
    customerId: string;
    location: Location;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface StoreLocation {
    id: string;
    latitude: number;
    name: string;
    longitude: number;
    address: string;
    phone: string;
}
export interface BookingInput {
    serviceType: ServiceType;
    batteryId?: string;
    customerId: string;
    location: Location;
}
export interface Customer {
    id: string;
    name: string;
    email: string;
    address: Location;
    phone: string;
    serviceHistory: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FleetAccount {
    id: string;
    vehicles: Array<string>;
    contactName: string;
    email: string;
    companyName: string;
    phone: string;
    serviceHistory: Array<string>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Warranty {
    id: string;
    batteryId: string;
    purchaseDate: Time;
    isActive: boolean;
    warrantyMonths: bigint;
    customerId: string;
}
export interface Notification {
    to: string;
    method: Variant_sms_whatsapp_email;
    message: string;
}
export interface UserProfile {
    userType: Variant_technician_admin_customer;
    name: string;
    email: string;
    technicianId?: string;
    phone: string;
}
export interface BatteryPrice {
    economyPrice: number;
    model: string;
    premiumPrice: number;
    premiumDiscount: number;
    standardPrice: number;
    economyDiscount: number;
    batterySize: string;
    batteryType: string;
    brand: string;
    standardDiscount: number;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    inProgress = "inProgress"
}
export enum ServiceType {
    fleetManagement = "fleetManagement",
    jumpStart = "jumpStart",
    roadsideAssistance = "roadsideAssistance",
    batteryReplacement = "batteryReplacement"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_paid_failed {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum Variant_sms_whatsapp_email {
    sms = "sms",
    whatsapp = "whatsapp",
    email = "email"
}
export enum Variant_technician_admin_customer {
    technician = "technician",
    admin = "admin",
    customer = "customer"
}
export interface backendInterface {
    addBatteryPrice(price: BatteryPrice): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTechnician(bookingId: string, techId: string): Promise<void>;
    createBooking(input: BookingInput): Promise<string>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createCustomer(customer: Customer): Promise<void>;
    createFleetAccount(fleet: FleetAccount): Promise<void>;
    createTechnician(profile: TechnicianProfile): Promise<void>;
    createWarranty(input: WarrantyInput): Promise<string>;
    deleteBatteryInventory(batteryId: string): Promise<void>;
    deleteBatteryPrice(index: bigint): Promise<void>;
    deleteTechnician(techId: string): Promise<void>;
    findCompatibleBatteries(make: string, model: string, year: bigint): Promise<Array<Battery>>;
    getAllBatteryPrices(sortBy: string): Promise<Array<BatteryPrice>>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllFleetAccounts(): Promise<Array<FleetAccount>>;
    getAllWarranties(): Promise<Array<Warranty>>;
    getAvailableBatteries(): Promise<Array<Battery>>;
    getBookableTimeSlots(): Promise<Array<string>>;
    getBookingStatusCounts(): Promise<Array<[BookingStatus, bigint]>>;
    getBookingsByStatus(status: BookingStatus): Promise<Array<Booking>>;
    getBookingsByTechnician(techId: string): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(customerId: string): Promise<Customer | null>;
    getFilteredBatteryPrices(brand: string | null, model: string | null, batteryType: string | null, batterySize: string | null, priceRange: [bigint, bigint] | null): Promise<Array<BatteryPrice>>;
    getFleetAccount(fleetId: string): Promise<FleetAccount | null>;
    getMyBookings(): Promise<Array<Booking>>;
    getReceiverBankAccountDetails(): Promise<BankAccountDetails>;
    getReceiverIban(): Promise<string>;
    getServiceAreas(): Promise<Array<string>>;
    getStoreLocations(): Promise<Array<StoreLocation>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTechnicianAvailability(): Promise<Array<TechnicianProfile>>;
    getTechnicianLocation(techId: string): Promise<Location>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWarranty(warrantyId: string): Promise<Warranty | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    processPayment(bookingId: string, amount: bigint, currency: string, method: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendNotification(notification: Notification): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    testOutcall(arg0: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBatteryInventory(battery: Battery): Promise<void>;
    updateBatteryPrice(index: bigint, price: BatteryPrice): Promise<void>;
    updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<void>;
    updateReceiverBankAccountDetails(details: BankAccountDetails): Promise<void>;
    updateTechnician(profile: TechnicianProfile): Promise<void>;
    updateTechnicianLocation(techId: string, newLocation: Location): Promise<void>;
}
