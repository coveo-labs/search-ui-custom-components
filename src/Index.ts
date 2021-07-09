declare global {
  interface Window {
    [propName: string]: any;
  }
}
require('./Index.scss');

import './Components';
import { doInitialization } from './Initialization';
doInitialization();
