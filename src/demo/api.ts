interface Params {
	search: string;
	skip?: number;
	limit?: number;
}

export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	discountPercentage: number;
	rating: number;
	stock: number;
	brand: string;
	category: string;
	thumbnail: string;
	images: string[];
}

export interface ProductList {
	products: Product[];
	total: number;
	skip: number;
	limit: number;
}

export const getProducts = async ({ search, skip, limit }: Params) => {
	const url = new URL('https://dummyjson.com/products/search');
	url.searchParams.append('q', search);
	if (skip) {
		url.searchParams.append('skip', skip.toString());
	}
	if (limit) {
		url.searchParams.append('limit', limit.toString());
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(response.statusText);
	}

	return (await response.json()) as ProductList;
};
