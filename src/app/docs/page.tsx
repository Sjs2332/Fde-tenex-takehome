import { Header } from "@/components/landing_page/Header";
import { Footer } from "@/components/landing_page/Footer";
import {
    DocsHero,
    DocsSidebar,
    FeaturesSection,
    ComponentShowcaseSection,
    ArchitectureSection,
    TechStackSection,
    ApiReferenceSection,
    SecuritySection,
    GettingStartedSection,
} from "@/components/docs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Docs | Tenex Intelligence",
    description:
        "Documentation for Tenex Intelligence — AI-powered calendar management, architecture overview, API reference, and setup guide.",
};

export default function DocsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <DocsHero />

                <div className="mx-auto max-w-7xl px-4 py-16 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
                    <DocsSidebar />

                    <div className="space-y-24">
                        <FeaturesSection />
                        <ComponentShowcaseSection />
                        <ArchitectureSection />
                        <TechStackSection />
                        <ApiReferenceSection />
                        <SecuritySection />
                        <GettingStartedSection />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
