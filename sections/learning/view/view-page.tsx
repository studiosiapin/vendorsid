import React from 'react';
import PageContainer from '@/components/layout/page-container';
import LearningForm from '../learning-form';

export default function ViewPage() {
    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <LearningForm />
            </div>
        </PageContainer>
    );
}
