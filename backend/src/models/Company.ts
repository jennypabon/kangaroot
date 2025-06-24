export interface Company {
  id?: number;
  company_name: string;
  admin_username: string;
  password_hash: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  website?: string;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}

export interface CompanyRegistrationData {
  companyName: string;
  adminUsername: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  website?: string;
}