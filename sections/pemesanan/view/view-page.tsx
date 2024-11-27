import React from 'react';
import PageContainer from '@/components/layout/page-container';
import OrderForm from '../base-form';

export default function ViewPage() {
    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <OrderForm />
            </div>
        </PageContainer>
    );
}
