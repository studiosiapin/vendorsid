import React from 'react';
import PageContainer from '@/components/layout/page-container';
import ShipmentForm from '../shipment-form';

export default function ShipmentViewPage() {
    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <ShipmentForm />
            </div>
        </PageContainer>
    );
}
