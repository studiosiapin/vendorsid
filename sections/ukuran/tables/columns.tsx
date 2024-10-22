'use client';
import { Ukuran } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Ukuran>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Ukuran'
  },
  {
    accessorKey: 'description',
    header: 'Keterangan'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
