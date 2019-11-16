import Component = Coveo.Component;
import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;

export interface ICollapseExpandAllFacetOptions {
  CollapseText: string;
  ExpandText: string;
  IsCollapsed: boolean;
}

export class CollapseExpandAllFacet extends Component {
  static ID = 'CollapseAll';

  static options: ICollapseExpandAllFacetOptions = {
    CollapseText: ComponentOptions.buildStringOption({ defaultValue: 'Collapse all' }),
    ExpandText: ComponentOptions.buildStringOption({ defaultValue: 'Expand all' }),
    IsCollapsed: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  /**
   * Create a new CollapseExpandAllFacet
   * @param element
   * @param options
   * @param bindings
   * @param result
   */

  public anchor: HTMLElement;
  constructor(public element: HTMLElement, public options: ICollapseExpandAllFacetOptions, bindings?: IComponentBindings) {
    super(element, CollapseExpandAllFacet.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CollapseExpandAllFacet, options);
    this.init();
  }

  public init() {
    this.anchor = Coveo.$$('a', {class:"collapse-all-link"}, this.options.CollapseText).el;
    Coveo.$$(this.element).append(this.anchor);
    Coveo.$$(this.element).on('click', () => this.options.IsCollapsed ? this.expandAll() : this.collapseAll());

    // If isCollapsed has been set to true, collapse all facets on init
    if (this.options.IsCollapsed) {
        this.collapseAll();
    }
  }

  public expandAll() {
    _.each(document.querySelectorAll('.CoveoFacet'), function(facet) {
        let facetObject: Coveo.Facet = <Coveo.Facet>Coveo.get(<HTMLElement>facet, Coveo.Facet);
        facetObject.expand();
    });

    this.anchor.textContent = this.options.CollapseText;
    this.options.IsCollapsed = !this.options.IsCollapsed;
  }

  public collapseAll() {
    _.each(document.querySelectorAll('.CoveoFacet'), function(facet) {
        let facetObject: Coveo.Facet = <Coveo.Facet>Coveo.get(<HTMLElement>facet, Coveo.Facet);
        facetObject.collapse();
    });

    this.anchor.textContent = this.options.ExpandText;
    this.options.IsCollapsed = !this.options.IsCollapsed;
  }
}

Initialization.registerAutoCreateComponent(CollapseExpandAllFacet);
