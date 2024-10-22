'use client';
import { Learning } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Learning>[] = [
  {
    accessorKey: 'name',
    header: 'Pembelajaran'
  },
  {
    accessorKey: 'description',
    header: 'Keterangan'
  },
  {
    accessorKey: 'source',
    header: 'Link Pembelajaran'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
