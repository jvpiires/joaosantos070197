import './App.css';
import { HomePage } from './pages/home/HomePage';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
        <Toaster richColors position="top-right" /> 
        <HomePage />
    </>
  );
}
export default App;