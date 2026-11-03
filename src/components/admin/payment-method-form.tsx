import type { PaymentMethod } from "@prisma/client";
import {
  saveCryptoSettings,
  savePaymentMethod,
} from "@/actions/payments-admin";
import { ActionForm } from "@/components/admin/action-form";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import type { Settings } from "@/lib/settings";

export function PaymentMethodForm({
  method,
  nextOrder = 0,
}: {
  method?: PaymentMethod;
  nextOrder?: number;
}) {
  return (
    <ActionForm
      action={savePaymentMethod}
      submitLabel="Save Method"
      resetOnSuccess={!method}
    >
      {method && <input type="hidden" name="id" value={method.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Payment Method Name" htmlFor="pm-name">
          <Input
            id="pm-name"
            name="name"
            defaultValue={method?.name}
            required
            maxLength={80}
            placeholder="Cash App"
          />
        </Field>
        <Field
          label="Payment Type"
          htmlFor="pm-kind"
          hint="Bitcoin is verified automatically on the blockchain. Manual payments are confirmed by an admin."
        >
          <Select
            id="pm-kind"
            name="kind"
            defaultValue={method?.kind ?? "MANUAL"}
          >
            <option value="MANUAL">
              Manual (Cash App, Venmo, Zelle, bank…)
            </option>
            <option value="BITCOIN">
              Bitcoin (uses the wallet in Crypto settings)
            </option>
          </Select>
        </Field>
        <Field
          label="Label under the name"
          htmlFor="pm-subtitle"
          hint={'e.g. "USA", "Any wallet", "Credit Card"'}
        >
          <Input
            id="pm-subtitle"
            name="subtitle"
            defaultValue={method?.subtitle}
            required
            maxLength={80}
          />
        </Field>
        <Field
          label="Country"
          htmlFor="pm-country"
          hint="Leave blank if available everywhere."
        >
          <Input
            id="pm-country"
            name="country"
            defaultValue={method?.country ?? ""}
            maxLength={80}
          />
        </Field>
      </div>
      <Field label="Short description" htmlFor="pm-desc">
        <Input
          id="pm-desc"
          name="description"
          defaultValue={method?.description ?? ""}
          maxLength={240}
        />
      </Field>
      <Field
        label="Wallet Address or Payment Account"
        htmlFor="pm-account"
        hint="Manual methods: the account customers pay ($cashtag, Venmo username, Zelle email or phone). Shown only inside a customer's payment window. Bitcoin methods ignore this and use the wallet in Crypto settings."
      >
        <Input
          id="pm-account"
          name="account"
          defaultValue={method?.account ?? ""}
          maxLength={255}
          autoComplete="off"
        />
      </Field>
      <Field
        label="Payment Instructions"
        htmlFor="pm-instructions"
        hint="Shown under How to pay and in the payment window."
      >
        <Textarea
          id="pm-instructions"
          name="instructions"
          rows={4}
          defaultValue={method?.instructions ?? ""}
          maxLength={3000}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Payment URL (optional)"
          htmlFor="pm-url"
          hint="https:// only, e.g. your MoonPay or Cash App link."
        >
          <Input
            id="pm-url"
            name="paymentUrl"
            type="url"
            defaultValue={method?.paymentUrl ?? ""}
            maxLength={512}
          />
        </Field>
        <Field label="Network (crypto only)" htmlFor="pm-network">
          <Input
            id="pm-network"
            name="network"
            defaultValue={method?.network ?? ""}
            maxLength={80}
            placeholder="Bitcoin Network"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field
          label="Logo / Icon URL"
          htmlFor="pm-logo"
          hint="Optional. https:// or /path"
        >
          <Input
            id="pm-logo"
            name="logoUrl"
            defaultValue={method?.logoUrl ?? ""}
            maxLength={512}
          />
        </Field>
        <Field label="Fallback glyph" htmlFor="pm-glyph" hint="1–2 characters">
          <Input
            id="pm-glyph"
            name="glyph"
            defaultValue={method?.glyph ?? ""}
            maxLength={4}
          />
        </Field>
        <Field label="Brand colour" htmlFor="pm-accent" hint="#RRGGBB">
          <Input
            id="pm-accent"
            name="accent"
            defaultValue={method?.accent ?? ""}
            maxLength={7}
            placeholder="#22D3EE"
          />
        </Field>
        <Field label="Display Order" htmlFor="pm-order">
          <Input
            id="pm-order"
            name="sortOrder"
            type="number"
            min={0}
            max={999}
            defaultValue={method?.sortOrder ?? nextOrder}
          />
        </Field>
      </div>
      <Checkbox
        name="isActive"
        label="Active (shown to customers)"
        defaultChecked={method?.isActive ?? true}
      />
    </ActionForm>
  );
}

export function CryptoSettingsForm({ crypto }: { crypto: Settings["crypto"] }) {
  return (
    <ActionForm action={saveCryptoSettings} submitLabel="Save crypto settings">
      <Field
        label="Bitcoin Wallet Address"
        htmlFor="cs-address"
        hint="Your own wallet. It's shown only inside a customer's payment window. Use a wallet you control; payments are matched by amount on this address."
      >
        <Input
          id="cs-address"
          name="btcAddress"
          defaultValue={crypto.btcAddress}
          maxLength={120}
          autoComplete="off"
          spellCheck={false}
          className="font-mono"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Bitcoin Network" htmlFor="cs-network">
          <Select id="cs-network" name="network" defaultValue={crypto.network}>
            <option value="mainnet">Bitcoin mainnet (real payments)</option>
            <option value="testnet4">Testnet4 (testing only)</option>
          </Select>
        </Field>
        <Field
          label="BTC/USD Price Provider"
          htmlFor="cs-provider"
          hint="Falls back to the others if it fails."
        >
          <Select
            id="cs-provider"
            name="priceProvider"
            defaultValue={crypto.priceProvider}
          >
            <option value="coinbase">Coinbase</option>
            <option value="kraken">Kraken</option>
            <option value="coingecko">CoinGecko</option>
          </Select>
        </Field>
        <Field
          label="Quote Validity (minutes)"
          htmlFor="cs-quote"
          hint="How long a BTC amount stays locked."
        >
          <Input
            id="cs-quote"
            name="quoteMinutes"
            type="number"
            min={5}
            max={120}
            defaultValue={crypto.quoteMinutes}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field
          label="Reservation (minutes)"
          htmlFor="cs-res"
          hint="Invoice countdown."
        >
          <Input
            id="cs-res"
            name="reservationMinutes"
            type="number"
            min={15}
            max={1440}
            defaultValue={crypto.reservationMinutes}
          />
        </Field>
        <Field label="Minimum Payment (USD)" htmlFor="cs-min">
          <Input
            id="cs-min"
            name="minimumUsd"
            type="number"
            min={0}
            step="0.01"
            defaultValue={crypto.minimumUsd}
          />
        </Field>
        <Field
          label="Confirmations required"
          htmlFor="cs-conf"
          hint="1 is typical; 0 accepts unconfirmed (risky)."
        >
          <Input
            id="cs-conf"
            name="confirmations"
            type="number"
            min={0}
            max={6}
            defaultValue={crypto.confirmations}
          />
        </Field>
        <Field
          label="Amount tolerance (%)"
          htmlFor="cs-tol"
          hint="Below this is Underpaid."
        >
          <Input
            id="cs-tol"
            name="tolerancePct"
            type="number"
            min={0}
            max={10}
            step="0.1"
            defaultValue={crypto.tolerancePct}
          />
        </Field>
      </div>
    </ActionForm>
  );
}
