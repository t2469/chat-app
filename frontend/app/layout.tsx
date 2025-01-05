import './globals.css'
import {AuthProvider} from '@/context/AuthContext';

export const metadata = {
    title: 'DiscordLikeApp',
    description: 'A Discord-like real-time chat application',
}

const RootLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <html lang="ja">
        <body>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
};

export default RootLayout;
