'use client';

import { useEffect, useRef, useState } from 'react';
import { User } from '@prisma/client';
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
import { CellAction } from './cell-action';
import { CircleX } from 'lucide-react';
import TableSkeleton from '@/components/skeleton/TableSkeleton';

export default function EmployeeTable() {
  const [data, setData] = useState<User[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [pagination, setPagination] = useState<Pagination>();
  const [searchQuery, setSearchQuery] = useState<string>(''); // Stored search query
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1); // Current page number
  const [limit, setLimit] = useState<number>(10); // Number of items per page
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the timeout
  const [isLoading, setIsLoading] = useState(true);

  // Function to update the URL parameters
  const updateURLParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('searchQuery', searchQuery);
    url.searchParams.set('gender', genderFilter);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('role', roleFilter);
    window.history.pushState({}, '', url);
  };

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/user?searchQuery=${encodeURIComponent(
          searchQuery
        )}&gender=${encodeURIComponent(genderFilter)}&role=${encodeURIComponent(
          roleFilter
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
  }, [searchQuery, genderFilter, page, limit, roleFilter]); // Dependencies to fetch data

  // Check if any filters are active
  const isFilterActive = Boolean(searchQuery || genderFilter || roleFilter);

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
        <select
          onChange={(e) => setGenderFilter(e.target.value)}
          value={genderFilter}
          className="h-full rounded border border-gray-300 bg-transparent p-1.5"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* role filter */}
        <select
          onChange={(e) => setRoleFilter(e.target.value)}
          value={roleFilter}
          className="h-full rounded border border-gray-300 bg-transparent p-1.5"
        >
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="reseller">Reseller</option>
          <option value="design_setting">Design Setting</option>
          <option value="printing">Printing</option>
          <option value="pressing">Pressing</option>
          <option value="sewering">Sewering</option>
          <option value="finishing">Finishing</option>
        </select>

        {/* Reset filters button */}
        {isFilterActive && (
          <Button
            onClick={() => {
              setSearchQuery('');
              setGenderFilter('');
              setRoleFilter('');
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <CellAction
                    data={user}
                    onDeleted={() => {
                      fetchData();
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
              page < Math.ceil(totalData / limit) ? page + 1 : page
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
