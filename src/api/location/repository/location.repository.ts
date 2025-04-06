import Location, { ILocation } from '../schema/location.schema';

export class LocationRepository {
  async findByUserId(userId: string): Promise<ILocation[]> {
    return await Location.find({ userId }).exec();
  }

  async create(locationData: Partial<ILocation>): Promise<ILocation> {
    const location = new Location(locationData);
    return await location.save();
  }
}
