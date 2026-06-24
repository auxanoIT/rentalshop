import { defineField, defineType } from "@/sanity/schema-helpers";

export const policyPage = defineType({
  name: "policyPage",
  title: "Policy Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: "required" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: "required" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "lastUpdated", type: "date" }),
    defineField({ name: "version", type: "string" })
  ]
});
