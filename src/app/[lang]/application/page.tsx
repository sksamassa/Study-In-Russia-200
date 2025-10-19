import MultiPageApplicationForm from "@/components/multi-page-application-form";

export default async function ApplicationPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <MultiPageApplicationForm />
    </section>
  );
}
