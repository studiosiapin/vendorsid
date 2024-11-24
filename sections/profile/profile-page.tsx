'use client';
import {
  useGetUserById,
  useUpdateProfile,
  useUpdateUser
} from '@/hooks/useUser';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@prisma/client';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { CameraIcon, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userFormSchemaDefault } from '@/types/schema/userFormSchema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const session = useSession();

  const userId = useMemo(() => {
    if (session) {
      return session.data?.user.id;
    }
    return null;
  }, [session]);

  const [profile, setProfile] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);

  const { isLoading, getUserById } = useGetUserById();
  const { isLoading: isLoadingUpdate, updateUser } = useUpdateProfile();
  const router = useRouter();

  async function onSubmit() {
    if (!userId) return;

    try {
      if (profile) {
        const { name, email, gender, phone, picture } = profile;
        await updateUser(userId, {
          name,
          email,
          gender: gender || '',
          phone: phone || '',
          picture: picture || ''
        });
      }
      setIsEditing(false);
      router.refresh();
      return;
    } catch {}
  }

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const userData = await getUserById(userId);
          setProfile(userData.data);
        } catch (error) {}
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div>
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && profile && (
            <div className="flex items-start gap-5 max-md:flex-col">
              <div className="relative aspect-square !h-32 !w-32">
                <Image
                  src={profile.picture || '/images/default.jpg'}
                  alt="avatar"
                  width={500}
                  height={500}
                  className="aspect-square !h-32 !w-32 rounded-full object-cover"
                />
                {isEditing && (
                  <CameraIcon className="absolute bottom-0 right-0 h-10 w-10 cursor-pointer rounded-full bg-white p-2.5 dark:bg-zinc-800" />
                )}
              </div>

              <div className="w-full space-y-3">
                <p className="text-xs font-bold">Name</p>
                <Input
                  className="disabled:cursor-default disabled:opacity-100"
                  defaultValue={profile.name}
                  placeholder="Name"
                  disabled={!isEditing}
                />
                <p className="text-xs font-bold">Email</p>
                <Input
                  className="disabled:cursor-default disabled:opacity-100"
                  defaultValue={profile.email}
                  placeholder="Email"
                  disabled={!isEditing}
                />
                <p className="text-xs font-bold">Gender</p>
                <Input
                  className="disabled:cursor-default disabled:opacity-100"
                  defaultValue={profile.gender || '-'}
                  placeholder="Gender"
                  disabled={!isEditing}
                />
                <p className="text-xs font-bold">Phone</p>
                <Input
                  className="disabled:cursor-default disabled:opacity-100"
                  defaultValue={profile.phone || '-'}
                  placeholder="Phone"
                  disabled={!isEditing}
                />

                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(!isEditing)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Button onClick={() => onSubmit()}>Save</Button>
                  )}
                  {isLoadingUpdate && (
                    <Button disabled>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
