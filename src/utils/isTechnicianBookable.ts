type BookableTechnician = {
	user: {
		name: string;
		photoUrl: string | null;
		phone: string | null;
	};
	dob: Date | null;
	location: string | null;
	isOnVacation: boolean;
	services: readonly unknown[];
	availabilitySlots: readonly unknown[];
};

export const isTechnicianBookable = (
	technician: BookableTechnician,
): boolean => {
	const isProfileComplete =
		!!technician.user.name &&
		!!technician.user.photoUrl &&
		!!technician.user.phone &&
		!!technician.dob &&
		!!technician.location;

	return (
		isProfileComplete &&
		technician.services.length > 0 &&
		technician.availabilitySlots.length > 0 &&
		!technician.isOnVacation
	);
};
