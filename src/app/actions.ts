'use server'

export async function createBooking(bookingDetails: any) {
	const res = await fetch(`${process.env.API_URL}/bookings?service_id=1`, {
		method: 'POST',
		body: JSON.stringify(bookingDetails),
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
			'Content-Type': 'application/json',
		},
	})
	const data = await res.json()
	return data
}
