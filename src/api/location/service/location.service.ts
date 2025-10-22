import { LocationRepository } from '../repository/location.repository';
import { CreateLocationDTO, LocationDTO } from '../dto/location.dto';
import locationSchema from '../schema/location.schema';

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
    const count = await locationSchema.countDocuments({ userId });
    const isDefault = count === 0 ? true : (locationData.isDefault ?? false);
    const newLocation = await this.locationRepository.create({
      ...locationData,
      userId,
      isDefault,
    });
    return new LocationDTO(newLocation);
  }

  async deleteLocation(id: string): Promise<void> {
    await this.locationRepository.deleteById(id);
  }
  async updateLocation(
    id: string,
    locationData: CreateLocationDTO,
  ): Promise<LocationDTO> {
    const updatedLocation = await this.locationRepository.updateLocation(
      id,
      locationData,
    );
    if (!updatedLocation) throw new Error('Không tìm thấy địa chỉ để cập nhật');
    return new LocationDTO(updatedLocation);
  }

  async setDefaultLocation(id: string): Promise<void> {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new Error('Không tìm thấy địa chỉ');

    // Bỏ mặc định tất cả địa chỉ của user này
    await this.locationRepository.updateMany(
      { userId: location.userId },
      { isDefault: false },
    );

    // Set địa chỉ này thành mặc định
    await this.locationRepository.updateById(id, { isDefault: true });
  }
}
