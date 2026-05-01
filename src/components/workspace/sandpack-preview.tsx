'use client';

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview as SandpackLivePreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

export const starterCode = `export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Hello World</h1>
      <p>Sandpack is ready for live previews.</p>
    </div>
  );
}
`;

export type SandpackFiles = Record<string, { code: string }>;

export type SandpackPreviewMode = "code" | "preview";

type SandpackPreviewProps = {
  files: SandpackFiles;
  mode: SandpackPreviewMode;
};

export default function SandpackPreview({ files, mode }: SandpackPreviewProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border bg-muted/20">
      <SandpackProvider
        template="react"
        files={files}
      >
        <SandpackLayout className="h-full">
          {mode === "code" ? (
            <div className="flex h-full w-full bg-background">
              <div className="w-48 border-r bg-muted/40">
                <div className="border-b px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                  Explorer
                </div>
                <SandpackFileExplorer className="h-full" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="border-b px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                  Editor
                </div>
                <SandpackCodeEditor
                  className="h-full min-w-0 flex-1 [&_.cm-scroller]:overflow-auto [&_.cm-content]:min-w-max"
                  showLineNumbers
                  wrapContent={false}
                />
              </div>
            </div>
          ) : (
            <SandpackLivePreview className="h-full bg-background" />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
