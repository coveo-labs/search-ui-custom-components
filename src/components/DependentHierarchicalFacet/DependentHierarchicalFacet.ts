import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import IFacetOptions = Coveo.IFacetOptions;

export interface IDependentHierarchicalFacetOptions extends IFacetOptions {
  facetValueDelimiter?: string;
  dependsOn: string;
}

declare const require: (module: string) => any;
require('./DependentHierarchicalFacet.scss');

export class DependentHierarchicalFacet extends Coveo.Facet {
  static ID = 'DependentHierarchicalFacet';

  static options: IDependentHierarchicalFacetOptions = {
    facetValueDelimiter: ComponentOptions.buildStringOption(),
    dependsOn: ComponentOptions.buildStringOption()
  };

  constructor(public element: HTMLElement, public options: IDependentHierarchicalFacetOptions, public bindings?: IComponentBindings) {
    super(
      element,
      ComponentOptions.initComponentOptions(element, DependentHierarchicalFacet, options),
      bindings,
      DependentHierarchicalFacet.ID
    );
    this.options.allowedValues = [];
  }

  private getParentValues(): string[] {
    const id = Coveo.QueryStateModel.getFacetId(this.options.dependsOn);
    return this.queryStateModel.get(id);
  }

  handleDoneBuildingQuery(data: Coveo.IDoneBuildingQueryEventArgs) {
    const _self = this;
    _self.options.allowedValues = [];
    const queryBuilder = data.queryBuilder;
    const parentFacetSelectedValues: string[] = this.getParentValues();
    if (parentFacetSelectedValues.length > 0) {
      _.each(parentFacetSelectedValues, function addAllowedValue(val: string) {
        if (_self.options.allowedValues) {
          _self.options.allowedValues.push(val + '*');
        }
      });
    }
    this.facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
  }

  public getValueCaption(facetValue: any): string {
    let ret = super.getValueCaption(facetValue);
    // Only display last part of the multi-levels facet values
    if (typeof this.options.facetValueDelimiter !== undefined && ret.indexOf(this.options.facetValueDelimiter || '|') > -1) {
      const retArray = ret.split(this.options.facetValueDelimiter || '|');
      ret = retArray[retArray.length - 1];
    }
    return ret;
  }
}
Initialization.registerAutoCreateComponent(DependentHierarchicalFacet);
