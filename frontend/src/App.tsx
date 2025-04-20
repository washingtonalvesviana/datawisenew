import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import './styles/theme.css';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;