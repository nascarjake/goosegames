import Link from "next/link";
import { WorkbenchShell } from "./components/WorkbenchShell";
export default function NotFound() {
  return <WorkbenchShell><div className="hero-copy" style={{ margin: "80px auto", padding: 24 }}><p className="eyebrow">404 / EMPTY SLOT</p><h2>CARTRIDGE NOT FOUND.</h2><p>This game isn’t in the cabinet. Let’s find you another one.</p><Link href="/#collection">Back to the games ↗</Link></div></WorkbenchShell>;
}
