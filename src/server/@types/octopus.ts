export type APIResponse = {
  results: APITariff[];
};

export type APITariff = {
  value_exc_vat: number;
  value_inc_vat: number;
  valid_from: string;
  valid_to: string;
};

export type Tariff = {
  id: string;
  price: number;
  valid_from: Date;
  valid_to: Date;
  status: boolean;
  override: boolean;
  intervalStr: string;
};
