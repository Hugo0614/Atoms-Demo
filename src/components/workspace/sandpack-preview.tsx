'use client';

import {
  SandpackCodeEditor,
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
    <div className="h-full w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
      <SandpackProvider template="react" files={files}>
        <SandpackLayout className="h-full">
          {mode === "code" ? (
            <SandpackCodeEditor
              className="h-full"
              showLineNumbers
              wrapContent
            />
          ) : (
            <SandpackLivePreview className="h-full" />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
