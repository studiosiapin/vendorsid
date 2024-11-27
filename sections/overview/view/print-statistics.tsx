'use client';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';

const PrintStatistics = () => {
    const handlePrint = async () => {
        const container = document.querySelector('#stat-continer');

        if (!container) return;

        const canvas = await html2canvas(container as HTMLElement, {
            scale: 1.5
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        pdf.save(`overview-${new Date().toISOString().split('T')[0]}.pdf`);
    };
    return (
        <div>
            <Button onClick={handlePrint}>Download</Button>
        </div>
    );
};

export default PrintStatistics;
