import { saveSubscription } from "@/actions/subscriptions-admin";
import { ActionForm } from "@/components/admin/action-form";
import { Field, Input, Select } from "@/components/ui/form";
import type { IptvAccess } from "@/lib/iptv-access";

const accessInputs: { name: keyof IptvAccess; label: string; type?: string; placeholder?: string }[] = [
  { name: "iptvUsername", label: "IPTV Username" },
  { name: "iptvPassword", label: "IPTV Password" },
  { name: "m3uUrl", label: "M3U URL", type: "url", placeholder: "http://…/get.php?username=…" },
  { name: "magUrl", label: "MAG URL", type: "url", placeholder: "http://…/c/" },
  { name: "xtreamServer", label: "Xtream Server", type: "url", placeholder: "http://server:port" },
  { name: "xtreamUsername", label: "Xtream Username" },
  { name: "xtreamPassword", label: "Xtream Password" },
];

export function SubscriptionForm({
  subscriptionId,
  status,
  access,
  start,
  end,
  connectionLimit,
  paid,
}: {
  subscriptionId: string;
  status: string;
  access: IptvAccess;
  start: string;
  end: string;
  connectionLimit: number;
  /** False while the invoice isn't paid: activation is refused on the server too. */
  paid: boolean;
}) {
  return (
    <ActionForm action={saveSubscription} submitLabel="Save Changes">
      <input type="hidden" name="subscriptionId" value={subscriptionId} />
      <Field label="Status" htmlFor="status" hint={paid ? "Active needs an IPTV login and valid dates." : "This invoice isn't paid yet, so it can't be activated."}>
        <Select id="status" name="status" defaultValue={status === "PAST_DUE" ? "ACTIVE" : status}>
          <option value="ACTIVE" disabled={!paid}>
            Active
          </option>
          <option value="PENDING">Pending Review (not active yet)</option>
          <option value="CANCELED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
        </Select>
      </Field>

      <fieldset className="rounded-[14px] border border-border p-4 sm:p-5">
        <legend className="px-1 text-sm font-semibold text-text">IPTV Account Information</legend>
        <p className="mb-4 text-xs text-subtle">Stored encrypted. Only this customer and admins can see it; it is never sent by email.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {accessInputs.map((f) => (
            <Field key={f.name} label={f.label} htmlFor={f.name}>
              <Input
                id={f.name}
                name={f.name}
                type={f.type ?? "text"}
                defaultValue={access[f.name]}
                placeholder={f.placeholder}
                autoComplete="off"
                spellCheck={false}
                className="font-mono text-sm"
                maxLength={f.type === "url" ? 1000 : 200}
              />
            </Field>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-[14px] border border-border p-4 sm:p-5">
        <legend className="px-1 text-sm font-semibold text-text">Subscription Dates</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Start Date (MM/DD/YYYY)" htmlFor="start">
            <Input id="start" name="start" defaultValue={start} placeholder="MM/DD/YYYY" inputMode="numeric" pattern="\d{1,2}/\d{1,2}/\d{4}" maxLength={10} />
          </Field>
          <Field label="Expiry Date (MM/DD/YYYY)" htmlFor="end">
            <Input id="end" name="end" defaultValue={end} placeholder="MM/DD/YYYY" inputMode="numeric" pattern="\d{1,2}/\d{1,2}/\d{4}" maxLength={10} />
          </Field>
          <Field label="Connection Limit" htmlFor="connectionLimit" hint="Devices that can watch at once.">
            <Input id="connectionLimit" name="connectionLimit" type="number" min={1} max={20} defaultValue={connectionLimit} />
          </Field>
        </div>
      </fieldset>
    </ActionForm>
  );
}
