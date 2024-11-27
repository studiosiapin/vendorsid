import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import BahanTable from '../bahan-tables';

type BahanListingPage = {};

export default async function BahanListingPage({}: BahanListingPage) {
    return (
        <PageContainer>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Bahan`}
                        description="Atur bahan-bahan yang akan digunakan"
                    />
                    <Link
                        href={'/dashboard/data/bahan/create'}
                        className={cn(buttonVariants(), 'text-xs md:text-sm')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Link>
                </div>
                <Separator />
                <BahanTable />
            </div>
        </PageContainer>
    );
}
