export class LocationDTO {
  _id: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;

  constructor(location: any) {
    this._id = location._id;
    this.province = location.province;
    this.district = location.district;
    this.ward = location.ward;
    this.street = location.street;
    this.isDefault = location.isDefault;
  }
}

export class CreateLocationDTO {
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault?: boolean; // Optional, mặc định false

  constructor(data: Partial<CreateLocationDTO>) {
    this.province = data.province || '';
    this.district = data.district || '';
    this.ward = data.ward || '';
    this.street = data.street || '';
    this.isDefault = data.isDefault || false;
  }
}
