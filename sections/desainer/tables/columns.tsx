'use client';
import { Desainer } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Desainer>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Desainer'
  },
  {
    accessorKey: 'phone',
    header: 'No WhatsApp'
  },
  {
    accessorKey: 'description',
    header: 'Keterangan'
  },
  {
    accessorKey: 'portfolio',
    header: 'Portofolio'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
