'use client';
import { useGetUserById, useUpdateProfile } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ProfileImageUploader from '@/components/profile-image-uploader';

const ProfilePage = () => {
    const session = useSession();

    const userId = useMemo(() => {
        if (session) {
            return session.data?.user.id;
        }
        return null;
    }, [session]);

    const [profile, setProfile] = useState<User>({
        id: '',
        name: '',
        email: '',
        password: '',
        role: '',
        phone: null,
        gender: null,
        picture: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    });
    const [isEditing, setIsEditing] = useState(false);

    const { isLoading, getUserById } = useGetUserById();
    const { isLoading: isLoadingUpdate, updateProfile } = useUpdateProfile();
    const router = useRouter();

    async function onSubmit() {
        if (!userId) return;

        try {
            if (profile) {
                const { name, email, role, gender, phone, picture } = profile;
                await updateProfile(userId, {
                    name,
                    email,
                    role: role || '',
                    gender: gender || '',
                    phone: phone || '',
                    picture: picture || ''
                });
            }
            setIsEditing(false);
            window.location.reload();
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
                                <ProfileImageUploader
                                    initialUrl={
                                        profile.picture || '/images/default.jpg'
                                    }
                                    onUpload={(imageUrl) =>
                                        setProfile({
                                            ...profile,
                                            picture: imageUrl
                                        })
                                    }
                                    isEditing={isEditing}
                                />
                            </div>

                            <div className="w-full space-y-3">
                                <p className="text-xs font-bold">Name</p>
                                <Input
                                    className="disabled:cursor-default disabled:opacity-100"
                                    value={profile.name}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            name: e.target.value
                                        })
                                    }
                                    placeholder="Name"
                                    disabled={!isEditing}
                                />
                                <p className="text-xs font-bold">Email</p>
                                <Input
                                    className="disabled:cursor-default disabled:opacity-100"
                                    value={profile.email}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            email: e.target.value
                                        })
                                    }
                                    placeholder="Email"
                                    disabled={!isEditing}
                                />
                                <p className="text-xs font-bold">Gender</p>
                                <Input
                                    className="disabled:cursor-default disabled:opacity-100"
                                    value={profile.gender || '-'}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            gender: e.target.value
                                        })
                                    }
                                    placeholder="Gender"
                                    disabled={!isEditing}
                                />
                                <p className="text-xs font-bold">Phone</p>
                                <Input
                                    className="disabled:cursor-default disabled:opacity-100"
                                    value={profile.phone || '-'}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            phone: e.target.value
                                        })
                                    }
                                    placeholder="Phone"
                                    disabled={!isEditing}
                                />

                                <div className="flex gap-3">
                                    {!isEditing && !isLoadingUpdate ? (
                                        <Button
                                            onClick={() =>
                                                setIsEditing(!isEditing)
                                            }
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <Button onClick={() => onSubmit()}>
                                            Save
                                        </Button>
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
