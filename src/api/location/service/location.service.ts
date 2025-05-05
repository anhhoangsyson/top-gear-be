import { LocationRepository } from '../repository/location.repository';
import { CreateLocationDTO, LocationDTO } from '../dto/location.dto';

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async getLocationsByUserId(userId: string): Promise<LocationDTO[]> {
    const locations = await this.locationRepository.findByUserId(userId);
    return locations.map((location) => new LocationDTO(location));
  }

  async createLocation(
    userId: string,
    locationData: CreateLocationDTO,
  ): Promise<LocationDTO> {
    const newLocation = await this.locationRepository.create({
      userId,
      province: locationData.province,
      district: locationData.district,
      ward: locationData.ward,
      street: locationData.street,
      isDefault: locationData.isDefault || false,
    });
    return new LocationDTO(newLocation);
  }

  async deleteLocation(id: string): Promise<void> {
    await this.locationRepository.deleteById(id);
  }

  async setDefaultLocation(id: string): Promise<void> {
    await this.locationRepository.setDefaultLocation(id);
  }

  async updateLocation(id: string, locationData: Partial<CreateLocationDTO>) {
    await this.locationRepository.updateLocation(id, locationData);
  }
}
