import React from 'react';
import PageContainer from '@/components/layout/page-container';
import JenisForm from '../jenis-form';

export default function JenisViewPage() {
    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <JenisForm />
            </div>
        </PageContainer>
    );
}
