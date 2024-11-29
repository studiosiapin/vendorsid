'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { CircleX, Info } from 'lucide-react';
import { OrderStatus } from '@prisma/client';
import { OrderCellAction } from './cell-action'; // Import the cell action component for Order
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import BadgeStatus from '@/components/badge-status';
import { useSession } from 'next-auth/react';
import { useGetAllOrders } from '@/hooks/useOrder';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select'; // Import Select components
// import { DatePicker } from '@/components/ui/datepicker'; // Import DatePicker component

const pageSizeOptions = [5, 10, 20, 30, 40, 50]; // Define page size options

export default function PemesananTable() {
    const session = useSession();
    const userId = session.data?.user.id; // Use the logged in user ID here
    const [searchQuery, setSearchQuery] = useState<string>(''); // Stored search query
    const [page, setPage] = useState<number>(1); // Current page number
    const [limit, setLimit] = useState<number>(5); // Number of items per page
    const [statusFilter, setStatusFilter] = useState<string>('ALL'); // Status filter
    const [createdAtFilter, setCreatedAtFilter] = useState<Date | null>(null); // Created At filter

    const { orders, totalPages, totalData, isLoading, refetch } =
        useGetAllOrders(userId || null, page, searchQuery, statusFilter, limit);

    // Check if any filters are active
    const isFilterActive = Boolean(
        searchQuery || statusFilter || createdAtFilter
    );

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const totalPagesToShow = 5;

        if (totalPages <= totalPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <Button
                        key={i}
                        variant={page === i ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Button>
                );
            }
        } else {
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, page + 2);

            if (page <= 3) {
                endPage = 5;
            } else if (page >= totalPages - 2) {
                startPage = totalPages - 4;
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <Button
                        key={i}
                        variant={page === i ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Button>
                );
            }

            if (startPage > 1) {
                pageNumbers.unshift(<span key="start-ellipsis">...</span>);
                pageNumbers.unshift(
                    <Button
                        key={1}
                        variant={page === 1 ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </Button>
                );
            }

            if (endPage < totalPages) {
                pageNumbers.push(<span key="end-ellipsis">...</span>);
                pageNumbers.push(
                    <Button
                        key={totalPages}
                        variant={page === totalPages ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </Button>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Invoice ID, Title, Name or Email..."
                    className="rounded border border-gray-300 p-2"
                />
                <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                >
                    <SelectTrigger className="rounded border border-gray-300 p-2">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        {Object.values(OrderStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* <DatePicker
                    selected={createdAtFilter}
                    onChange={(date) => setCreatedAtFilter(date)}
                    placeholderText="Filter by Created At"
                    className="rounded border border-gray-300 p-2"
                /> */}
                {/* Reset filters button */}
                {isFilterActive && (
                    <Button
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
                            setCreatedAtFilter(null);
                        }}
                        variant={'outline'}
                    >
                        <CircleX className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {orders.length > 0 && !isLoading && (
                <Table className="rounded border-2">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Order By</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.invoiceId}</TableCell>
                                <TableCell>
                                    <div className="min-w-max">
                                        {order.title}
                                    </div>
                                </TableCell>
                                <TableCell>{order.user.name}</TableCell>
                                <TableCell>{order.user.email}</TableCell>
                                <TableCell>
                                    <BadgeStatus
                                        status={order.status as OrderStatus}
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <OrderCellAction
                                        data={order}
                                        onDeleted={() => {
                                            refetch();
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {!isLoading && orders.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                    <Info className="mx-auto mb-5 h-20 w-20 text-zinc-300 dark:text-zinc-600 " />
                    No transactions found
                </div>
            )}

            <TableSkeleton show={isLoading} />

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Select
                        value={`${limit}`}
                        onValueChange={(value) => {
                            setLimit(Number(value));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={limit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                        Showing {(page - 1) * limit + 1} to{' '}
                        {Math.min(page * limit, totalData)} of {totalData}{' '}
                        results
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    {renderPageNumbers()}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
