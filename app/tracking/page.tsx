'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TrackingPage = () => {
    const router = useRouter();
    const [invoiceId, setInvoiceId] = useState('');

    const handleTracking = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/tracking/${invoiceId}`);
    };
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <span className="text-[2rem] font-semibold">Tracking Pesanan</span>
            <form
                onSubmit={handleTracking}
                className="mt-5 flex w-full flex-col gap-4 md:w-[50%]"
            >
                <Input
                    type="text"
                    placeholder="Masukkan kode invoice"
                    className="rounded-lg border border-gray-300 p-2"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                />
                <Button>Cari Pesanan</Button>
            </form>
        </div>
    );
};

export default TrackingPage;
