/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseQueryArgs<T> {
	fn: () => Promise<T>;
	deps?: any[];
	immediate?: boolean;
	lazyDelay?: number;
	onSuccess?: (data: T) => void;
	onError?: (error: any) => void;
	onFinal?: () => void;
}

export const useQuery = <T = any>({
	fn,
	deps = [],
	immediate = true,
	lazyDelay = 300,
	onSuccess,
	onError,
	onFinal,
}: UseQueryArgs<T>) => {
	const [loading, setLoading] = useState(immediate || false);
	const [error, setError] = useState<any>(null);
	const [data, setData] = useState<T | null>(null);
	const executeRef = useRef<() => Promise<void>>();

	const execute = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await fn();
			setData(res);
			onSuccess?.(res);
		} catch (error) {
			setError(error);
			onError?.(error);
		} finally {
			setLoading(false);
			onFinal?.();
		}
	}, [fn, onError, onFinal, onSuccess]);

	useEffect(() => {
		executeRef.current = execute;

		return () => {
			executeRef.current = undefined;
		};
	}, [execute]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const executeWithDebounce = useCallback(
		debounce(async () => {
			if (!executeRef.current) return;
			await executeRef.current();
		}, lazyDelay),
		[lazyDelay]
	);

	// Call when immediate is true or dependencies change
	useEffect(() => {
		if (immediate) {
			execute();
		} else if (Array.isArray(deps) && deps.length > 0) {
			execute();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [immediate, ...deps]);

	return {
		loading,
		error,
		data,
		refetch: execute,
		refetchLazy: executeWithDebounce,
	};
};
