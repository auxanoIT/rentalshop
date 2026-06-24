import { schemaTypes } from "./src/sanity/schemas";

const sanityConfig = {
  name: "default",
  title: "ITShop Equipment Leasing",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "replace-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  schema: {
    types: schemaTypes
  }
};

export default sanityConfig;
