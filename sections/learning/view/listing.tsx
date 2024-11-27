import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import LearningTable from '../tables';

type LearningListingPage = {
    isReferensi?: boolean;
};

export default async function ListingPage({
    isReferensi
}: LearningListingPage) {
    return (
        <PageContainer>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Pembelajaran`}
                        description="Atur Desainer-Desainer yang akan digunakan"
                    />
                    {!isReferensi && (
                        <Link
                            href={'/dashboard/data/pembelajaran/create'}
                            className={cn(
                                buttonVariants(),
                                'text-xs md:text-sm'
                            )}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                        </Link>
                    )}
                </div>
                <Separator />
                <LearningTable />
            </div>
        </PageContainer>
    );
}
