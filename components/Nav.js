import { CalendarIcon, CashIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next//router'

export default function Nav() {
    const router = useRouter();

    return (
        <div className="w-72 bg-gray-100 h-screen fixed left-0 top-0">
            <div className="flex justify-center items-center py-6 text-gray-700 space-x-2">
                <p className="font-bold text-xl"> Event Tracker </p>
            </div>

            <Link href="/">
                <a className={`flex justify-center items-center p-4 text-gray-700 space-x-2 ${router.pathname == '/' && 'bg-gray-200'}`}>
                    <CalendarIcon className="stroke-current h-5 w-5" />
                    <p className="font-bold"> Calendar </p>
                </a>
            </Link>

            <Link href="/invoices">
                <a className={`flex justify-center items-center p-4 text-gray-700 space-x-2 ${router.pathname == '/invoices' && 'bg-gray-200'}`}>
                    <CashIcon className="stroke-current h-5 w-5" />
                    <p className="font-bold"> Invoices </p>
                </a>
            </Link>
        </div>
    )
}