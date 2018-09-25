import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faAngleDown, faAngleUp,
  faWindowClose } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import routes from './routes';

library.add(faPlusCircle, faAngleDown, faAngleUp, faWindowClose);

const App = () => (routes);

export default App;
