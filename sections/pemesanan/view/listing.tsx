import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/constants/data';
import { fakeOrder } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import OrderTable from '../tables';

type OrderListingPage = {};

export default async function ListingPage({}: OrderListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const data = await fakeOrder.getData(filters);
  const totalData = data.total_data;
  const orders: Order[] = data.data;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Ukuran`}
            description="Atur Ukuran-Ukuran yang akan digunakan"
          />
          <Link
            href={'/dashboard/pemesanan/create'}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
          </Link>
        </div>
        <Separator />
        <OrderTable data={orders} totalData={totalData} />
      </div>
    </PageContainer>
  );
}
