import Location, { ILocation } from '../schema/location.schema';

export class LocationRepository {
  async findByUserId(userId: string): Promise<ILocation[]> {
    return await Location.find({ userId }).exec();
  }

  async create(locationData: Partial<ILocation>): Promise<ILocation> {
    const location = new Location(locationData);
    return await location.save();
  }

  async deleteById(id: string) {
    return Location.findByIdAndDelete(id).exec();
  }

  async setDefaultLocation(id: string) {
    const currentDefaultLocation = await Location.findOne({
      isDefault: true,
    }).exec();

    if (currentDefaultLocation) {
      return Location.findByIdAndUpdate(
        id,
        { isDefault: true },
        { new: true },
      ).exec();
    }
  }

  async updateLocation(id: string, locationdata: Partial<ILocation>) {
    return Location.findByIdAndUpdate(id, locationdata, { new: true }).exec();
  }
}
