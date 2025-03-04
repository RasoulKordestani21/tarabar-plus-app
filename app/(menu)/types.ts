export type CargoValuesProps = {
  id: string;
  origin: String;
  destination: String;
  truckType: String;
  cargoType: String;
  fee: String;
  description: String;
  transportType: String;
  insurancePercentage: String;
  cargoWeight?: String;
};

export type CargoSubmitProps = {
  originId: Number;
  destinationId: Number;
  truckTypeId: Number;
  cargoTypeId: Number;
  carriageFee: String;
  description: String;
  ownerPhone: String;
  transportType: String;
  insurancePercentage: String;
  cargoWeight?: String;
};

export type CargoInitialEditProps = {
  id: number;
  origin: String;
  destination: String;
  truckType: String;
  cargoType: String;
  fee: String;
  description: String;
  transportType: String;
  insurancePercentage: String;
  cargoWeight: String;
};

export type CargoStatesEditProps = {
  _id: number;
  origin: String;
  destination: String;
  truckTypeId: Number;
  cargoTypeId: Number;
  carriageFee: String;
  description: String;
  transportType: String;
  insurancePercentage: String;
  cargoWeight: String;
};

export type FetchedCity = {
  id: number;
  title: string;
  province_id: number;
  provinceName: string;
  provinceId: number;
};
