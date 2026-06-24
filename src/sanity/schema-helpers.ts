type SchemaDefinition = Record<string, unknown>;

export function defineType<T extends SchemaDefinition>(schema: T) {
  return schema;
}

export function defineField<T extends SchemaDefinition>(field: T) {
  return field;
}
