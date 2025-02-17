'use server'

import { ReserveKitClient } from '@/providers/reservekit'
import { CreateBookingPayload } from 'reservekitjs'

export async function createBooking(bookingDetails: CreateBookingPayload) {
	try {
		const reservekitClient = ReserveKitClient()
		await reservekitClient.initService(1)

		const data = await reservekitClient.service?.createBooking(bookingDetails)

		return data
	} catch (error) {
		console.error(error)
		return { error }
	}
}
