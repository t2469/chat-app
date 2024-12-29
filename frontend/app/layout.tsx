import './globals.css'
import {AuthProvider} from '@/context/AuthContext';
import Layout from '../components/Layout/Layout';

export const metadata = {
    title: 'DiscordLikeApp',
    description: 'A Discord-like real-time chat application',
}

const RootLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <html lang="ja">
        <body>
        <AuthProvider>
            <Layout>{children}</Layout>
        </AuthProvider>
        </body>
        </html>
    );
};

export default RootLayout;
