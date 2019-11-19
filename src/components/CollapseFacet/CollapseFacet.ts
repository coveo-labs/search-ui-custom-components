import { $$, Facet, Initialization, Component, IComponentBindings, ComponentOptions } from 'coveo-search-ui';

import './CollapseFacet.scss';

export class CollapseFacet extends Component {
  static ID = 'CollapseFacet';

  constructor(public element: HTMLElement, public options: any, public bindings: IComponentBindings) {
    super(element, CollapseFacet.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CollapseFacet, options);
    // Init Events
    this.bind.onRootElement(Coveo.InitializationEvents.afterComponentsInitialization, this.handleBeforeInit);
  }

  private handleBeforeInit() {
    this.initializeCollapsibleFacets();
  }
  public toggleFacet(this: Facet) {
    if ($$(this.element).hasClass('coveo-facet-collapsed')) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private hookOnFacetCreation(handler: any) {
    const originalCreateDom = Coveo.Facet.prototype.createDom;
    Coveo.Facet.prototype.createDom = function(this: Facet) {
      originalCreateDom.call(this);
      handler.call(this);
    };
  }

  public initializeCollapsibleFacets() {
    var _this = this;
    this.hookOnFacetCreation(function(this: Facet) {
      if (this.element.dataset.easyCollapsible === 'true') {
        const facetElement = $$(this.element);
        facetElement.addClass('easy-collapse');
        const title = facetElement.findClass('coveo-facet-header')[0];
       
        $$(title).on('click', () => _this.toggleFacet.call(this));

        if (this.element.dataset.autoCollapse === 'true') {
          this.collapse();
        }
      }
    });
  }
}

Initialization.registerAutoCreateComponent(CollapseFacet);
