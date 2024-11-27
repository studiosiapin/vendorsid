import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import ProfilePage from '../profile-page';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Profile', link: '/dashboard/profile' }
];
export default function ProfileViewPage() {
    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <ProfilePage />
            </div>
        </PageContainer>
    );
}
