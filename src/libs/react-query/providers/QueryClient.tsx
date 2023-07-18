import { createContext, useCallback, useContext, useState } from 'react';
import { QueryResult } from '../hooks';

interface QueryClientContextProps {
	getQueryState: (id: string) => Pick<QueryResult<any, any>, 'loading' | 'error' | 'data'>;
	setQueryLoading: (id: string, loading: boolean) => void;
	setQueryError: (id: string, error: any | null) => void;
	setQueryData: (id: string, data: any | null) => void;
}

const QueryClientContext = createContext<QueryClientContextProps>(
	null as unknown as QueryClientContextProps
);

export const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [loadings, setLoadings] = useState<Record<string, boolean>>({});
	const [errors, setErrors] = useState<Record<string, any | null>>({});
	const [datas, setDatas] = useState<Record<string, any | null>>({});

	const getQueryState = useCallback(
		(id: string) => {
			return {
				loading: loadings?.[id] || false,
				error: errors?.[id] || null,
				data: datas?.[id] || null,
			};
		},
		[loadings, errors, datas]
	);

	const setQueryLoading = (id: string, loading: boolean) => {
		setLoadings((prev) => ({ ...prev, [id]: loading }));
	};

	const setQueryError = (id: string, error: any | null) => {
		setErrors((prev) => ({ ...prev, [id]: error }));
	};

	const setQueryData = (id: string, data: any | null) => {
		setDatas((prev) => ({ ...prev, [id]: data }));
	};

	return (
		<QueryClientContext.Provider
			value={{
				getQueryState,
				setQueryLoading,
				setQueryError,
				setQueryData,
			}}
		>
			{children}
		</QueryClientContext.Provider>
	);
};

export const useQueryClient = () => {
	if (!QueryClientContext) {
		throw new Error('useQueryClient must be used within a QueryClientProvider');
	}

	return useContext(QueryClientContext);
};
