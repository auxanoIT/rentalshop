import { defineField, defineType } from "@/sanity/schema-helpers";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: "required" }),
    defineField({ name: "organization", type: "string" }),
    defineField({ name: "quote", type: "text", validation: "required" }),
    defineField({ name: "rating", type: "number", validation: "min:1|max:5" }),
    defineField({ name: "isPublished", type: "boolean", initialValue: false })
  ]
});
