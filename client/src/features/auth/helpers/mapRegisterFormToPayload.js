
export default function mapRegisterFormToPayload(form) {
	return {
		name: {
			first: form.firstName.trim(),
			middle: form.middleName.trim(),
			last: form.lastName.trim(),
		},
		phone: form.phone.trim(),
		email: form.email.trim(),
		password: form.password,
		avatarUrl: {
			url: (form.avatarUrl || "").trim(),
			alt: (form.avatarAlt || "").trim() || "User avatar",
		},
		address: {
			state: (form.state || "").trim(),
			country: (form.country || "").trim(),
			city: (form.city || "").trim(),
			street: (form.street || "").trim(),
			houseNumber: Number(form.houseNumber),
			zip: form.zip ? Number(form.zip) : undefined,
		},
	};
}
