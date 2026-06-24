import { defineField, defineType } from "@/sanity/schema-helpers";

export const homepageSection = defineType({
  name: "homepageSection",
  title: "Homepage Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: "required" }),
    defineField({
      name: "sectionType",
      type: "string",
      options: { list: ["hero", "trust", "categories", "cta", "faq"] }
    }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "sortOrder", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", type: "boolean", initialValue: true })
  ]
});
