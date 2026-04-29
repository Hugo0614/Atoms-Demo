'use client'

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { getSandpackCssText } from "@codesandbox/sandpack-react";

type SandpackRegistryProps = {
  children: React.ReactNode;
};

export default function SandpackRegistry({ children }: SandpackRegistryProps) {
  useServerInsertedHTML(() => (
    <style
      id="sandpack"
      dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
    />
  ));

  return <>{children}</>;
}
