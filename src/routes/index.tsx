import { createFileRoute } from "@tanstack/react-router";
import StoryPage from "@/components/story/StoryPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hospital Readmission Analysis — From Raw Data to Business Insights" },
      {
        name: "description",
        content:
          "An editorial deep-dive into 101,766 diabetic patient records — what actually drives 30-day hospital readmission, and what hospitals should do about it.",
      },
      { property: "og:title", content: "Hospital Readmission Analysis" },
      {
        property: "og:description",
        content:
          "Analyzing 101,766 diabetic patient records to understand what drives 30-day hospital readmission.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <StoryPage />;
}
