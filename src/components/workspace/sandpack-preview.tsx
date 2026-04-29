'use client';

import { Sandpack } from "@codesandbox/sandpack-react";

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

type SandpackPreviewProps = {
  files: SandpackFiles;
};

export default function SandpackPreview({ files }: SandpackPreviewProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Sandpack
        template="react"
        files={files}
        options={{
          editorHeight: "100%",
          showLineNumbers: true,
          wrapContent: true,
          showTabs: false,
        }}
      />
    </div>
  );
}
