import Booking from '@/components/features/booking'
import { ReserveKitClient } from '@/providers/reservekit'

export default async function Home() {
	const reservekitClient = ReserveKitClient()

	await reservekitClient.initService(1)

	const serviceDetails = {
		name: reservekitClient.service?.name || '',
		description: reservekitClient.service?.description || '',
		timezone: reservekitClient.service?.timezone || '',
	}

	const timeslots = await reservekitClient.service?.getTimeSlots()

	return <Booking service={serviceDetails} timeslots={timeslots || []} />
}
