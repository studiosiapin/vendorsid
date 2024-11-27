import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import EmployeeTable from '../employee-tables';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
];

type TEmployeeListingPage = {};

export default async function EmployeeListingPage({}: TEmployeeListingPage) {
    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`User`} description="Manage employees" />

                    <Link
                        href={'/dashboard/employee/new'}
                        className={cn(buttonVariants({ variant: 'default' }))}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Link>
                </div>
                <Separator />
                <EmployeeTable />
            </div>
        </PageContainer>
    );
}
