'use client';
import { useChangePassword } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChangePassPage = () => {
    const session = useSession();

    const userId = session?.data?.user.id;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChanging, setIsChanging] = useState(false);
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { error, isLoading, changePassword } = useChangePassword();

    const validate = () => {
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Confirm Passwords do not match';
        }

        setErrors(newErrors);

        return (
            !newErrors.currentPassword &&
            !newErrors.newPassword &&
            !newErrors.confirmPassword
        );
    };

    async function onSubmit() {
        if (!userId || !validate()) return;

        try {
            setIsChanging(true);
            await changePassword(userId, currentPassword, newPassword);
            setIsChanging(false);
            Swal.fire({
                title: 'Success!',
                text: 'Password changed successfully',
                icon: 'success',
                confirmButtonText: 'Close'
            });
            window.location.reload();
        } catch {
            Swal.fire({
                title: 'Error!',
                text: 'Error changing password',
                icon: 'error',
                confirmButtonText: 'Close'
            });
            setIsChanging(false);
        }
    }

    return (
        <div>
            <Card className="mx-auto w-full">
                <CardHeader>
                    <CardTitle className="text-left text-2xl font-bold">
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <p className="text-xs font-bold">Current Password</p>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                        />
                        {errors.currentPassword && (
                            <p className="text-xs font-bold text-red-500">
                                {errors.currentPassword}
                            </p>
                        )}

                        <p className="text-xs font-bold">New Password</p>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                        />
                        {errors.newPassword && (
                            <p className="text-xs font-bold text-red-500">
                                {errors.newPassword}
                            </p>
                        )}

                        <p className="text-xs font-bold">
                            Confirm New Password
                        </p>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs font-bold text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}

                        {error && (
                            <p className="text-xs font-bold text-red-500">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-3">
                            {!isChanging && !isLoading ? (
                                <Button onClick={() => onSubmit()}>
                                    Change Password
                                </Button>
                            ) : (
                                <Button disabled>
                                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                                    Loading...
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePassPage;
