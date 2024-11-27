import { searchParamsCache } from '@/lib/searchparams';
import { ShipmentListingPage } from '@/sections/shipment/view';
import { SearchParams } from 'nuqs/parsers';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Dashboard : Shipment'
};

export default async function Page({ searchParams }: pageProps) {
    // Allow nested RSCs to access the search params (in a type-safe way)
    searchParamsCache.parse(searchParams);

    return <ShipmentListingPage />;
}
