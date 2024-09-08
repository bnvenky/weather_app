
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CitiesTable from './components/CitiesTable';
import WeatherPage from './components/WeatherPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<CitiesTable/>} />
        <Route path="/weather/:cityName" element={<WeatherPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
