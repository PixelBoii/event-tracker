import { CashIcon, CheckIcon, XIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { useRouter } from 'next/router'
import prisma from '../lib/prisma'

import CreateInvoiceModal from '../components/CreateInvoiceModal'

export const getServerSideProps = async () => {
    function serializePrisma(records) {
        return JSON.parse(JSON.stringify(records));
    }

    const invoices = await prisma.invoice.findMany();

    return { props: serializePrisma({ invoices }) }
}

export default function Invoices({ invoices }) {
    let [modalIsOpen, setModalIsOpen] = useState(false);
    let router = useRouter();

    async function mark(invoice, status) {
        await fetch(`/api/invoices/${invoice.id}/status`, {
            method: 'POST',
            body: JSON.stringify({
                status
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        router.replace(router.asPath);
    }

    return (
        <div>
            <CreateInvoiceModal show={modalIsOpen} onClose={() => setModalIsOpen(false)} onSubmit={() => router.replace(router.asPath)} />

            <div className="p-6">
                <p className="text-gray-700 font-semibold text-xl"> Invoices </p>

                <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6">
                    <div className="py-8 px-16 rounded-md inline-flex flex-col items-center justify-center space-y-2 border border-gray-300 hover:bg-gray-50 transition shadow-sm cursor-pointer" onClick={() => setModalIsOpen(true)}>
                        <CashIcon className="text-gray-700 stroke-current h-10 w-10" />
                        <p className="text-gray-700 font-medium text-lg"> Create invoice </p>
                    </div>

                    { invoices.map(invoice => (
                        <div className="px-4 py-4 rounded-md border border-gray-300 shadow-sm space-y-1 flex flex-col justify-between" key={`invoice-${invoice.id}`}>
                            <div className="flex items-start justify-between px-1">
                                <div>
                                    <p className="text-gray-700 font-medium"> { invoice.name } </p>
                                    <p className="text-gray-500 font-medium text-sm"> { invoice.amount } { invoice.currency } </p>
                                </div>

                                <div className="space-y-1">
                                    <CashIcon className="text-gray-700 stroke-current h-5 w-5 cursor-pointer" onClick={() => mark(invoice, 'Paid')} />
                                    <CheckIcon className="text-gray-700 stroke-current h-5 w-5 cursor-pointer" onClick={() => mark(invoice, 'Sent')} />
                                    <XIcon className="text-gray-700 stroke-current h-5 w-5 cursor-pointer" onClick={() => mark(invoice, 'Created')} />
                                </div>
                            </div>

                            { invoice.status == 'Paid' ? (
                                <div className="bg-gradient-to-r from-green-400 to-green-500 py-1 px-3 rounded-md">
                                    <p className="text-white text-sm font-medium drop-shadow"> Has been paid </p>
                                </div>
                            ) : invoice.status == 'Sent' ? (
                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-1 px-3 rounded-md">
                                    <p className="text-white text-sm font-medium drop-shadow"> Has been sent </p>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-red-400 to-red-500 py-1 px-3 rounded-md">
                                    <p className="text-white text-sm font-medium drop-shadow"> Has not been sent </p>
                                </div>
                            )}
                        </div>
                    )) }
                </div>
            </div>
        </div>
    )
}