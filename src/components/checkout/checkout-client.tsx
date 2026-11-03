"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Loader2,
  Radio,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  beginPayment,
  cancelInvoiceAction,
  createInvoiceAction,
  submitPaymentReviewAction,
  type PayResult,
} from "@/actions/checkout";
import { MethodLogo } from "@/components/checkout/method-logo";
import { CopyField } from "@/components/dashboard/copy-field";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormMessage, Input } from "@/components/ui/form";
import { idle } from "@/lib/action-state";
import {
  bip21,
  explorerTxUrl,
  formatBtc,
  type BtcNetwork,
} from "@/lib/checkout/bitcoin";
import type { RequestView } from "@/lib/checkout/service";
import { cn, formatMoney } from "@/lib/utils";

const POLL_MS = 15_000;

function useNow(active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);
  return now;
}

function mmss(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

/** Live reservation timer; refreshes the page when it runs out so the invoice shows as expired. */
export function ReservationTimer({ expiresAt }: { expiresAt: string }) {
  const router = useRouter();
  const now = useNow();
  const left = new Date(expiresAt).getTime() - now;
  const done = left <= 0;
  useEffect(() => {
    if (done) router.refresh();
  }, [done, router]);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold",
        left < 5 * 60_000
          ? "border-error/35 bg-error/10 text-error"
          : "border-warning/35 bg-warning/10 text-warning",
      )}
      role="timer"
      aria-label="Time left on your reservation"
      // Server and browser clocks render a second apart; the browser value wins.
      suppressHydrationWarning
    >
      <Clock className="h-3.5 w-3.5" aria-hidden /> Reservation: {mmss(left)}
    </span>
  );
}

