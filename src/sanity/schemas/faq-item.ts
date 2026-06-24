import { defineField, defineType } from "@/sanity/schema-helpers";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: "required" }),
    defineField({ name: "answer", type: "text", validation: "required" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "relatedPage", type: "string" })
  ]
});
