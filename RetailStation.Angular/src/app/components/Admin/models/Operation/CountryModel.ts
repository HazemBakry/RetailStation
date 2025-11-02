import { CreatorModel } from 'src/app/components/Shared/models/CreatorModel';
export interface CountryModel extends CreatorModel {
  countryId: number;
  nameAR: string;
  nameEN: string;
  isActive: boolean;
}


export interface CityModel  extends CreatorModel{
  cityId: number;
  countryId: number;
  postalCode?: string;
  nameAR: string;
  nameEN: string;
  isActive: boolean;
  
}

export interface RegionModel extends CreatorModel {
  regionId: number;
  code?: string;
  nameAR: string;
  nameEN: string;
  cityId?: number;
  countryId?: number;
  isActive: boolean;

}

