// src/features/auth/helpers/validateRegisterForm.js

export default function validateRegisterForm(form) {
	if (!form.firstName || form.firstName.trim().length < 2) {
		return "First name must be at least 2 characters.";
	}

	if (!form.lastName || form.lastName.trim().length < 2) {
		return "Last name must be at least 2 characters.";
	}

	if (!form.email) {
		return "Email is required.";
	}

	if (!form.password) {
		return "Password is required.";
	}

	if (form.password !== form.confirmPassword) {
		return "Passwords do not match.";
	}

	if (!form.country || form.country.trim().length < 2) {
		return "Country is required.";
	}

	if (!form.city || form.city.trim().length < 2) {
		return "City must be at least 2 characters.";
	}

	if (!form.street || form.street.trim().length < 2) {
		return "Street must be at least 2 characters.";
	}

	if (!form.houseNumber) {
		return "House number is required.";
	}

	const houseNumberNum = Number(form.houseNumber);
	if (Number.isNaN(houseNumberNum)) {
		return "House number must be a number.";
	}

	return null; // no error
}
