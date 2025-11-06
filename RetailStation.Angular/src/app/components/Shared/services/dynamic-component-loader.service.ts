import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { ProductsDetailsSidePanelComponent } from '../components/sidepanel/products-details-side-panel/products-details-side-panel.component';
import { DataField } from '../models/DataField';
import { title } from 'process';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentLoaderService {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }


  loadProductDetailsSidePanel(
    viewContainerRef: ViewContainerRef,
    detailsModel: any, //OrderModel,
    productList: any[], //GeneralOrderDetailsModel[],
    dataFields: DataField[],
    title: string = null
  ) {
    // Clear any existing components in the container
    viewContainerRef.clear();

    // Resolve the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ProductsDetailsSidePanelComponent);

    // Create the component in the ViewContainerRef
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // Set component inputs dynamically
    const instance = componentRef.instance as ProductsDetailsSidePanelComponent;
    instance.detailsModel = detailsModel;
    instance.productList = productList;
    instance.dataFields = dataFields;
    instance.title = title;

    if (instance.openSidePanel) {
      instance.openSidePanel();
    }
  }
}

