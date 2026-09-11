export interface PostalOfficeInfo {
  name: string;
  district: string;
  state: string;
  deliveryStatus: string;
}

export interface PinCodeLookupResult {
  success: boolean;
  postOffices: PostalOfficeInfo[];
  district: string;
  state: string;
  message?: string;
}

export async function lookupPinCode(pincode: string): Promise<PinCodeLookupResult> {
  const cleanPin = pincode.trim().replace(/\D/g, '');
  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return {
      success: false,
      postOffices: [],
      district: '',
      state: '',
      message: 'Please enter a valid 6-digit Indian PIN code',
    };
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].Status === 'Success' && Array.isArray(data[0].PostOffice)) {
      const offices: PostalOfficeInfo[] = data[0].PostOffice.map((po: any) => ({
        name: po.Name,
        district: po.District || '',
        state: po.State || '',
        deliveryStatus: po.DeliveryStatus || 'Delivery',
      }));
      const first = offices[0];
      return {
        success: true,
        postOffices: offices,
        district: first.district,
        state: first.state,
      };
    } else {
      return {
        success: false,
        postOffices: [],
        district: '',
        state: '',
        message: 'Invalid PIN code. Please enter a valid Indian postal PIN code.',
      };
    }
  } catch (err) {
    return {
      success: false,
      postOffices: [],
      district: '',
      state: '',
      message: 'Network error verifying PIN code. Please check your connection.',
    };
  }
}
