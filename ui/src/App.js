import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import TicTacToe from '../src/components/tictactoe/tictactoe';

function App() {
  return (
    <Router>

      {/* <Route path='/' exact render={(props) => <TicTacToe room={room} {...props} />} /> */}
      <Route exact path='/' component={TicTacToe} />
      {/* <Route path='/:game/:room' component={Chat} /> */}
    </Router>
  );
}

export default App;
