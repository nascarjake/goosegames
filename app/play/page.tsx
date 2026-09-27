import { Suspense } from "react";
import { GameDetails } from "../components/GameDetails";

export default function PlayPage() {
  return <Suspense fallback={null}><GameDetails /></Suspense>;
}
