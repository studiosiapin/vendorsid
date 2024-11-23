import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ShipmentTable from '../shipment-tables';

type ShipmentListingPage = {};

export default async function ShipmentListingPage({}: ShipmentListingPage) {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Shipment`}
            description="Atur shipments yang akan digunakan"
          />
          <Link
            href={'/dashboard/data/shipment/create'}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
          </Link>
        </div>
        <Separator />
        <ShipmentTable />
      </div>
    </PageContainer>
  );
}
