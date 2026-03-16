import Header from "@/components/Header";
import LearningPageClient from "./LearningPageClient";

/**
 * Learning Page - displays explanations and code examples from the tutor API response.
 * Data is passed via sessionStorage from the main page.
 */

export default function ProjectLearningPage() {
  return <LearningPageClient />;
}