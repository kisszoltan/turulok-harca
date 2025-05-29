import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function PrivacyPage() {
  const locale = await getLocale();

  try {
    const Content = (await import(`./${locale ?? "ne"}.mdx`)).default;

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
