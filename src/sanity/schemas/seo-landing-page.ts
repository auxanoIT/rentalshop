import { defineField, defineType } from "@/sanity/schema-helpers";

export const seoLandingPage = defineType({
  name: "seoLandingPage",
  title: "SEO Landing Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: "required" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: "required" }),
    defineField({ name: "targetKeyword", type: "string", validation: "required" }),
    defineField({ name: "cluster", type: "string", initialValue: "Laptop Rental Nigeria" }),
    defineField({ name: "metaTitle", type: "string", validation: "required|max:70" }),
    defineField({ name: "metaDescription", type: "text", validation: "required|max:170" }),
    defineField({ name: "canonicalPath", type: "string" }),
    defineField({
      name: "indexStatus",
      type: "string",
      options: { list: ["index", "noindex"], layout: "radio" },
      initialValue: "index"
    }),
    defineField({ name: "hero", type: "object", fields: [
      defineField({ name: "eyebrow", type: "string" }),
      defineField({ name: "heading", type: "string" }),
      defineField({ name: "body", type: "text" })
    ] }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "body", type: "array", of: [{ type: "block" }] })
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
    }),
    defineField({
      name: "internalLinks",
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
    })
  ]
});
