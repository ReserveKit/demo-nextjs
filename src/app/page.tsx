import Booking from '@/components/features/booking'

const getService = async (serviceId: number) => {
	const res = await fetch(`${process.env.API_URL}/services/${serviceId}`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
	})
	const data = await res.json()
	return data
}

const getTimeslots = async (serviceId: number) => {
	const res = await fetch(
		`${process.env.API_URL}/time-slots?service_id=${serviceId}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		},
	)
	const data = await res.json()
	return data
}

export default async function Home() {
	const { data, error } = await getService(1)
	if (error) {
		console.error(error)
	}

	const { data: timeslots, error: timeslotsError } = await getTimeslots(1)
	if (timeslotsError) {
		console.error(timeslotsError)
	}
	const { time_slots, pagination } = timeslots
	console.log(timeslots)
	return <Booking service={data} timeslots={time_slots} />
}
