import { useState } from 'react'
import { useRouter } from 'next//router'
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/outline'
import { Transition, Popover } from '@headlessui/react'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import CreateShiftModal from '../components/CreateShiftModal'
import prisma from '../lib/prisma'

dayjs.extend(advancedFormat);

export const getServerSideProps = async (req) => {
    function serializePrisma(records) {
        return JSON.parse(JSON.stringify(records));
    }

    const events = await prisma.calendarEvent.findMany();

    return { props: serializePrisma({ calendarEvents: events }) }
}

export default function Home({ calendarEvents }) {
    let [isOpen, setIsOpen] = useState(false);
    let [showMonthModal, setShowMonthModal] = useState(false);
    let [startDate, setStartDate] = useState(dayjs().startOf('month'));
    let [selectedDate, setSelectedDate] = useState(dayjs());
    let router = useRouter();

    let dates = [];

    function openModalForDate(date) {
        setSelectedDate(date);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function popoverStyle(index) {
        let normalized = index % 7;
        let percentage = normalized / 6 * 100;

        if (percentage > 50) {
            return { right: 0 };
        } else {
            return { left: 0 };
        }
    }

    async function deleteCalendarEvent(event) {
        await fetch('/api/calendar-events', {
            method: 'DELETE',
            body: JSON.stringify({
                id: event.id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        router.replace(router.asPath);
    }

    function calendarCategories() {
        return Object.values(calendarEvents.filter((e) => startDate.isSame(e.startsAt, 'month')).reduce((categories, event) => {
            if (categories[event.name]) {
                categories[event.name].totalHours += dayjs(event.endsAt).diff(event.startsAt, 'hours');
            } else {
                categories[event.name] = {
                    totalHours: dayjs(event.endsAt).diff(event.startsAt, 'hours'),
                    name: event.name,
                    color: event.color
                }
            }

            return categories;
        }, {}))
    }

    for (var i = 0; i < 35; i++) {
        dates.push(startDate.startOf('week').add(i, 'day'));
    }

    return (
        <>
            <CreateShiftModal show={isOpen} onClose={closeModal} onSubmit={() => router.replace(router.asPath)} date={selectedDate} />

            <div className="flex flex-col h-screen w-full">
                <div className="flex items-center justify-between">
                    <div className="relative p-6" onMouseEnter={() => setShowMonthModal(true)} onMouseLeave={() => setShowMonthModal(false)}>
                        <p className="text-gray-700 font-semibold text-xl"> Calendar, { startDate.format('MMMM YYYY') } </p>

                        <Transition
                            show={showMonthModal}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <div className="absolute mt-2 z-10 w-96 bg-white border border-gray-300 shadow-sm rounded-md p-6">
                                {calendarCategories().map(category => (
                                    <div className="flex items-center justify-between" key={`category-${category.name}`}>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-10 p-2 rounded-md" style={{ backgroundColor: category.color }}></div>
                                            <p className="text-gray-700 font-medium text-sm"> { category.name } </p>
                                        </div>

                                        <p className="text-gray-500 font-medium text-sm"> { category.totalHours } hours </p>
                                    </div>
                                ))}

                                {calendarCategories().length == 0 && (
                                    <p className="text-gray-700"> There's no events for this month. </p>
                                )}
                            </div>
                        </Transition>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-700 p-6">
                        <div className="hover:bg-gray-100 rounded-full transition p-2" onClick={() => setStartDate(startDate.subtract(1, 'month').startOf('month'))}>
                            <ChevronLeftIcon className="stroke-current h-5 w-5" />
                        </div>

                        <div className="hover:bg-gray-100 rounded-full transition p-2" onClick={() => setStartDate(startDate.add(1, 'month').startOf('month'))}>
                            <ChevronRightIcon className="stroke-current h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-7 grid-rows-5 flex-grow">
                    { dates.map((date, dateIndex) => (
                    <div className="w-full h-full border border-gray-100 hover:bg-gray-50 text-center py-5 px-3 transition duration-100 cursor-pointer" key={`calendar-date-${date}`} onClick={() => openModalForDate(date)}>
                        <div>
                            { i < 7 && (
                                <p className="text-gray-700 text-sm font-medium"> { date.format('ddd') } </p>
                            ) }

                            <p className="mt-1"> { date.format('DD') } </p>
                        </div>

                        <div className="mt-2 space-y-1">
                            { calendarEvents.map((event) => (
                            <Transition
                                enter="transition-opacity duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                key={`event-${event.id}-${startDate}`}
                                appear
                                show={date.isSame(event.startsAt, 'day')}
                            >
                                <Popover className="relative cursor-auto" onClick={(e) => e.stopPropagation()}>
                                    {({ open }) => (
                                    <>
                                        <Popover.Button className="bg-indigo-500 w-full py-1 px-3 rounded-md text-left leading-[0] relative focus:outline-none">
                                            <span className="text-white text-xs capitalize font-medium"> { event.name } </span>
                                        </Popover.Button>

                                        <Transition
                                            enter="transition ease-out"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition duration-300 ease-out"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Popover.Overlay
                                                className={`${
                                                open ? 'opacity-10 fixed inset-0' : 'opacity-0'
                                                } bg-black`}
                                            />
                                        </Transition>

                                        <Transition
                                            enter="transition duration-100 ease-out"
                                            enterFrom="transform scale-95 opacity-0"
                                            enterTo="transform scale-100 opacity-100"
                                            leave="transition duration-75 ease-out"
                                            leaveFrom="transform scale-100 opacity-100"
                                            leaveTo="transform scale-95 opacity-0"
                                        >
                                            <Popover.Panel className="absolute z-10 w-96 px-4 mt-3 transform sm:px-0" style={ popoverStyle(dateIndex) }>
                                                <div className="overflow-hidden rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
                                                    <div className="relative bg-white px-4 py-3">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-gray-700 font-semibold"> { event.name } </p>
                                                            <p className="text-gray-500 font-medium text-sm"> { dayjs(event.startsAt).format('HH:mm') } - { dayjs(event.endsAt).format('HH:mm') } </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 border-t border-gray-200 px-3 py-1">
                                                        <div className="w-full p-1 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-md transition cursor-pointer" onClick={() => deleteCalendarEvent(event)}>
                                                            <TrashIcon className="h-4 w-4 stroke-current" />
                                                            <p className="font-medium text-sm"> Delete </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                    )}
                                </Popover>
                            </Transition>
                            )) }
                        </div>
                    </div>
                    )) }
                </div>
            </div>
        </>
    )
}
