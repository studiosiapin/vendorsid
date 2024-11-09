import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import OrderTable from '../tables';

type OrderListingPage = {};

export default async function ListingPage({}: OrderListingPage) {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Pemesanan`}
            description="Atur pesanan-pesanan anda"
          />
          <Link
            href={'/dashboard/pemesanan/create'}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
          </Link>
        </div>
        <Separator />
        <OrderTable />
      </div>
    </PageContainer>
  );
}
