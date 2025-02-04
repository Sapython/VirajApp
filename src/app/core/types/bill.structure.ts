import { Timestamp } from '@angular/fire/firestore';
import { CustomerInfo, UserConstructor } from './user.structure';
import { Billing, Payment } from './payment.structure';
import { KotConstructor } from './kot.structure';

export interface BillConstructor {
  id: string;
  tokens: string[];
  billNo?: string;
  orderNo: string | null;
  createdDate: Timestamp;
  billSplits: PrintableBill[];
  billReprints: {
    reprintReason: string;
    time: Timestamp;
    user: UserConstructor;
  }[];
  modifiedAllProducts: any[];
  optionalTax: boolean;
  stage: 'active' | 'finalized' | 'settled' | 'cancelled';
  cancelledReason?: {
    reason: string;
    time: Timestamp;
    phone: string;
    user: UserConstructor;
  };
  settlement?: {
    payments: Payment[];
    time: Timestamp;
    user: UserConstructor;
    additionalInfo: any;
    elevatedUser?:string;
  };
  settlementElevatedUser?:string;
  instruction?: string;
  customerInfo: CustomerInfo;
  billingMode: 'cash' | 'card' | 'upi' | 'nonChargeable';
  mode: 'dineIn' | 'takeaway' | 'online';
  user: UserConstructor;
  kots: KotConstructor[];
  table: any;
  billing: Billing;
  printableBillData?: PrintableBill;
  nonChargeableDetail?: {
    reason: string;
    time: Timestamp;
    user: UserConstructor;
    phone: string;
    name: string;
    elevatedUser?:string;
  };
  currentLoyalty: billLoyalty;
}
export interface billLoyalty {
  loyaltySettingId: string;
  totalLoyaltyCost: number;
  totalLoyaltyPoints: number;
  totalToBeRedeemedPoints: number;
  totalToBeRedeemedCost: number;
  receiveLoyalty: boolean;
  redeemLoyalty: boolean;
  expiryDate?: Timestamp;
}
export interface PrintableBill {
  businessDetails: {
    name: string;
    address: string;
    phone: string;
    fssai: string;
    gstin: string;
    email: string;
  };
  customerDetail: {
    name?: string;
    phone?: string;
    address?: string;
    gstin?: string;
  };
  date: string;
  time: string;
  orderNo: string;
  billNoSuffix?: string;
  billNo: string;
  cashierName: string;
  mode: 'Dine In' | 'Takeaway' | 'Online';
  products: printableBillItem[];
  totalQuantity: number;
  subTotal: number;
  postDiscountSubTotal: number;
  discounts: printableDiscount[];
  taxes: printableTax[];
  grandTotal: number;
  note: string;
  notes: string[];
  currentLoyalty: billLoyalty;
}

export interface printableBillItem {
  id: string;
  name: string;
  quantity: number;
  untaxedValue: number;
  total: number;
}

export interface printableDiscount {
  name: string;
  rate: number;
  type: 'flat' | 'percentage';
  value: number;
}

export interface printableTax {
  name: string;
  rate: number;
  value: number;
}
