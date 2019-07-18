import { Utils } from 'coveo-search-ui';

export const doInitialization = () => {
  document.addEventListener('DOMContentLoaded', () => {
    
    const searchInterfaceEl = document.querySelector('#search');

    if (searchInterfaceEl) {
      let searchInterface: HTMLElement;

      if (Utils.isHtmlElement(searchInterfaceEl)) {
        searchInterface = searchInterfaceEl as HTMLElement;
      } else {
        throw new TypeError('#MainSearchInterface must be an HTMLElement');
      }

      Coveo.SearchEndpoint.configureSampleEndpointV2();
      Coveo.init(searchInterface, {
        CustomContext: {
          context: {
            'patate':'poil',
            'frite': 'cuite'
          }
        }
      });
    }
  });
};
