export interface BatteryProduct {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
}

export const batteryProducts: BatteryProduct[] = [
  { id: '1', name: 'Bosch 55D23L Car Battery', price: 420, priceDisplay: '420.00 AED', image: '/assets/IMG-20260203-WA0048.jpg' },
  { id: '2', name: 'Bosch 55D23L Car Battery', price: 420, priceDisplay: '420.00 AED', image: '/assets/IMG-20260203-WA0048-1.jpg' },
  { id: '3', name: 'Bosch DIN 70 Car Battery', price: 480, priceDisplay: '480.00 AED', image: '/assets/IMG-20260203-WA0051.jpg' },
  { id: '4', name: 'Bosch DIN 100 Car Battery', price: 700, priceDisplay: '700.00 AED', image: '/assets/IMG-20260203-WA0054.jpg' },
  { id: '5', name: 'Solite CMF-85D26L', price: 275, priceDisplay: '275.00 AED', image: '/assets/IMG-20260203-WA0056.jpg' },
  { id: '6', name: 'Bosch DIN 100 Car Battery', price: 700, priceDisplay: '700.00 AED', image: '/assets/IMG-20260203-WA0054-1.jpg' },
  { id: '7', name: 'Bosch DIN 70 Car Battery', price: 480, priceDisplay: '480.00 AED', image: '/assets/IMG-20260203-WA0051-1.jpg' },
  { id: '8', name: 'Solite CMF-85D26L', price: 275, priceDisplay: '275.00 AED', image: '/assets/IMG-20260203-WA0056-1.jpg' },
  { id: '9', name: 'Volcán CMF-55559', price: 155, priceDisplay: '155.00 AED', image: '/assets/IMG-20260203-WA0050.jpg' },
  { id: '10', name: 'AC Delco 80d26l Car Battery', price: 550, priceDisplay: '550.00 AED', image: '/assets/IMG-20260203-WA0057.jpg' },
  { id: '11', name: 'Amaron 105D26L Car Battery', price: 505, priceDisplay: '505.00 AED', image: '/assets/IMG-20260203-WA0053.jpg' },
  { id: '12', name: 'Amaron 105D26L Car Battery', price: 505, priceDisplay: '505.00 AED', image: '/assets/IMG-20260203-WA0053.jpg' },
  { id: '13', name: 'AC Delco ACD-46B24LS', price: 250, priceDisplay: '250.00 AED', image: '/assets/IMG-20260203-WA0055.jpg' },
  { id: '14', name: 'ACDelco 78A72 Car Battery', price: 600, priceDisplay: '600.00 AED', image: '/assets/IMG-20260203-WA0049.jpg' },
  { id: '15', name: 'AC Delco ACD-46B24LS', price: 250, priceDisplay: '250.00 AED', image: '/assets/IMG-20260203-WA0055.jpg' },
  { id: '16', name: 'AC Delco 80d26l Car Battery', price: 550, priceDisplay: '550.00 AED', image: '/assets/IMG-20260203-WA0057-1.jpg' },
];

export function getProductById(id: string): BatteryProduct | undefined {
  return batteryProducts.find(p => p.id === id);
}
