declare global {
  interface Window {
    [propName: string]: any;
  }
}

import './Components';
//Removed, will create a conflict when changing the Endpoint on-premise
//import { doInitialization } from './Initialization';
//doInitialization();
