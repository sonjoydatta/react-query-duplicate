/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce, uniqueId } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '../providers';
import { QueryArgs, QueryResult } from './types';

export const useQuery = <
	T extends any = any,
	S extends any[] | undefined = undefined,
	K extends number | undefined = undefined,
>(
	args: QueryArgs<T, S, K>
): QueryResult<T, S> => {
	const { fn, deps = [], delay = 300, immediate = true, onSuccess, onError, onFinal } = args;
	const { getQueryState, setQueryLoading, setQueryError, setQueryData } = useQueryClient();
	const executeRef = useRef<() => Promise<void>>();
	const uniqueIdRef = useRef<string>(uniqueId('query_'));
	const id = uniqueIdRef.current;

	const execute = useCallback(async () => {
		setQueryLoading(id, true);
		setQueryError(id, null);

		try {
			const res = await fn();
			setQueryData(id, res);
			onSuccess?.(res);
		} catch (error) {
			setQueryError(id, error);
			onError?.(error);
		} finally {
			setQueryLoading(id, false);
			onFinal?.();
		}
	}, [fn, id, onFinal, onError, onSuccess, setQueryData, setQueryError, setQueryLoading]);

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
		...getQueryState(id),
		refetch: execute,
	};

	if (!deps?.length) {
		(results as any).refetchLazy = executeWithDebounce;
	}

	return results as QueryResult<T, S>;
};
