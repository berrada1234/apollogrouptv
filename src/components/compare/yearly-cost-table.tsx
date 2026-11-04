import Link from "next/link";
import { CHECKED, rivals } from "@/content/compare";
import type { ApolloCompare } from "@/lib/compare-data";

/** A year of each service at its regular published price, with Apollo's twelve-month pack from the live price list. */
export function YearlyCostTable({ apollo }: { apollo: ApolloCompare }) {
  const m = apollo.money;
  const rows = [...rivals].sort((a, b) => b.monthlyCents - a.monthlyCents);
  return (
    <figure className="my-8">
      <div className="glass relative overflow-x-auto rounded-[18px]">
        <table className="w-full min-w-[520px] text-sm">
          <caption className="sr-only">One year of live TV: Apollo Group TV compared with five live TV services</caption>
          <thead>
            <tr className="text-left text-subtle">
              <th scope="col" className="px-5 py-3.5 font-medium">Service</th>
              <th scope="col" className="px-5 py-3.5 font-medium">Plan compared</th>
              <th scope="col" className="px-5 py-3.5 text-right font-medium">One year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-border">
                <th scope="row" className="px-5 py-3.5 text-left font-medium text-text">
                  <Link href={r.path} className="hover:text-light-blue">
                    {r.name}
                  </Link>
                </th>
                <td className="px-5 py-3.5 text-muted">{`${r.planName}, ${m(r.monthlyCents)}/mo`}</td>
                <td className="px-5 py-3.5 text-right text-text tabular-nums">{m(r.monthlyCents * 12)}</td>
              </tr>
            ))}
            {apollo.yearlyCents !== null && (
              <tr className="border-t border-border bg-[rgb(122_162_255/0.08)]">
                <th scope="row" className="px-5 py-3.5 text-left font-semibold text-light-blue">
                  Apollo Group TV
                </th>
                <td className="px-5 py-3.5 text-muted">{apollo.yearlyName ?? "12-month pack"}, one payment</td>
                <td className="px-5 py-3.5 text-right font-semibold text-text tabular-nums">{m(apollo.yearlyCents)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-xs leading-5 text-subtle">
        Regular prices before taxes, fees and promotions, from each service&apos;s published pricing, checked {CHECKED}. Sources are listed on each comparison page.
      </figcaption>
    </figure>
  );
}
