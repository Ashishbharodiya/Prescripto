import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './Redux/Store/store';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <CookiesProvider>
    <App />
    </ CookiesProvider>
  </Provider>,
)
