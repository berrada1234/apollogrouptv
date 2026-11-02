import type { Plan } from "@prisma/client";
import { savePlan } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { intervalLabels, parseFeatures } from "@/lib/utils";

export function PlanForm({ plan }: { plan?: Plan }) {
  const key = plan?.id ?? "new";
  return (
    <ActionForm action={savePlan} submitLabel={plan ? "Save plan" : "Create plan"} resetOnSuccess={!plan}>
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor={`name-${key}`}>
          <Input id={`name-${key}`} name="name" defaultValue={plan?.name} required maxLength={120} />
        </Field>
        <Field label="Slug (URL)" htmlFor={`slug-${key}`} hint="lowercase-with-dashes">
          <Input id={`slug-${key}`} name="slug" defaultValue={plan?.slug} required pattern="[a-z0-9-]+" maxLength={80} />
        </Field>
      </div>
      <Field label="Description" htmlFor={`desc-${key}`}>
        <Textarea id={`desc-${key}`} name="description" defaultValue={plan?.description} rows={2} required maxLength={1000} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Price" htmlFor={`price-${key}`}>
          <Input id={`price-${key}`} name="price" type="number" min="0" step="0.01" defaultValue={plan ? plan.priceCents / 100 : undefined} required />
        </Field>
        <Field label="Currency" htmlFor={`cur-${key}`}>
          <Input id={`cur-${key}`} name="currency" defaultValue={plan?.currency ?? "USD"} maxLength={3} required />
        </Field>
        <Field label="Billing interval" htmlFor={`int-${key}`}>
          <Select id={`int-${key}`} name="interval" defaultValue={plan?.interval ?? "MONTHLY"}>
            {Object.entries(intervalLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Sort order" htmlFor={`sort-${key}`}>
          <Input id={`sort-${key}`} name="sortOrder" type="number" min="0" defaultValue={plan?.sortOrder ?? 0} />
        </Field>
      </div>
      <Field label="Features (one per line)" htmlFor={`feat-${key}`}>
        <Textarea id={`feat-${key}`} name="features" rows={5} defaultValue={plan ? parseFeatures(plan.features).join("\n") : ""} />
      </Field>
      <div className="flex flex-wrap gap-6">
        <Checkbox name="highlighted" label="Mark as recommended" defaultChecked={plan?.highlighted} />
        <Checkbox name="isActive" label="Active (visible on the website)" defaultChecked={plan?.isActive ?? true} />
      </div>
    </ActionForm>
  );
}
