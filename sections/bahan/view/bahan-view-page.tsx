import { Breadcrumbs } from '@/components/breadcrumbs';
import React from 'react';
import PageContainer from '@/components/layout/page-container';
import BahanForm from '../bahan-form';

export default function BahanViewPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <BahanForm />
      </div>
    </PageContainer>
  );
}
