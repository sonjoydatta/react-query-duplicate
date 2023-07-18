import { DebouncedFunc } from 'lodash';

export interface QueryArgs<T, S, K> {
	fn: () => Promise<T>;
	deps?: K extends number ? never : S;
	delay?: S extends any[] ? never : K;
	immediate?: boolean;
	onSuccess?: (data: T) => void;
	onError?: (error: any) => void;
	onFinal?: () => void;
}

interface QueryResultBase<T> {
	loading: boolean;
	error: any | null;
	data: T | null;
	refetch: () => Promise<void>;
}

interface QueryResultWithLazy<T> extends QueryResultBase<T> {
	refetchLazy: DebouncedFunc<() => Promise<void>>;
}

export type QueryResult<T, S> = S extends undefined ? QueryResultWithLazy<T> : QueryResultBase<T>;
