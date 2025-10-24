import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ContentLoader from "../components/ContentLoader";

const privateAdminRoute = Component => {
    const Auth = (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const checkAdminAuth = () => {
                try {
                    const adminData = localStorage.getItem("admin");
                    if (adminData) {
                        const admin = JSON.parse(adminData);
                        if (admin.token && admin.token.trim() !== '') {
                            setIsAuthenticated(true);
                        } else {
                            localStorage.removeItem("admin");
                            router.push('/adminlogin');
                        }
                    } else {
                        router.push('/adminlogin');
                    }
                } catch (error) {
                    console.error('Error checking admin authentication:', error);
                    localStorage.removeItem("admin");
                    router.push('/adminlogin');
                } finally {
                    setLoading(false);
                }
            };

            checkAdminAuth();
        }, [router]);

        if (loading) {
            return <ContentLoader />;
        }

        if (!isAuthenticated) {
            return <ContentLoader />;
        }

        return (
            <Component {...props} />
        );
    };

    if (Component.getInitialProps) {
        Auth.getInitialProps = Component.getInitialProps;
    }

    return Auth;
};

export default privateAdminRoute;
