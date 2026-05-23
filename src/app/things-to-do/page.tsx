import type { Metadata } from "next";
import ThingsToDoContent from "./ThingsToDoContent";

export const metadata: Metadata = {
  title: "Things to Do in Austin",
  description:
    "Our favorite spots in Austin — coffee, eats, drinks, and outdoor activities for guests making a weekend of it.",
};

export default function ThingsToDoPage() {
  return <ThingsToDoContent />;
}
