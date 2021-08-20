import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import App from "next/app";
import serverAxios from "../helpers/serverAxios";

function MyApp({ Component, pageProps, currentUser }) {
    const links = [
        !currentUser && {
            label: "Sign Up",
            href: "/auth/signup",
        },
        !currentUser && {
            label: "Sign In",
            href: "/auth/signin",
        },
        currentUser && {
            label: "Create Ticket",
            href: "/tickets/new",
        },
        currentUser && {
            label: "Orders",
            href: "/orders",
        },
        currentUser && {
            label: "Sign out",
            href: "/auth/signout",
        },
    ];

    return (
        <>
            <nav className="navbar navbar-expand px-4 py-2 bg-light">
                <div className="mr-auto">
                    <Link href="/">
                        <a className="navbar-brand h1 mb-0">GitTix</a>
                    </Link>
                </div>
                <div
                    className="collapse navbar-collapse justify-content-end"
                    id="navbarNav"
                >
                    <ul className="navbar-nav">
                        {links.map((link, i) => {
                            if (!link) return;

                            return (
                                <li className="nav-item" key={i}>
                                    <Link href={link.href}>
                                        <a className="nav-link">{link.label}</a>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
            <Component currentUser={currentUser} {...pageProps} />
        </>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const axios = serverAxios(appContext.ctx.req);
    let { data } = await axios.get("/api/users/currentuser");

    let appProps;

    // App is the current active Component
    if (App.getInitialProps) {
        appProps = await App.getInitialProps(appContext);
    }
    return { appProps, ...data };
};

export default MyApp;
