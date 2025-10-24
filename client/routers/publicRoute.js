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
                router.push('/admin')
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

// import { useContext, useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
// import AppContext from "../context/AppContext";

// // SSR-safe dynamic import for ContentLoader
// const ContentLoader = dynamic(() => import("../components/ContentLoader"), { ssr: false });

// const publicRoute = (Component) => {
//   const Auth = (props) => {
//     const { user } = useContext(AppContext);
//     const router = useRouter();
//     const [redirecting, setRedirecting] = useState(false);

//     useEffect(() => {
//       if (user?.id && !redirecting) {
//         setRedirecting(true); // prevent multiple pushes
//         if (user.type === "admin") {
//           router.replace("/admin/dashboard");
//         } else {
//           router.replace("/dashboard");
//         }
//       }
//     }, [user, redirecting, router]);

//     if (user?.id || redirecting) {
//       // Show loader while redirecting
//       return <ContentLoader />;
//     }

//     // User not logged in — render the page normally
//     return <Component {...props} />;
//   };

//   if (Component.getInitialProps) {
//     Auth.getInitialProps = Component.getInitialProps;
//   }

//   return Auth;
// };

// export default publicRoute;
