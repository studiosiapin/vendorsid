import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
  phone: string;
  email: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active',
    phone: '093209320',
    email: 'XNqyY@example.com'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export type Bahan = {
  id: number;
  photo_url: string;
  name: string;
  description: string;
};

export type Jenis = {
  id: number;
  photo_url: string;
  name: string;
  description: string;
};

export type Ukuran = {
  id: number;
  name: string;
  description: string;
};

export type Desainer = {
  id: number;
  name: string;
  description: string;
  portfolio: string;
  phone: string;
};

export type Learning = {
  id: number;
  name: string;
  description: string;
  source: string;
};

export type Order = {
  id: number;
  title: string;
  description: string;
  invoice_id: string;
  status: string;
  reseller: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'overview'
  },
  {
    title: 'Pemesanan',
    href: '/dashboard/pemesanan',
    icon: 'billing',
    label: 'pemesanan'
  },
  {
    title: 'Pengaturan',
    icon: 'settings',
    label: 'account',
    children: [
      {
        title: 'User',
        href: '/dashboard/employee',
        icon: 'user',
        label: 'user'
      }
    ]
  },
  {
    title: 'Master Data',
    icon: 'laptop',
    label: 'master data',
    children: [
      {
        title: 'Bahan',
        href: '/dashboard/data/bahan',
        icon: 'chevronRight',
        label: 'bahan'
      },
      {
        title: 'Ukuran',
        href: '/dashboard/data/ukuran',
        icon: 'chevronRight',
        label: 'ukuran'
      },
      {
        title: 'Jenis',
        href: '/dashboard/data/jenis',
        icon: 'chevronRight',
        label: 'jenis'
      },
      {
        title: 'Desainer',
        href: '/dashboard/data/desainer',
        icon: 'chevronRight',
        label: 'desainer'
      },
      {
        title: 'Pembelajaran',
        href: '/dashboard/data/pembelajaran',
        icon: 'chevronRight',
        label: 'pembelajaran'
      }
    ]
  },
  {
    title: 'Referensi',
    icon: 'help',
    label: 'referensi',
    children: [
      {
        title: 'Desainer',
        href: '/dashboard/data/desainer',
        icon: 'chevronRight',
        label: 'desainer'
      },
      {
        title: 'Pembelajaran',
        href: '/dashboard/data/pembelajaran',
        icon: 'chevronRight',
        label: 'pembelajaran'
      }
    ]
  }
];

export const resellerNavItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'overview'
  },
  {
    title: 'Pemesanan',
    href: '/dashboard/pemesanan',
    icon: 'billing',
    label: 'pemesanan'
  },
  {
    title: 'Referensi',
    icon: 'help',
    label: 'referensi',
    children: [
      {
        title: 'Desainer',
        href: '/dashboard/data/desainer',
        icon: 'chevronRight',
        label: 'desainer'
      },
      {
        title: 'Pembelajaran',
        href: '/dashboard/data/pembelajaran',
        icon: 'chevronRight',
        label: 'pembelajaran'
      }
    ]
  }
];

export const workerNavItems: NavItem[] = [
  {
    title: 'Pemesanan',
    href: '/dashboard/pemesanan',
    icon: 'billing',
    label: 'pemesanan'
  }
];
