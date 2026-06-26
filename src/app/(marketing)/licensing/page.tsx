import type { Metadata } from "next";
import LicensingClient from "./client";

export const metadata: Metadata = {
  title: "Licensing | OpenLearn XR",
  description:
    "Explore OpenLearn XR pricing plans — from free individual access to full enterprise XR deployment. Find the right license for your school, department, or research institution.",
};

export default function LicensingPage() {
  return <LicensingClient />;
}
