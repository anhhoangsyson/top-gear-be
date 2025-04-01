import { db } from '@/lib/db';
import type { CategoryDto, CategoryAttributeDto } from '../dto/category.dto';

export class CategoryRepository {
  async findAll(): Promise<CategoryDto[]> {
    return db.query(`
      SELECT categoryId, categoryName, isDeleted
      FROM Category
      WHERE isDeleted = false
      ORDER BY categoryName ASC
    `);
  }

  async findById(categoryId: string): Promise<CategoryDto | null> {
    const results = await db.query(
      `
      SELECT categoryId, categoryName, isDeleted
      FROM Category
      WHERE categoryId = $1
    `,
      [categoryId],
    );

    return results.length > 0 ? results[0] : null;
  }

  async create(categoryName: string): Promise<CategoryDto> {
    const result = await db.query(
      `
      INSERT INTO Category (categoryName)
      VALUES ($1)
      RETURNING categoryId, categoryName, isDeleted
    `,
      [categoryName],
    );

    return result[0];
  }

  async update(
    categoryId: string,
    data: { categoryName?: string; isDeleted?: boolean },
  ): Promise<CategoryDto | null> {
    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.categoryName !== undefined) {
      updates.push(`categoryName = $${paramIndex++}`);
      values.push(data.categoryName);
    }

    if (data.isDeleted !== undefined) {
      updates.push(`isDeleted = $${paramIndex++}`);
      values.push(data.isDeleted);
    }

    if (updates.length === 0) return this.findById(categoryId);

    values.push(categoryId);

    const result = await db.query(
      `
      UPDATE Category
      SET ${updates.join(', ')}
      WHERE categoryId = $${paramIndex}
      RETURNING categoryId, categoryName, isDeleted
    `,
      values,
    );

    return result.length > 0 ? result[0] : null;
  }

  async delete(categoryId: string): Promise<boolean> {
    // Soft delete
    const result = await db.query(
      `
      UPDATE Category
      SET isDeleted = true
      WHERE categoryId = $1
    `,
      [categoryId],
    );

    return result.affectedRows > 0;
  }

  async getCategoryAttributes(
    categoryId: string,
  ): Promise<CategoryAttributeDto[]> {
    return db.query(
      `
      SELECT ca.categoryAttributeId, ca.categoryId, ca.attributeId, a.attributeName
      FROM CategoryAttribute ca
      JOIN Attribute a ON ca.attributeId = a.attributeId
      WHERE ca.categoryId = $1
    `,
      [categoryId],
    );
  }

  async addCategoryAttribute(
    categoryId: string,
    attributeId: string,
  ): Promise<CategoryAttributeDto> {
    const result = await db.query(
      `
      INSERT INTO CategoryAttribute (categoryId, attributeId)
      VALUES ($1, $2)
      RETURNING categoryAttributeId, categoryId, attributeId
    `,
      [categoryId, attributeId],
    );

    // Get attribute name
    const attribute = await db.query(
      `
      SELECT attributeName FROM Attribute WHERE attributeId = $1
    `,
      [attributeId],
    );

    return {
      ...result[0],
      attributeName: attribute[0].attributeName,
    };
  }

  async removeCategoryAttribute(
    categoryId: string,
    attributeId: string,
  ): Promise<boolean> {
    const result = await db.query(
      `
      DELETE FROM CategoryAttribute
      WHERE categoryId = $1 AND attributeId = $2
    `,
      [categoryId, attributeId],
    );

    return result.affectedRows > 0;
  }
}
