import { Dialog, Transition } from '@headlessui/react'
import { Fragment, Component } from 'react'

export default class CreateInvoiceModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            name: '',
            amount: 0,
            currency: 'USD'
        };

        this.submit = this.submit.bind(this);
    }

    async submit() {
        await fetch('/api/invoices', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                amount: this.state.amount,
                currency: this.state.currency,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        this.props.onSubmit();
        this.props.onClose();
    }

    render() {
        return (
            <Transition show={this.props.show}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={this.props.onClose}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                        &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-lg p-7 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Create Invoice
                                </Dialog.Title>

                                <div className="grid grid-cols-6 gap-6 my-4">
                                    <div className="col-span-6">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={this.state.name}
                                            onChange={(e) => this.setState({ name: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>

                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-20 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="0.00"
                                                step="0.1"
                                                value={this.state.amount}
                                                onChange={(e) => this.setState({ amount: e.target.value })}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                <label htmlFor="currency" className="sr-only">
                                                    Currency
                                                </label>
                                                <select
                                                    id="currency"
                                                    name="currency"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                                    value={this.state.currency}
                                                    onChange={(e) => this.setState({ currency: e.target.value })}
                                                >
                                                    <option>SEK</option>
                                                    <option>USD</option>
                                                    <option>CAD</option>
                                                    <option>EUR</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={this.submit}
                                    >
                                        All done, create it!
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        )
    }
}