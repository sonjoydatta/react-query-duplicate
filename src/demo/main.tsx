import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '../libs/react-query';
import App from './App.tsx';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider>
		<App />
	</QueryClientProvider>
);
