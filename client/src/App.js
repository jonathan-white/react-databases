import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faAngleDown, faAngleUp,
  faWindowClose, faKey } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import routes from './utils/routes';

library.add(faPlusCircle, faAngleDown, faAngleUp, faWindowClose, faKey);

const App = () => (routes);

export default App;
