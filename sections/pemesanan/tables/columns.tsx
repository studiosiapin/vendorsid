'use client';
import { Order } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'invoice_id',
    header: 'Invoice ID'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'reseller',
    header: 'Reseller'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