/** "I Have Paid": asks our team to review the payment, then opens the Payment Under Review page. */
export function IHavePaidButton({ orderId, requestId = null, className, variant = "secondary" }: { orderId: string; requestId?: string | null; className?: string; variant?: "primary" | "secondary" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        loading={busy}
        onClick={async () => {
          setBusy(true);
          const r = await submitPaymentReviewAction(orderId, requestId, "");
          if (r.ok) return router.push(r.href);
          setBusy(false);
          setError(r.message);
        }}
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden /> I Have Paid
      </Button>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}

/** Shown once after a pack is chosen: the order summary with the next steps. */
export function OrderPopup({ orderId, title, amount, expiresAt }: { orderId: string; title: string; amount: string; expiresAt: string | null }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const close = (thenScroll = false) => {
    ref.current?.close();
    router.replace("/dashboard/plan", { scroll: false });
    if (thenScroll) setTimeout(() => document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  return (
    <dialog
      ref={ref}
      aria-labelledby="order-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      className="m-auto w-[min(94vw,28rem)] rounded-[18px] border border-border-strong bg-card p-0 text-text shadow-lg backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id="order-title" className="font-display text-xl font-bold">
            Your Subscription Order
          </h2>
          <button type="button" onClick={() => close()} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-inset hover:text-text" aria-label="Close">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="mt-4 rounded-[14px] border border-primary/30 bg-primary/[0.06] p-4">
          <p className="font-semibold text-text">
            {title} — <span className="font-display text-lg font-extrabold">{amount}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Status:</span>
            <span className="rounded-full border border-warning/35 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">Pending Payment</span>
            {expiresAt && <ReservationTimer expiresAt={expiresAt} />}
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          <span className="font-semibold text-text">Payment Instructions:</span> Choose your preferred payment method, send the payment, then press I Have Paid so our team
          can review it.
        </p>
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button type="button" className="sm:flex-1" onClick={() => close(true)}>
            Choose Payment Method <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <IHavePaidButton orderId={orderId} className="sm:flex-1 [&>button]:w-full" />
        </div>
      </div>
    </dialog>
  );
}

export function InvoiceActions({
  orderId,
  cancellable,
}: {
  orderId: string;
  cancellable: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    cancelInvoiceAction,
    idle,
  );
  const [asking, setAsking] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Button
        type="button"
        onClick={() => {
          const el = document.getElementById("checkout");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
          el?.querySelector<HTMLButtonElement>("[data-pay]")?.focus({
            preventScroll: true,
          });
        }}
      >
        Continue Payment <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      <IHavePaidButton orderId={orderId} />
      {cancellable && (
        <form ref={form} action={formAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <Button
            type="button"
            variant="secondary"
            loading={pending}
            onClick={() => setAsking(true)}
          >
            <XCircle className="h-4 w-4" aria-hidden /> Cancel Invoice
          </Button>
        </form>
      )}
      {state.message && !state.ok && (
        <FormMessage ok={false} message={state.message} />
      )}
      <ConfirmDialog
        open={asking}
        title="Cancel this invoice?"
        description="The reservation is released. You can choose a pack again at any time."
        confirmLabel="Cancel invoice"
        onCancel={() => setAsking(false)}
        onConfirm={() => {
          setAsking(false);
          form.current?.requestSubmit();
        }}
      />
    </div>
  );
}

/** "Subscribe" on a pack: creates the invoice on the server, then takes the customer to checkout. */
export function SubscribeButton({
  plan,
  label,
  primary,
}: {
  plan: string;
  label: string;
  primary?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    createInvoiceAction,
    idle,
  );
  const router = useRouter();
  useEffect(() => {
    // Opens the order summary popup for the new invoice.
    if (state.ok) router.replace("/dashboard/plan?order=new", { scroll: false });
  }, [state, router]);
  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="plan" value={plan} />
      <Button
        type="submit"
        variant={primary ? "primary" : "secondary"}
        className="w-full"
        loading={pending}
      >
        {label}
      </Button>
      {state.message && !state.ok && (
        <p className="mt-2 text-xs text-error">{state.message}</p>
      )}
    </form>
  );
}

export type CheckoutMethod = {
  id: string;
  name: string;
  subtitle: string;
  description: string | null;
  kind: "BITCOIN" | "MANUAL";
  logoUrl: string | null;
  glyph: string | null;
  accent: string | null;
  instructions: string | null;
};

export function MethodGrid({
  methods,
  orderId,
  payHref,
}: {
  methods: CheckoutMethod[];
  orderId: string | null;
  /** Without an invoice, "Pay Now" links here (the public Payment Methods page). */
  payHref?: string;
}) {
  // The invoice is captured when the window opens, so a page refresh behind it (e.g. after reporting a payment) doesn't close it.
  const [active, setActive] = useState<{
    method: CheckoutMethod;
    orderId: string;
  } | null>(null);
  return (
    <>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {methods.map((m, i) => (
          <li
            key={m.id}
            className="flex flex-col rounded-[16px] border border-border bg-card p-5 shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="flex items-center gap-3.5">
              <MethodLogo {...m} />
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold text-text">
                  {m.name}
                </h3>
                <p className="text-sm text-muted">{m.subtitle}</p>
              </div>
            </div>
            {m.description && (
              <p className="mt-3 text-sm leading-6 text-muted">
                {m.description}
              </p>
            )}
            <div className="mt-auto pt-4">
              {m.instructions && (
                <details className="group mb-3 rounded-xl border border-border bg-inset">
                  <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-muted hover:text-text [&::-webkit-details-marker]:hidden">
                    How to pay{" "}
                    <ChevronDown
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="whitespace-pre-line border-t border-border px-4 py-3 text-sm leading-6 text-muted">
                    {m.instructions}
                  </p>
                </details>
              )}
              {orderId ? (
                <Button
                  type="button"
                  className="w-full"
                  data-pay={i === 0 ? "" : undefined}
                  onClick={() => setActive({ method: m, orderId })}
                >
                  Pay Now
                </Button>
              ) : payHref ? (
                <Link
                  href={payHref}
                  className={buttonClasses({ className: "w-full" })}
                >
                  Pay Now
                </Link>
              ) : (
                <Link
                  href="#packs"
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-border-strong text-sm font-semibold text-muted hover:text-text"
                >
                  Choose a pack first
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      {active && (
        <PaymentModal
          method={active.method}
          orderId={active.orderId}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}

function PaymentModal({
  method,
  orderId,
  onClose,
}: {
  method: CheckoutMethod;
  orderId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<RequestView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = useCallback((r: PayResult) => {
    if (r.ok) {
      setView(r.view);
      setError(null);
    } else setError(r.message);
  }, []);

  const start = useCallback(async () => {
    setBusy(true);
    apply(await beginPayment(orderId, method.id));
    setBusy(false);
  }, [apply, method.id, orderId]);

  useEffect(() => {
    ref.current?.showModal();
    let cancelled = false;
    beginPayment(orderId, method.id).then((r) => {
      if (!cancelled) apply(r);
    });
    return () => {
      cancelled = true;
    };
  }, [apply, method.id, orderId]);

  const paid = view?.orderStatus === "PAID";
  const watching =
    view?.kind === "BITCOIN" &&
    !paid &&
    (view.status === "AWAITING" || view.status === "DETECTED");
  useEffect(() => {
    if (!watching || !view) return;
    const t = setInterval(async () => {
      const res = await fetch(`/api/checkout/requests/${view.id}`, {
        cache: "no-store",
      }).catch(() => null);
      if (res?.ok) setView(await res.json());
    }, POLL_MS);
    return () => clearInterval(t);
  }, [watching, view]);

  const close = () => {
    ref.current?.close();
    onClose();
    router.refresh();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="pay-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === ref.current && close()}
      className="m-auto max-h-[92vh] w-[min(94vw,30rem)] overflow-y-auto rounded-[18px] border border-border-strong bg-card p-0 text-text shadow-lg backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <MethodLogo {...method} />
          <div className="min-w-0 flex-1">
            <h2 id="pay-title" className="font-display text-lg font-bold">
              {method.kind === "BITCOIN"
                ? `${method.name} Payment`
                : `Pay with ${method.name}`}
            </h2>
            <p className="text-sm text-muted">
              {view
                ? `Invoice ${view.invoiceNumber} · ${formatMoney(view.usdCents)} USD`
                : method.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-inset hover:text-text"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5" aria-live="polite">
          {!view && !error && (
            <div className="grid place-items-center gap-3 py-12 text-sm text-muted">
              <Loader2
                className="h-6 w-6 animate-spin text-accent"
                aria-hidden
              />
              {method.kind === "BITCOIN"
                ? "Getting a live Bitcoin price…"
                : "Loading payment details…"}
            </div>
          )}
          {error && (
            <div
              className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error"
              role="alert"
            >
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" aria-hidden /> {error}
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={start}
                loading={busy}
              >
                Try again
              </Button>
            </div>
          )}
          {view && paid && <PaidPanel onClose={close} />}
          {view && !paid && view.kind === "BITCOIN" && (
            <BitcoinPanel
              view={view}
              onRequote={start}
              busy={busy}
            />
          )}
          {view && !paid && view.kind === "MANUAL" && (
            <ManualPanel view={view} />
          )}
        </div>
      </div>
    </dialog>
  );
}

function PaidPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-[14px] border border-success/35 bg-success/[0.07] p-6 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
      <h3 className="mt-3 font-display text-xl font-bold">
        Payment Successful!
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        Your payment has been confirmed successfully. We&apos;re activating your IPTV account now; your login details will appear in My Subscription as soon as it&apos;s ready.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/subscription"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary"
        >
          My Subscription <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

function BitcoinPanel({
  view,
  onRequote,
  busy,
}: {
  view: RequestView;
  onRequote: () => void;
  busy: boolean;
}) {
  const now = useNow(view.status === "AWAITING");
  const [qr, setQr] = useState<string | null>(null);
  const sats = view.amountSats ?? 0;
  const btc = formatBtc(sats);
  const network = (view.network ?? "mainnet") as BtcNetwork;
  const left = new Date(view.expiresAt).getTime() - now;
  const quoteExpired = view.status === "AWAITING" && left <= 0;

  useEffect(() => {
    if (!view.address) return;
    QRCode.toDataURL(bip21(view.address, sats), {
      margin: 1,
      width: 360,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, [view.address, sats]);

  if (view.status === "UNDERPAID") {
    const received = view.receivedSats ?? 0;
    return (
      <div className="rounded-[14px] border border-warning/35 bg-warning/[0.07] p-5 text-sm">
        <p className="flex items-center gap-2 font-semibold text-warning">
          <AlertTriangle className="h-4 w-4" aria-hidden /> Payment received,
          but it was short
        </p>
        <p className="mt-2 leading-6 text-muted">
          We received{" "}
          <span className="font-mono text-text">{formatBtc(received)} BTC</span>{" "}
          of the <span className="font-mono text-text">{btc} BTC</span>{" "}
          requested (
          <span className="font-mono">
            {formatBtc(Math.max(0, sats - received))} BTC
          </span>{" "}
          short). Our team has been notified and will help you complete or
          refund the payment.
        </p>
        <Link
          href="/dashboard/support/new"
          className="mt-4 inline-flex items-center gap-1.5 font-semibold text-accent hover:text-light-blue"
        >
          Contact support <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {view.status === "AWAITING" && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm",
            quoteExpired
              ? "border-error/35 bg-error/10 text-error"
              : "border-warning/30 bg-warning/[0.08] text-warning",
          )}
        >
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          {quoteExpired ? (
            "This price quote has expired."
          ) : (
            <span>
              Price locked for{" "}
              <span className="font-mono font-semibold">{mmss(left)}</span>
            </span>
          )}
        </div>
      )}

      {quoteExpired ? (
        <div className="rounded-xl border border-border bg-inset p-5 text-center text-sm text-muted">
          <p>
            Don&apos;t send to an expired quote. Get a fresh price to continue.
          </p>
          <Button
            type="button"
            className="mt-4"
            onClick={onRequote}
            loading={busy}
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Get a new quote
          </Button>
        </div>
      ) : (
        <>
          {qr && view.status === "AWAITING" && (
            // eslint-disable-next-line @next/next/no-img-element -- generated data URL
            <img
              src={qr}
              alt={`QR code for paying ${btc} BTC to the wallet address below`}
              className="mx-auto h-44 w-44 rounded-xl bg-white p-2"
            />
          )}
          <CopyField
            label="Wallet Address"
            value={view.address ?? ""}
            compact
          />
          <CopyField label="Amount to Send (BTC)" value={btc} compact />
          <p className="-mt-2 text-xs text-subtle">
            {btc} BTC = {formatMoney(view.usdCents)} USD
            {view.rateUsd
              ? ` at ${formatMoney(Math.round(Number(view.rateUsd) * 100))}/BTC`
              : ""}
            . Send this exact amount in one transaction; the last digits
            identify your invoice.
          </p>
          <p className="flex items-center gap-2 rounded-xl border border-border bg-inset px-4 py-2.5 text-sm text-muted">
            <Radio className="h-4 w-4 text-accent" aria-hidden /> Network:{" "}
            {view.method?.networkLabel ?? "Bitcoin Network"}
            {network === "testnet4" && (
              <span className="text-warning">(testnet)</span>
            )}
          </p>
          {view.method?.paymentUrl && (
            <a
              href={view.method.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/50 text-sm font-semibold text-light-blue hover:bg-primary/10"
            >
              Open {view.method.name}{" "}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
          {view.method?.instructions && (
            <p className="whitespace-pre-line text-xs leading-5 text-subtle">
              {view.method.instructions}
            </p>
          )}
        </>
      )}

      <div className="rounded-[14px] border border-primary/25 bg-primary/[0.06] p-4 text-center">
        {view.status === "DETECTED" ? (
          <>
            <ShieldCheck className="mx-auto h-6 w-6 text-accent" aria-hidden />
            <p className="mt-2 font-semibold">
              Payment detected — Pending Confirmation
            </p>
            <p className="mt-1 text-xs text-muted">
              {view.confirmations} of {view.required} confirmation
              {view.required === 1 ? "" : "s"}. Your pack activates
              automatically; you can close this window.
            </p>
            {view.txid && !view.txid.startsWith("sandbox") && (
              <a
                href={explorerTxUrl(view.txid, network)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-accent"
              >
                View transaction{" "}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
          </>
        ) : (
          !quoteExpired && (
            <>
              <Loader2
                className="mx-auto h-5 w-5 animate-spin text-accent"
                aria-hidden
              />
              <p className="mt-2 font-semibold">Waiting for Payment…</p>
              <p className="mt-1 text-xs text-muted">
                Checking the blockchain automatically every 15 seconds.
              </p>
              <IHavePaidButton orderId={view.orderId} requestId={view.id} className="mt-4" />
            </>
          )
        )}
      </div>

    </div>
  );
}

function ManualPanel({ view }: { view: RequestView }) {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (
    view.status === "REPORTED" ||
    view.orderStatus === "PENDING_CONFIRMATION"
  ) {
    return (
      <div className="rounded-[14px] border border-primary/30 bg-primary/[0.06] p-5 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-accent" aria-hidden />
        <p className="mt-3 font-semibold">Pending Confirmation</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Thanks. We&apos;re checking that your payment arrived and will notify you as soon as it&apos;s verified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CopyField
        label="Amount to Send (USD)"
        value={(view.usdCents / 100).toFixed(2)}
        compact
      />
      {view.method?.account && (
        <CopyField
          label={`Send to (${view.method.name})`}
          value={view.method.account}
          compact
        />
      )}
      <CopyField
        label="Note / memo — include this"
        value={view.invoiceNumber}
        compact
      />
      {view.method?.instructions && (
        <p className="whitespace-pre-line rounded-xl border border-border bg-inset p-4 text-sm leading-6 text-muted">
          {view.method.instructions}
        </p>
      )}
      {view.method?.paymentUrl && (
        <a
          href={view.method.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/50 text-sm font-semibold text-light-blue hover:bg-primary/10"
        >
          Open {view.method.name}{" "}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      )}
      <form
        className="space-y-3 border-t border-border pt-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const r = await submitPaymentReviewAction(view.orderId, view.id, reference);
          if (r.ok) return router.push(r.href);
          setBusy(false);
          setError(r.message);
        }}
      >
        <label htmlFor="pay-ref" className="block text-sm font-medium">
          Transaction ID or reference{" "}
          <span className="font-normal text-subtle">
            (optional, helps us find it)
          </span>
        </label>
        <Input
          id="pay-ref"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          maxLength={120}
          autoComplete="off"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" className="w-full" loading={busy}>
          I Have Paid
        </Button>
        <p className="text-xs leading-5 text-subtle">
          This sends your payment for review; it isn&apos;t confirmed until our team verifies it arrived. Only send to the details shown here.
        </p>
      </form>
    </div>
  );
}
