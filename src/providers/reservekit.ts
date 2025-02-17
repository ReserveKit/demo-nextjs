import { ReserveKit } from 'reservekitjs'

export const ReserveKitClient = () => {
	const reservekitClient = new ReserveKit(process.env.API_KEY as string)

	return reservekitClient
}
