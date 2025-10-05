import { useContext } from "react";
import AppContext from "../context/AppContext";
import { useRouter } from 'next/router'
import ContentLoader from "../components/ContentLoader";

const publicRoute = Component => {
    const Auth = (props) => {
        const { user } = useContext(AppContext);
        const router = useRouter();
        if (user?.id) {
            if(user.type === 'admin') {
                router.push('/admin/dashboard')
            } else {
                router.push('/dashboard')
            }
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

export default publicRoute;