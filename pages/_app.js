import 'tailwindcss/tailwind.css'
import Nav from '../components/nav.js'

function MyApp({ Component, pageProps }) {
    return (
        <div className="pl-72">
            <Nav />

            <Component {...pageProps} />
        </div>
    )
}

export default MyApp
