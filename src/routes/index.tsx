import { createFileRoute } from "@tanstack/react-router";

import { Wizard } from "@/components/process/wizard";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Wizard />;
}
