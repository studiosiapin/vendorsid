'use client';

import { useEffect, useRef, useState } from 'react';
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
import { Pagination } from '@/types/common';
import { CircleX } from 'lucide-react';
import { Ukuran } from '@prisma/client';
import { UkuranCellAction } from './cell-action';
import TableSkeleton from '@/components/skeleton/TableSkeleton';

export default function UkuranTable() {
    const [data, setData] = useState<Ukuran[]>([]);
    const [totalData, setTotalData] = useState(0);
    const [pagination, setPagination] = useState<Pagination>();
    const [searchQuery, setSearchQuery] = useState<string>(''); // Stored search query
    const [page, setPage] = useState<number>(1); // Current page number
    const [limit, setLimit] = useState<number>(10); // Number of items per page
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the timeout
    const [isLoading, setIsLoading] = useState(true);

    // Function to update the URL parameters
    const updateURLParams = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('searchQuery', searchQuery);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('limit', limit.toString());
        window.history.pushState({}, '', url);
    };

    // Fetch data function
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/ukuran?searchQuery=${encodeURIComponent(
                    searchQuery
                )}&page=${page}&limit=${limit}`
            );
            const result = await response.json();
            setData(result.data);
            setPagination(result.pagination);
            setTotalData(result.total);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    // Effect to handle debouncing and fetching
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchData();
            updateURLParams();
        }, 500); // 500 ms debounce time

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchQuery, page, limit]); // Dependencies to fetch data

    // Check if any filters are active
    const isFilterActive = Boolean(searchQuery);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="rounded border border-gray-300 p-2"
                />

                {/* Reset filters button */}
                {isFilterActive && (
                    <Button
                        onClick={() => {
                            setSearchQuery('');
                        }}
                        variant={'outline'}
                    >
                        <CircleX className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {data.length > 0 && !isLoading && (
                <Table className="rounded border-2">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((ukuran) => (
                            <TableRow key={ukuran.id}>
                                <TableCell>{ukuran.code}</TableCell>
                                <TableCell>{ukuran.name}</TableCell>
                                <TableCell>{ukuran.description}</TableCell>
                                <TableCell>
                                    <UkuranCellAction
                                        data={ukuran}
                                        onDeleted={() => {
                                            fetchData(); // Re-fetch data to update the table after deleting
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {!isLoading && data.length === 0 && <div>No data available.</div>}

            <TableSkeleton show={isLoading} />

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                    onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    aria-label="Go to prev page"
                    variant="outline"
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="text-sm font-medium">
                    Page {pagination?.page} of {pagination?.total_page}
                </span>
                <Button
                    onClick={() =>
                        handlePageChange(
                            page < Math.ceil(totalData / limit)
                                ? page + 1
                                : page
                        )
                    }
                    disabled={page >= Math.ceil(totalData / limit)}
                    aria-label="Go to next page"
                    variant="outline"
                    className="h-8 w-8 p-0"
                >
                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
