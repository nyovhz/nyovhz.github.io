// ShaderBackground.tsx
'use client'

import InteractiveMetaballs from "./main";

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-100 pointer-events-none">
      <InteractiveMetaballs />
    </div>
  );
}
