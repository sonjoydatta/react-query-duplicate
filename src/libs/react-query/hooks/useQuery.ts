/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce, DebouncedFunc } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

interface QueryArgs<T, S, K> {
	fn: () => Promise<T>;
	deps?: K extends number ? never : S;
	delay?: S extends any[] ? never : K;
	immediate?: boolean;
	onSuccess?: (data: T) => void;
	onError?: (error: any) => void;
	onFinal?: () => void;
}

type QueryResult<T, S> = {
	loading: boolean;
	error: any | null;
	data: T | null;
	refetch: () => Promise<void>;
} & (S extends undefined
	? {
			refetchLazy: DebouncedFunc<() => Promise<void>>;
	  }
	: {});

export const useQuery = <
	T extends any = any,
	S extends any[] | undefined = undefined,
	K extends number | undefined = undefined,
>(
	args: QueryArgs<T, S, K>
) => {
	const { fn, deps = [], delay = 300, immediate = true, onSuccess, onError, onFinal } = args;
	const [loading, setLoading] = useState(immediate || false);
	const [error, setError] = useState<any | null>(null);
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
		}, delay),
		[delay]
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

	const results = {
		loading,
		error,
		data,
		refetch: execute,
	};

	if (!deps?.length) {
		(results as any).refetchLazy = executeWithDebounce;
	}

	return results as QueryResult<T, S>;
};
