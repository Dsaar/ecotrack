// src/shared/hooks/useInView.js
import { useEffect, useState } from "react";

export default function useInView(ref, options = {}) {
	const [inView, setInView] = useState(false);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect(); // only need it once
				}
			},
			{
				threshold: 0.1,
				...options,
			}
		);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [ref, options.root, options.rootMargin, options.threshold]);

	return inView;
}
