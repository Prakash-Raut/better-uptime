"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
	threshold?: number;
	rootMargin?: string;
	triggerOnce?: boolean;
}

/**
 * Hook for scroll-triggered animations using Intersection Observer
 * Respects prefers-reduced-motion for accessibility
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
	options: UseScrollAnimationOptions = {},
) {
	const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<T>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			setIsVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					if (triggerOnce) {
						observer.unobserve(element);
					}
				} else if (!triggerOnce) {
					setIsVisible(false);
				}
			},
			{
				threshold,
				rootMargin,
			},
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [threshold, rootMargin, triggerOnce]);

	return { ref: elementRef, isVisible };
}
