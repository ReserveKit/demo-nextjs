'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Clock, Globe, ArrowLeft, MonitorSmartphone } from 'lucide-react'
import { createBooking } from '@/app/actions'
import { CreateBookingPayload, IService, ITimeSlot } from 'reservekitjs'
import { formatInTimeZone } from 'date-fns-tz'

interface BookingDetails {
	date?: string
	time_slot_id?: number
	customer_name?: string
	customer_email?: string
	customer_phone?: string
}

export default function Booking({
	service,
	timeslots,
}: {
	service: Pick<IService, 'name' | 'description' | 'timezone'>
	timeslots: ITimeSlot[]
}) {
	const [step, setStep] = useState(1)
	const [bookingDetails, setBookingDetails] = useState<BookingDetails>({})
	const [filteredTimeslots, setFilteredTimeslots] = useState<ITimeSlot[]>([])

	useEffect(() => {
		setFilteredTimeslots(
			timeslots.filter(
				timeSlot =>
					timeSlot.day_of_week ===
					new Date(bookingDetails.date as unknown as Date).getDay() - 1,
			),
		)
	}, [timeslots, bookingDetails.date])

	const handleDateSelect = (date: string | undefined) => {
		if (date) {
			setBookingDetails(prev => ({ ...prev, date }))
		}
	}

	const handleTimeSelect = (time: number) => {
		setBookingDetails(prev => ({ ...prev, time_slot_id: time }))
		setStep(3)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Handle form submission
		const data = await createBooking(bookingDetails as CreateBookingPayload)

		if (!(data as { error: unknown }).error) {
			alert('Booking created successfully')
		} else {
			alert((data as { error: unknown }).error)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="grid md:grid-cols-[350px,1fr]">
						{/* Sidebar */}
						<div className="p-6 border-r border-gray-200">
							{step > 1 && (
								<Button
									variant="ghost"
									className="mb-4"
									onClick={() => setStep(step - 1)}
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back
								</Button>
							)}
							<h2 className="text-gray-500 text-sm">ReserveKit</h2>
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								{service.name}
							</h1>

							<div className="flex items-start space-x-3 text-gray-600 mb-3">
								<Clock className="w-5 h-5 mt-0.5" />
								<span>30 min</span>
							</div>

							<div className="flex items-start space-x-3 text-gray-600 mb-3">
								<MonitorSmartphone className="w-5 h-5 mt-0.5" />
								<span>
									Web conferencing details provided upon confirmation.
								</span>
							</div>

							{bookingDetails.date && bookingDetails.time_slot_id && (
								<div className="flex items-start space-x-3 text-gray-600 mt-6 pt-6 border-t">
									<Clock className="w-5 h-5 mt-0.5" />
									<div>
										<p>{format(bookingDetails.date, 'EEEE, MMMM d, yyyy')}</p>
										<p>
											{formatInTimeZone(
												new Date(
													filteredTimeslots.find(
														timeslot =>
															timeslot.id === bookingDetails.time_slot_id,
													)?.start_time || new Date(),
												),
												service.timezone as string,
												'h:mm a',
											)}
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Main Content */}
						<div className="p-6">
							{step === 1 && (
								<div>
									<h2 className="text-xl font-semibold mb-4">
										Select a Date & Time
									</h2>
									<div className="flex flex-col md:flex-row gap-6">
										<div className="flex-1">
											<Calendar
												mode="single"
												selected={
													bookingDetails.date
														? new Date(bookingDetails.date)
														: undefined
												}
												onSelect={date =>
													date && handleDateSelect(format(date, 'yyyy-MM-dd'))
												}
												className="rounded-md border"
											/>
											<div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
												<Globe className="w-4 h-4" />
												<span>{service.timezone as string}</span>
											</div>
										</div>

										{bookingDetails.date && (
											<div className="flex-1">
												<div className="grid gap-2">
													{filteredTimeslots.map(time => (
														<Button
															key={time.id}
															variant="outline"
															className="justify-start h-12 px-4"
															onClick={() => handleTimeSelect(time.id)}
														>
															{formatInTimeZone(
																time.start_time,
																service.timezone as string,
																'h:mm a',
															)}{' '}
															-{' '}
															{formatInTimeZone(
																time.end_time,
																service.timezone as string,
																'h:mm a',
															)}
														</Button>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							)}

							{step === 3 && (
								<div>
									<h2 className="text-xl font-semibold mb-4">Enter Details</h2>
									<form onSubmit={handleSubmit} className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Name
											</label>
											<Input
												required
												value={bookingDetails.customer_name || ''}
												onChange={e =>
													setBookingDetails(prev => ({
														...prev,
														customer_name: e.target.value,
													}))
												}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Email
											</label>
											<Input
												type="email"
												required
												value={bookingDetails.customer_email || ''}
												onChange={e =>
													setBookingDetails(prev => ({
														...prev,
														customer_email: e.target.value,
													}))
												}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Phone Number
											</label>
											<Input
												value={bookingDetails.customer_phone || ''}
												onChange={e =>
													setBookingDetails(prev => ({
														...prev,
														customer_phone: e.target.value,
													}))
												}
												type="tel"
											/>
										</div>

										<div className="text-sm text-gray-600">
											By proceeding, you confirm that you have read and agree to
											Calendly's{' '}
											<a href="#" className="text-blue-600 hover:underline">
												Terms of Use
											</a>{' '}
											and{' '}
											<a href="#" className="text-blue-600 hover:underline">
												Privacy Notice
											</a>
											.
										</div>

										<Button type="submit" className="w-full">
											Schedule Event
										</Button>
									</form>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
