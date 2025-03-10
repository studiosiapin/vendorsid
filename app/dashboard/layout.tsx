import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Next Shadcn Dashboard Starter',
    description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="w-full flex-1 overflow-hidden">
                <Header />
                {children}
                <Toaster />
            </main>
        </div>
    );
}
