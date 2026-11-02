import type { Channel, ChannelCategory } from "@prisma/client";
import { saveChannel } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";

export function ChannelForm({ channel, categories }: { channel?: Channel; categories: Pick<ChannelCategory, "id" | "name">[] }) {
  const k = channel?.id ?? "new";
  return (
    <ActionForm action={saveChannel} submitLabel={channel ? "Save channel" : "Add channel"} resetOnSuccess={!channel}>
      {channel && <input type="hidden" name="id" value={channel.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor={`n-${k}`}>
          <Input id={`n-${k}`} name="name" defaultValue={channel?.name} required maxLength={160} />
        </Field>
        <Field label="Slug" htmlFor={`s-${k}`} hint="lowercase-with-dashes, unique">
          <Input id={`s-${k}`} name="slug" defaultValue={channel?.slug} required pattern="[a-z0-9-]+" maxLength={120} />
        </Field>
        <Field label="Category" htmlFor={`c-${k}`}>
          <Select id={`c-${k}`} name="categoryId" defaultValue={channel?.categoryId} required>
            <option value="">Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Logo URL" htmlFor={`l-${k}`} hint="HTTPS URL or /path in /public. Use only logos you're licensed to display.">
          <Input id={`l-${k}`} name="logoUrl" defaultValue={channel?.logoUrl ?? ""} maxLength={512} />
        </Field>
        <Field label="Country" htmlFor={`co-${k}`}>
          <Input id={`co-${k}`} name="country" defaultValue={channel?.country ?? ""} maxLength={64} />
        </Field>
        <Field label="Language" htmlFor={`la-${k}`}>
          <Input id={`la-${k}`} name="language" defaultValue={channel?.language ?? ""} maxLength={64} />
        </Field>
      </div>
      <Field label="Description" htmlFor={`d-${k}`}>
        <Textarea id={`d-${k}`} name="description" rows={2} defaultValue={channel?.description ?? ""} maxLength={1000} />
      </Field>
      <div className="flex flex-wrap gap-6">
        <Checkbox name="isHd" label="HD" defaultChecked={channel?.isHd} />
        <Checkbox name="isActive" label="Published in catalog" defaultChecked={channel?.isActive ?? true} />
      </div>
    </ActionForm>
  );
}
