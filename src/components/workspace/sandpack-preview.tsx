'use client';

import { Sandpack } from "@codesandbox/sandpack-react";

const starterCode = `export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Hello World</h1>
      <p>Sandpack is ready for live previews.</p>
    </div>
  );
}
`;

export default function SandpackPreview() {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Sandpack
        template="react"
        files={{
          "/App.js": {
            code: starterCode,
          },
        }}
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
