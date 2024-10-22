import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Desainer } from '@/constants/data';
import { fakeDesainer } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import DesainerTable from '../tables';

type DesainerListingPage = {};

export default async function ListingPage({}: DesainerListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const data = await fakeDesainer.getData(filters);
  const totalData = data.total_data;
  const Desainers: Desainer[] = data.data;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Desainer`}
            description="Atur Desainer-Desainer yang akan digunakan"
          />
          <Link
            href={'/dashboard/data/desainer/create'}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
          </Link>
        </div>
        <Separator />
        <DesainerTable data={Desainers} totalData={totalData} />
      </div>
    </PageContainer>
  );
}
