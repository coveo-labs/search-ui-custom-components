## Basic Usage

The DependentHierarchicalFacet component inherits all of its options and behaviors from the Facet component, but is meant to be used to render hierarchical values in multiple dependent facets. This component dynamically injects allowed values depending on the parent facet.

Use case: You have a Product structure with multiple levels. The documents can be linked to multiple products and you want to keep the relationship between all the levels and you have too many products or levels to use Coveo OOTB **HierarchicalFacet** for performance reasons.

Add the **CoveoDependentHierarchicalFacet** component in your page (coveo-facet-column).

```
<div class="CoveoDependentHierarchicalFacet" data-id="product2Facet" data-title="Product Category" data-depends-on="product1Facet" data-field="@commoniuxproductcategory2" data-enable-facet-search="true" data-enable-settings="false"></div>
```

Note: CoveoDependentHierarchicalFacet field needs the following format:

@fieldlevel1 (Coveo Facet): `Desktops & All-in-Ones`

@fieldlevel2 (Coveo DependentHierarchicalFacet): `Desktops & All-in-Ones|Chromebox;`

@fieldlevel3 (Coveo DependentHierarchicalFacet): `Desktops & All-in-Ones|Chromebox|ChromeBox For Meetings`

## Options

### delimiter : _string_

Specifies a delimiter for the different levels.

Default value is the string `|`.

Example: `data-delimiter='|'`

### dependsOn : _number_

Specifies whether this facet only appears when a value is selected in its "parent" facet.

To specify the parent facet, use its id.

Remember that by default, a facet id value is the same as its field option value.

Example:

```
      <!-- "Parent" Facet: Level 1 -->
      <div class="CoveoFacet" id="product1Facet" data-id="product1Facet" data-title="Product1Facet" data-number-of-values="6" data-field="@commoniuxproductcategory1"  data-sort-criteria="alphaAscending" data-enable-settings="false" data-additional-filter="NOT @okbtype"></div>

      <!-- The "DependentHierarchicalFacet" : Level 2 Facet must refer to the default `id` of its "parent" Facet, which is the name of its field. -->
      <div class="CoveoDependentHierarchicalFacet" id="product2Facet" data-id="product2Facet" data-title="Product2Facet" data-depends-on="product1Facet" data-field="@commoniuxproductcategory2" data-enable-facet-search="true" data-sort-criteria="alphaAscending" data-enable-settings="false"></div>

      <!-- The "DependentHierarchicalFacet" : Level 3 Facet must refer to the default `id` of its "parent" Facet, which is the name of its field. -->
      <div class="CoveoDependentHierarchicalFacet" id="product3Facet" data-id="product3Facet" data-title="Product3Facet" data-depends-on="product2Facet" data-field="@commoniuxproductcategory3"  data-enable-facet-search="true" data-sort-criteria="alphaAscending" data-enable-settings="false"></div>
```
