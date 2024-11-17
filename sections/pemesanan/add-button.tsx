'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const AddButton = () => {
  const session = useSession();
  const isAdmin =
    session.data?.user.role === 'admin' ||
    session.data?.user.role === 'super_admin';

  const isReseller = session.data?.user.role === 'reseller';
  return (
    <div className="">
      {isAdmin ||
        (isReseller && (
          <Link
            href={'/dashboard/pemesanan/create'}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
          </Link>
        ))}
    </div>
  );
};

export default AddButton;
