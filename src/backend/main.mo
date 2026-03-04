import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Char "mo:core/Char";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Location = {
    latitude : Float;
    longitude : Float;
    address : Text;
    city : Text;
    emirate : Text;
  };

  public type ServiceType = {
    #batteryReplacement;
    #jumpStart;
    #roadsideAssistance;
    #fleetManagement;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type Battery = {
    id : Text;
    brand : Text;
    model : Text;
    capacity : Nat;
    price : Nat;
    warrantyMonths : Nat;
    stock : Nat;
  };

  public type TechnicianProfile = {
    id : Text;
    name : Text;
    phone : Text;
    location : Location;
    isActive : Bool;
    assignedJobs : [Text];
    completedJobs : Nat;
    photo : ?Blob;
  };

  public type Customer = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    address : Location;
    serviceHistory : [Text];
  };

  public type Booking = {
    id : Text;
    customerId : Text;
    customerPrincipal : ?Principal;
    serviceType : ServiceType;
    batteryId : ?Text;
    location : Location;
    status : BookingStatus;
    technicianId : ?Text;
    timestamp : Time.Time;
    paymentStatus : { #pending; #paid; #failed };
  };

  public type Warranty = {
    id : Text;
    batteryId : Text;
    customerId : Text;
    purchaseDate : Time.Time;
    warrantyMonths : Nat;
    isActive : Bool;
  };

  public type FleetAccount = {
    id : Text;
    companyName : Text;
    contactName : Text;
    phone : Text;
    email : Text;
    vehicles : [Text];
    serviceHistory : [Text];
  };

  public type BookingInput = {
    customerId : Text;
    serviceType : ServiceType;
    batteryId : ?Text;
    location : Location;
  };

  public type WarrantyInput = {
    batteryId : Text;
    customerId : Text;
    purchaseDate : Time.Time;
    warrantyMonths : Nat;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
    userType : { #customer; #technician; #admin };
    technicianId : ?Text;
  };

  public type BatteryPrice = {
    brand : Text;
    model : Text;
    batteryType : Text;
    batterySize : Text;
    economyPrice : Float;
    standardPrice : Float;
    premiumPrice : Float;
    economyDiscount : Float;
    standardDiscount : Float;
    premiumDiscount : Float;
  };

  public type BankAccountDetails = {
    accountHolderName : Text;
    accountNumber : Text;
    iban : Text;
    swiftBic : Text;
    bankName : Text;
  };

  let bookings = Map.empty<Text, Booking>();
  let inventory = Map.empty<Text, Battery>();
  let technicians = Map.empty<Text, TechnicianProfile>();
  let customers = Map.empty<Text, Customer>();
  let fleets = Map.empty<Text, FleetAccount>();
  let warranties = Map.empty<Text, Warranty>();
  let batteryPrices = List.empty<BatteryPrice>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let technicianPrincipals = Map.empty<Text, Principal>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  var bookingCounter : Nat = 0;
  var warrantyCounter : Nat = 0;
  var bankAccountDetails : ?BankAccountDetails = null;

  module Booking {
    public func compare(b1 : Booking, b2 : Booking) : Order.Order {
      Text.compare(b1.id, b2.id);
    };
  };

  module Battery {
    public func compare(b1 : Battery, b2 : Battery) : Order.Order {
      Text.compare(b1.id, b2.id);
    };
  };

  module TechnicianProfile {
    public func compare(t1 : TechnicianProfile, t2 : TechnicianProfile) : Order.Order {
      Text.compare(t1.id, t2.id);
    };
  };

  module Customer {
    public func compare(c1 : Customer, c2 : Customer) : Order.Order {
      Text.compare(c1.id, c2.id);
    };
  };

  module Warranty {
    public func compare(w1 : Warranty, w2 : Warranty) : Order.Order {
      Text.compare(w1.id, w2.id);
    };
  };

  module BatteryPrice {
    public func compareByBrand(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      Text.compare(a.brand, b.brand);
    };

    public func compareByModel(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      Text.compare(a.model, b.model);
    };

    public func compareByType(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      Text.compare(a.batteryType, b.batteryType);
    };

    public func compareBySize(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      Text.compare(a.batterySize, b.batterySize);
    };

    public func compareByEconomyPrice(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      if (a.economyPrice < b.economyPrice) {
        #less;
      } else if (a.economyPrice > b.economyPrice) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByStandardPrice(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      if (a.standardPrice < b.standardPrice) {
        #less;
      } else if (a.standardPrice > b.standardPrice) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByPremiumPrice(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      if (a.premiumPrice < b.premiumPrice) {
        #less;
      } else if (a.premiumPrice > b.premiumPrice) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByEconomyDiscount(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      if (a.economyDiscount < b.economyDiscount) {
        #less;
      } else if (a.economyDiscount > b.economyDiscount) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByStandardDiscount(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      if (a.standardDiscount < b.standardDiscount) {
        #less;
      } else if (a.standardDiscount > b.standardDiscount) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByPremiumDiscount(a : BatteryPrice, b : BatteryPrice) : Order.Order {
      if (a.premiumDiscount < b.premiumDiscount) {
        #less;
      } else if (a.premiumDiscount > b.premiumDiscount) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  func containsIgnoreCase(source : Text, search : Text) : Bool {
    if (search.isEmpty()) {
      return true;
    };

    let lowerSource = source.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32((c.toNat32() + 32));
        } else { c };
      }
    );

    let lowerSearch = search.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32((c.toNat32() + 32));
        } else { c };
      }
    );

    let sourceLength = source.size();
    let searchLength = search.size();

    if (searchLength > sourceLength or searchLength == 0) {
      return false;
    };

    let scanLength = sourceLength - searchLength + 1;
    var i = 0;
    while (i < scanLength) {
      let sourceArray = lowerSource.toArray();
      let sliceArray = sourceArray.sliceToArray(i, i + searchLength);
      let sourceSlice = Text.fromArray(sliceArray);
      if (Text.equal(sourceSlice, lowerSearch)) {
        return true;
      };
      i += 1;
    };
    false;
  };

  public shared ({ caller }) func addBatteryPrice(price : BatteryPrice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add battery prices");
    };
    batteryPrices.add(price);
  };

  public shared ({ caller }) func updateBatteryPrice(index : Nat, price : BatteryPrice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update battery prices");
    };
    let pricesArray = batteryPrices.toArray();
    if (index >= pricesArray.size()) {
      Runtime.trap("Index out of bounds (size=" # pricesArray.size().toText() # ", index=" # index.toText() # ")");
    };
    let updatedPrices = pricesArray.toVarArray<BatteryPrice>();
    updatedPrices[index] := price;
    batteryPrices.clear();
    batteryPrices.addAll(updatedPrices.values());
  };

  public shared ({ caller }) func deleteBatteryPrice(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete battery prices");
    };
    let pricesArray = batteryPrices.toArray();
    if (index >= pricesArray.size()) {
      Runtime.trap("Index out of bounds (size=" # pricesArray.size().toText() # ", index=" # index.toText() # ")");
    };
    batteryPrices.clear();
    let sorted = pricesArray.sort(BatteryPrice.compareByBrand);
    for (i in Nat.range(0, sorted.size())) {
      if (i != index) {
        batteryPrices.add(sorted[i]);
      };
    };
  };

  public query func getAllBatteryPrices(sortBy : Text) : async [BatteryPrice] {
    batteryPrices.toArray();
  };

  public query func getFilteredBatteryPrices(
    brand : ?Text,
    model : ?Text,
    batteryType : ?Text,
    batterySize : ?Text,
    priceRange : ?(Nat, Nat)
  ) : async [BatteryPrice] {
    batteryPrices.toArray().filter(
      func(p) {
        let brandMatch = switch (brand) {
          case (null) { true };
          case (?b) { Text.equal(p.brand, b) };
        };
        let modelMatch = switch (model) {
          case (null) { true };
          case (?m) { Text.equal(p.model, m) };
        };
        let typeMatch = switch (batteryType) {
          case (null) { true };
          case (?t) { Text.equal(p.batteryType, t) };
        };
        let sizeMatch = switch (batterySize) {
          case (null) { true };
          case (?s) { Text.equal(p.batterySize, s) };
        };
        let priceMatch = switch (priceRange) {
          case (null) { true };
          case (?(min, max)) {
            (p.economyPrice >= min.toFloat() and p.economyPrice <= max.toFloat()) or
            (p.standardPrice >= min.toFloat() and p.standardPrice <= max.toFloat()) or
            (p.premiumPrice >= min.toFloat() and p.premiumPrice <= max.toFloat());
          };
        };
        brandMatch and modelMatch and typeMatch and sizeMatch and priceMatch;
      }
    );
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);

    switch (profile.technicianId) {
      case (?techId) {
        technicianPrincipals.add(techId, caller);
      };
      case (null) {};
    };
  };

  func isTechnician(caller : Principal, techId : Text) : Bool {
    switch (technicianPrincipals.get(techId)) {
      case (?principal) { Principal.equal(principal, caller) };
      case (null) { false };
    };
  };

  func ownsBooking(caller : Principal, bookingId : Text) : Bool {
    switch (bookings.get(bookingId)) {
      case (?booking) {
        switch (booking.customerPrincipal) {
          case (?principal) { Principal.equal(principal, caller) };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func getBookingsByStatus(status : BookingStatus) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };

    let filtered = bookings.values().toArray().filter(
      func(b) { b.status == status }
    );
    filtered.sort();
  };

  public query ({ caller }) func getBookingsByTechnician(techId : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };

    if (not (AccessControl.isAdmin(accessControlState, caller)) and not isTechnician(caller, techId)) {
      Runtime.trap("Unauthorized: Can only view your own assigned bookings");
    };

    let filtered = bookings.values().toArray().filter(
      func(b) { switch (b.technicianId) { case (?id) { id == techId }; case (null) { false } } }
    );
    filtered.sort();
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their bookings");
    };

    let filtered = bookings.values().toArray().filter(
      func(b) {
        switch (b.customerPrincipal) {
          case (?principal) { Principal.equal(principal, caller) };
          case (null) { false };
        }
      }
    );
    filtered.sort();
  };

  public shared ({ caller }) func createBooking(input : BookingInput) : async Text {
    bookingCounter += 1;
    let bookingId = "BK" # bookingCounter.toText();

    let customerPrincipal = if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      ?caller;
    } else {
      null;
    };

    let booking : Booking = {
      id = bookingId;
      customerId = input.customerId;
      customerPrincipal = customerPrincipal;
      serviceType = input.serviceType;
      batteryId = input.batteryId;
      location = input.location;
      status = #pending;
      technicianId = null;
      timestamp = Time.now();
      paymentStatus = #pending;
    };

    bookings.add(bookingId, booking);
    bookingId;
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Text, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update booking status");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let isAuthorized = AccessControl.isAdmin(accessControlState, caller) or
                          (switch (booking.technicianId) {
                            case (?techId) { isTechnician(caller, techId) };
                            case (null) { false };
                          }) or
                          (newStatus == #cancelled and ownsBooking(caller, bookingId));

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: Cannot update this booking");
        };

        let updated = { booking with status = newStatus };
        bookings.add(bookingId, updated);
      };
    };
  };

  public shared ({ caller }) func assignTechnician(bookingId : Text, techId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign technicians");
    };
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?bl) { bl };
    };
    let technician = switch (technicians.get(techId)) {
      case (null) { Runtime.trap("Technician not found") };
      case (?tech) { tech };
    };
    let updatedBooking = { booking with technicianId = ?techId; status = #confirmed };
    let updatedTechnician = {
      technician with
      assignedJobs = technician.assignedJobs.concat([bookingId]);
    };
    bookings.add(bookingId, updatedBooking);
    technicians.add(techId, updatedTechnician);
  };

  public query func getBookableTimeSlots() : async [Text] {
    let slots = List.empty<Text>();
    slots.add("09:00");
    slots.add("10:00");
    slots.add("11:00");
    slots.add("12:00");
    slots.add("13:00");
    slots.add("14:00");
    slots.toArray();
  };

  public query ({ caller }) func getTechnicianLocation(techId : Text) : async Location {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view technician locations");
    };

    let technician = switch (technicians.get(techId)) {
      case (null) { Runtime.trap("Technician not found") };
      case (?tech) { tech };
    };
    technician.location;
  };

  public shared ({ caller }) func updateTechnicianLocation(techId : Text, newLocation : Location) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update location");
    };

    if (not (AccessControl.isAdmin(accessControlState, caller)) and not isTechnician(caller, techId)) {
      Runtime.trap("Unauthorized: Only admins or the technician can update location");
    };

    switch (technicians.get(techId)) {
      case (null) { Runtime.trap("Technician not found") };
      case (?tech) {
        let updated = { tech with location = newLocation };
        technicians.add(techId, updated);
      };
    };
  };

  public query func getAvailableBatteries() : async [Battery] {
    inventory.values().toArray().sort();
  };

  public query func findCompatibleBatteries(make : Text, model : Text, year : Nat) : async [Battery] {
    let filtered = inventory.values().toArray().filter(
      func(battery) {
        containsIgnoreCase(battery.brand, make) and containsIgnoreCase(battery.model, model)
      }
    );
    filtered.sort();
  };

  public shared ({ caller }) func updateBatteryInventory(battery : Battery) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update inventory");
    };
    inventory.add(battery.id, battery);
  };

  public shared ({ caller }) func deleteBatteryInventory(batteryId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete inventory");
    };
    inventory.remove(batteryId);
  };

  public shared ({ caller }) func processPayment(bookingId : Text, amount : Nat, currency : Text, method : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can process payments");
    };

    if (not (AccessControl.isAdmin(accessControlState, caller)) and not ownsBooking(caller, bookingId)) {
      Runtime.trap("Unauthorized: Can only pay for your own bookings");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updated = { booking with paymentStatus = #paid };
        bookings.add(bookingId, updated);
      };
    };

    "success";
  };

  public type Notification = {
    to : Text;
    message : Text;
    method : { #sms; #whatsapp; #email };
  };

  public shared ({ caller }) func sendNotification(notification : Notification) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can send notifications");
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };

    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
      };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public type StoreLocation = {
    id : Text;
    name : Text;
    address : Text;
    phone : Text;
    latitude : Float;
    longitude : Float;
  };

  public query func getStoreLocations() : async [StoreLocation] {
    let locations : [StoreLocation] = [
      {
        id = "1";
        name = "VOLTNOW Warehouse - Dubai";
        address = "AL Quoz Industrial Area 2, Dubai";
        phone = "+971509309079";
        latitude = 25.1428;
        longitude = 55.2268;
      },
      {
        id = "2";
        name = "VOLTNOW Warehouse - Abu Dhabi";
        address = "Mussafah Industrial Area, Abu Dhabi";
        phone = "+971509309079";
        latitude = 24.3422;
        longitude = 54.5467;
      },
      {
        id = "3";
        name = "VOLTNOW Warehouse - Sharjah";
        address = "Industrial Area 7, Sharjah";
        phone = "+971509309079";
        latitude = 25.3340;
        longitude = 55.3845;
      },
    ];
    locations;
  };

  public query func getServiceAreas() : async [Text] {
    [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Umm Al Quwain",
      "Fujairah",
      "Al Ain",
    ];
  };

  public query ({ caller }) func getTechnicianAvailability() : async [TechnicianProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view technician availability");
    };

    let available = technicians.values().toArray().filter(
      func(t) { t.isActive }
    );
    available.sort();
  };

  public shared ({ caller }) func createTechnician(profile : TechnicianProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create technicians");
    };
    technicians.add(profile.id, profile);
  };

  public shared ({ caller }) func updateTechnician(profile : TechnicianProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update technicians");
    };
    technicians.add(profile.id, profile);
  };

  public shared ({ caller }) func deleteTechnician(techId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete technicians");
    };
    technicians.remove(techId);
  };

  public query ({ caller }) func getBookingStatusCounts() : async [(BookingStatus, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let all = bookings.values().toArray().sort();
    let pendingCount = all.filter(func(b) { b.status == #pending }).size();
    let confirmedCount = all.filter(func(b) { b.status == #confirmed }).size();
    let inProgressCount = all.filter(func(b) { b.status == #inProgress }).size();
    let completedCount = all.filter(func(b) { b.status == #completed }).size();
    let cancelledCount = all.filter(func(b) { b.status == #cancelled }).size();

    [
      (#pending, pendingCount),
      (#confirmed, confirmedCount),
      (#inProgress, inProgressCount),
      (#completed, completedCount),
      (#cancelled, cancelledCount),
    ];
  };

  public shared ({ caller }) func createWarranty(input : WarrantyInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create warranties");
    };

    warrantyCounter += 1;
    let warrantyId = "WR" # warrantyCounter.toText();

    let warranty : Warranty = {
      id = warrantyId;
      batteryId = input.batteryId;
      customerId = input.customerId;
      purchaseDate = input.purchaseDate;
      warrantyMonths = input.warrantyMonths;
      isActive = true;
    };

    warranties.add(warrantyId, warranty);
    warrantyId;
  };

  public query ({ caller }) func getWarranty(warrantyId : Text) : async ?Warranty {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view warranties");
    };
    warranties.get(warrantyId);
  };

  public query ({ caller }) func getAllWarranties() : async [Warranty] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all warranties");
    };
    warranties.values().toArray().sort();
  };

  public shared ({ caller }) func createFleetAccount(fleet : FleetAccount) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create fleet accounts");
    };
    fleets.add(fleet.id, fleet);
  };

  public query ({ caller }) func getFleetAccount(fleetId : Text) : async ?FleetAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view fleet accounts");
    };
    fleets.get(fleetId);
  };

  public query ({ caller }) func getAllFleetAccounts() : async [FleetAccount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all fleet accounts");
    };
    fleets.values().toArray();
  };

  public shared ({ caller }) func createCustomer(customer : Customer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create customer profiles");
    };
    customers.add(customer.id, customer);
  };

  public query ({ caller }) func getCustomer(customerId : Text) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view customer details");
    };
    customers.get(customerId);
  };

  public query ({ caller }) func getAllCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all customers");
    };
    customers.values().toArray().sort();
  };

  public query ({ caller }) func getReceiverBankAccountDetails() : async BankAccountDetails {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bank account details");
    };
    switch (bankAccountDetails) {
      case (?details) { details };
      case (null) { Runtime.trap("Bank account details not found") };
    };
  };

  public query ({ caller }) func getReceiverIban() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bank account details");
    };
    switch (bankAccountDetails) {
      case (?details) { details.iban };
      case (null) { Runtime.trap("Bank account details not found") };
    };
  };

  public shared ({ caller }) func updateReceiverBankAccountDetails(details : BankAccountDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update bank account details");
    };
    bankAccountDetails := ?details;
  };

  public shared ({ caller }) func testOutcall(_ : Text) : async Text {
    "Hello World!";
  };
};
