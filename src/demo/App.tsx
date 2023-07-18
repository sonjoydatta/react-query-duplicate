import { useState } from 'react';
import { useQuery } from '../libs/react-query';
import { getProducts } from './api';

const App = () => {
	const [search, setSearch] = useState('laptop');

	const { loading, error, data, refetch } = useQuery({
		fn: () => getProducts({ search }),
		deps: [search],
		// delay: 500,
		// immediate: false
	});

	return (
		<div className='app'>
			<div className='app-header'>
				<input
					type='text'
					placeholder='Search for a product'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						// refetchLazy();
					}}
				/>
				<button onClick={refetch}>Search</button>
			</div>
			<div className='app-body'>
				{loading && <div>Loading...</div>}
				{error && <div>Error: {error?.message}</div>}
				{data?.products && Array.isArray(data.products) && data.products.length > 0 ? (
					<div className='product-list'>
						{data.products.map((product) => (
							<div className='product' key={product.id}>
								<h3>{product.title}</h3>
								<p>{product.description}</p>
								<h2>$ {product.price}</h2>
								<img src={product.thumbnail} alt={product.title} />
							</div>
						))}
					</div>
				) : (
					<div>No products found</div>
				)}
			</div>
		</div>
	);
};

export default App;
