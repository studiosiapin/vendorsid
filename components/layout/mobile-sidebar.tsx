'use client';
import { DashboardNav } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems, resellerNavItems, workerNavItems } from '@/constants/data';
import { MenuIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const session = useSession();
  const isAdmin =
    session.data?.user.role === 'admin' ||
    session.data?.user.role === 'super_admin';

  const isReseller = session.data?.user.role === 'reseller';

  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="focus:outline-none">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav
                  items={
                    isAdmin
                      ? navItems
                      : isReseller
                      ? resellerNavItems
                      : workerNavItems
                  }
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
