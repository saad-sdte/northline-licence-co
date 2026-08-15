import { ApplyWizard } from "@/components/ApplyWizard";

export default async function ServicesApplyProvincePage({
  params,
}: {
  params: Promise<{ province: string }>;
}) {
  const { province } = await params;
  return <ApplyWizard basePath="/services/apply" initialSlug={province} />;
}
