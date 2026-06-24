import { defineField, defineType } from "@/sanity/schema-helpers";

export const guideArticle = defineType({
  name: "guideArticle",
  title: "Guide Article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: "required" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: "required" }),
    defineField({ name: "excerpt", type: "text", validation: "required" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "primaryKeyword", type: "string" }),
    defineField({ name: "author", type: "string", initialValue: "ITShop Team" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({
      name: "relatedPages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" })
          ]
        }
      ]
    }),
    defineField({
      name: "faqs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", type: "string" }),
            defineField({ name: "answer", type: "text" })
          ]
        }
      ]
    })
  ]
});
