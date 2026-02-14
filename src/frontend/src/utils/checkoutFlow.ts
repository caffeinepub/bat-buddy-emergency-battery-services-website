export interface CheckoutAddress {
  type: 'manual' | 'gps';
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface CheckoutSearchParams {
  productId?: string;
  addressType?: 'manual' | 'gps';
  address?: string;
  latitude?: string;
  longitude?: string;
}

export function serializeCheckoutAddress(productId: string, addressData: CheckoutAddress): CheckoutSearchParams {
  if (addressData.type === 'manual' && addressData.address) {
    return {
      productId,
      addressType: 'manual',
      address: addressData.address,
    };
  } else if (addressData.type === 'gps' && addressData.latitude !== undefined && addressData.longitude !== undefined) {
    return {
      productId,
      addressType: 'gps',
      latitude: addressData.latitude.toString(),
      longitude: addressData.longitude.toString(),
    };
  }
  return { productId };
}

export function deserializeCheckoutAddress(params: CheckoutSearchParams): CheckoutAddress | null {
  if (params.addressType === 'manual' && params.address) {
    return {
      type: 'manual',
      address: params.address,
    };
  } else if (params.addressType === 'gps' && params.latitude && params.longitude) {
    return {
      type: 'gps',
      latitude: parseFloat(params.latitude),
      longitude: parseFloat(params.longitude),
    };
  }
  return null;
}
