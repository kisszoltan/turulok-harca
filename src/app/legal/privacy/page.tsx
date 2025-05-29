import { notFound } from "next/navigation";

export default async function PrivacyPage() {
  const locale = "hu";

  try {
    const Content = (await import(`./${locale ?? "en"}.mdx`)).default;

    return (
      <section className="flex flex-col gap-4">
        <article className="text-left prose dark:prose-invert bg-background">
          <Content />
        </article>
      </section>
    );
  } catch {
    notFound();
  }
}
