export interface IAttributeDto {
  _id: string;
  attributeName: string;
  categoryIds: string[];
}
export interface ICreateAttributeDto {
  attributeName: string;
  categoryIds: string[];
}
export interface IAttributeResponseDto {
  // attributeId: string;
  attributeName: string;
  categoryIds: string[];
}
export interface IProductAttributeDto {
  productId: string;
  attributeId: string;
}
export interface ICategoryAttributeDto {
  categoryId: string;
  attributeId: string;
}
