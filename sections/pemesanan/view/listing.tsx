import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import OrderTable from '../tables';
import AddButton from '../add-button';

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
                    <AddButton />
                </div>
                <Separator />
                <OrderTable />
            </div>
        </PageContainer>
    );
}
