export interface IAttributeDto {
  attributeName: string;
}
export interface ICreateAttributeDto {
  attributeName: string;
}
export interface IAttributeResponseDto {
  // attributeId: string;
  attributeName: string;
}
export interface IProductAttributeDto {
  productId: string;
  attributeId: string;
}
export interface ICategoryAttributeDto {
  categoryId: string;
  attributeId: string;
}
