import DetailPageOrder from '@/sections/pemesanan/detail';
import { SearchParams } from 'nuqs/parsers';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Order Details | Vendors ID'
};

export default async function Page({ searchParams }: pageProps) {
    return <DetailPageOrder />;
}
