'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useGetUserById } from '@/hooks/useUser';
import { User } from '@prisma/client';
import { PowerIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export function UserNav() {
    const { data: session } = useSession();

    const { isLoading, getUserById } = useGetUserById();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        if (session) {
            (async () => {
                try {
                    const userData = await getUserById(session.user.id);
                    setUser(userData.data);
                } catch (error) {}
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (session && !isLoading) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={user?.picture ?? '/images/default.jpg'}
                                alt={user?.name ?? ''}
                                className="object-cover"
                            />
                            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user?.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href="/dashboard/profile">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/change-pass">
                            <DropdownMenuItem>Change Password</DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                        <PowerIcon className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}
