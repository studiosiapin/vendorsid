import ChangePassPage from '@/sections/change-pass/change-pass-page';
import { SearchParams } from 'nuqs/parsers';

type pageProps = {
    searchParams: SearchParams;
};

export const metadata = {
    title: 'Dashboard : Change Password'
};

export default async function Page({ searchParams }: pageProps) {
    return (
        <div className="p-6">
            <ChangePassPage />
        </div>
    );
}
