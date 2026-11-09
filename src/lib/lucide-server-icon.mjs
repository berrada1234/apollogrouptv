/**
 * Server build of lucide-react's base Icon (node_modules/lucide-react/dist/esm/Icon.mjs, v1.66.0, ISC).
 *
 * lucide-react v1 marks Icon "use client" so it can read LucideProvider context. That turned every icon used in a
 * server component into a client component: each one was serialized into the page's RSC payload and hydrated in
 * the browser (155 on the homepage), a large share of mobile Total Blocking Time. The site never uses
 * LucideProvider, so on the server this copy renders the same <svg> with the context defaults and no client
 * boundary. next.config.ts swaps it in for server compilations only; client components keep the original module,
 * and the markup is identical, so hydration matches.
 */
import { forwardRef, createElement } from "react";
import { mergeClasses } from "@lucide-shared/utils/mergeClasses.mjs";
import buildLucideIconForReact from "@lucide-shared/build/buildLucideIconForReact.mjs";
import { hasA11yProp } from "@lucide-shared/utils/hasA11yProp.mjs";

const Icon = forwardRef(
  (
    {
      color,
      size,
      width,
      height,
      strokeWidth,
      absoluteStrokeWidth,
      nonScalingStroke,
      className = "",
      children,
      iconNode = [],
      icon = { node: iconNode, aliases: [], size: 24 },
      ...rest
    },
    ref,
  ) => {
    const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
    const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
      color: color ?? "currentColor",
      width: width ?? size ?? 24,
      height: height ?? size ?? 24,
      strokeWidth: strokeWidth ?? 2,
      absoluteStrokeWidth: absoluteStrokeWidth ?? false,
      nonScalingStroke: nonScalingStroke ?? false,
      className: mergeClasses("", className),
      hasA11yProp: hasAccessibleProp,
      attributes: rest,
    });
    return createElement(name, { ref, ...svgAttributes }, [
      ...builtIconNode.map(([tag, attrs]) => createElement(tag, attrs)),
      ...(Array.isArray(children) ? children : [children]),
    ]);
  },
);

Icon.displayName = "Icon";

export { Icon as default };
