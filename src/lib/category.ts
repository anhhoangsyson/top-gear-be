export function findTopLevelCategory(
  categoryMap: Map<string, any>,
  categoryId: string,
): any {
  let currentCategory = categoryMap.get(categoryId);

  while (currentCategory && currentCategory.parentCategoryId) {
    console.log('currentCategory', currentCategory.parentCategoryId);
    currentCategory = categoryMap.get(
      currentCategory.parentCategoryId.toString(),
    );
    console.log('currentCategory', currentCategory);
  }
  return currentCategory ? currentCategory._id : null;
}

export function getCategoryWithChildren(
  categoryMap: Map<string, any>,
  parentCategoryId: string,
) {
  let result: any[] = [];

  // Lấy danh mục cha nếu tồn tại
  const parentCategory = categoryMap.get(parentCategoryId);
  if (parentCategory) {
    result.push(parentCategory);
  }

  // Lấy danh mục con cấp 1
  const level1Children = Array.from(categoryMap.values()).filter(
    (c) => c.parentCategoryId === parentCategoryId,
  );
  result.push(...level1Children);

  // Lấy danh mục con cấp 2 của các danh mục con cấp 1
  level1Children.forEach((child) => {
    const level2Children = Array.from(categoryMap.values()).filter(
      (c) => c.parentId === child.id,
    );
    result.push(...level2Children);
  });

  return result;
}
