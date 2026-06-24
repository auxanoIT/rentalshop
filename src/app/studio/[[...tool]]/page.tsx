export default function StudioPage() {
  return (
    <main className="container-page py-12">
      <div className="max-w-2xl rounded-lg border bg-card p-6">
        <p className="text-sm font-semibold text-primary">Sanity CMS</p>
        <h1 className="mt-2 text-3xl font-semibold">Sanity content model is configured</h1>
        <p className="mt-3 text-muted-foreground">
          The project includes Sanity schemas and a read client for SEO landing pages, guides, FAQs,
          homepage sections, policies, and testimonials. Run Sanity Studio separately with these schema
          files when the Sanity project is provisioned.
        </p>
      </div>
    </main>
  );
}
