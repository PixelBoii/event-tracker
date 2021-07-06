import { Dialog, Transition } from '@headlessui/react'
import { Fragment, Component } from 'react'

export default class CreateShiftModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            name: '',
            startTime: '10:00',
            endTime: '18:00'
        };

        this.submit = this.submit.bind(this);
        this.setTimeOfDate = this.setTimeOfDate.bind(this);
    }

    setTimeOfDate(date, time) {
        var hours = Number(time.split(':')[0]);
        var minutes = Number(time.split(':')[1]);

        return date.minute(minutes).hour(hours);
    }

    async submit() {
        await fetch('/api/calendar-events', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                startsAt: this.setTimeOfDate(this.props.date, this.state.startTime),
                endsAt: this.setTimeOfDate(this.props.date, this.state.endTime)
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
            <Transition show={this.props.show} as={Fragment}>
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
                                    Add Event
                                </Dialog.Title>

                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        This event will be created for { this.props.date.format('Do MMMM') }
                                    </p>
                                </div>

                                <div className="grid grid-cols-6 gap-6 my-4">
                                    <div className="col-span-6 sm:col-span-3">
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

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="starting-time" className="block text-sm font-medium text-gray-700">
                                            Starting Time
                                        </label>

                                        <input
                                            type="time"
                                            name="starting-time"
                                            id="starting-time"
                                            value={this.state.startTime}
                                            onChange={(e) => this.setState({ startTime: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-6">
                                        <label htmlFor="ending-time" className="block text-sm font-medium text-gray-700">
                                            Ending Time
                                        </label>

                                        <input
                                            type="time"
                                            name="ending-time"
                                            id="ending-time"
                                            value={this.state.endTime}
                                            onChange={(e) => this.setState({ endTime: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
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