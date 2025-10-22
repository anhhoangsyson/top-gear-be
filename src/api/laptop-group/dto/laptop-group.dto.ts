export interface ICreateLaptopGroupDto {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  laptops?: string[];
  backgroundImage?: string;
}
