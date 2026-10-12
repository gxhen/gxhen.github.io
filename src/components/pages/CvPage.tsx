'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
    ArrowDownTrayIcon,
    PrinterIcon,
    EnvelopeIcon,
    MapPinIcon,
    GlobeAltIcon,
    AcademicCapIcon,
    CodeBracketIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { CvPageConfig, CvEntry, CvIdentity, CvFunding, CvListSection } from '@/types/page';
import { Publication } from '@/types/publication';
import { cn } from '@/lib/utils';

interface CvPageProps {
    config: CvPageConfig;
    publications: Publication[];
    identity: CvIdentity;
}

const DEFAULT_LABELS = {
    career: 'Career',
    education: 'Education',
    honors: 'Honors & Awards',
    research_interests: 'Research Interests',
    publications: 'Publications',
    journal_publications: 'Journal Publications',
    conference_publications: 'Conference Publications',
    teaching: 'Teaching Experience',
    funding: 'Funding',
    supervision: 'Supervision',
    activities: 'Professional Activities',
    download_pdf: 'Download PDF',
    print: 'Print',
};

function InlineMarkdown({ text, className }: { text: string; className?: string }) {
    return (
        <span className={className}>
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({ children }) => <>{children}</>,
                    a: ({ ...props }) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent font-medium hover:underline underline-offset-2"
                        />
                    ),
                }}
            >
                {text}
            </ReactMarkdown>
        </span>
    );
}

function SectionShell({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="cv-reveal scroll-mt-36"
        >
            <div className="flex items-center gap-3 mb-6">
                <span className="h-7 w-1.5 rounded-full bg-accent" />
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            {children}
        </motion.section>
    );
}

function Timeline({ entries }: { entries: CvEntry[] }) {
    return (
        <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-4 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
                {entries.map((entry, index) => (
                    <div key={index} className="relative pl-9 pb-8 last:pb-0">
                        <span className="absolute left-0 top-[6px] h-[15px] w-[15px] rounded-full border-[3px] border-accent bg-background" />
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                            <h3 className="text-lg font-semibold text-primary leading-snug">
                                {entry.title}
                            </h3>
                            {entry.period && (
                                <span className="shrink-0 self-start text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                                    {entry.period}
                                </span>
                            )}
                        </div>
                        {(entry.organization || entry.department || entry.location) && (
                            <p className="mt-1 text-[15px] text-neutral-700 dark:text-neutral-300">
                                {entry.organization && (
                                    <span className="font-medium">{entry.organization}</span>
                                )}
                                {entry.department && (
                                    <span className="text-neutral-500 dark:text-neutral-400">
                                        {entry.organization ? ', ' : ''}
                                        {entry.department}
                                    </span>
                                )}
                                {entry.location && (
                                    <span className="text-neutral-400 dark:text-neutral-500">
                                        {(entry.organization || entry.department) ? ' · ' : ''}
                                        {entry.location}
                                    </span>
                                )}
                            </p>
                        )}
                        {entry.details && entry.details.length > 0 && (
                            <ul className="mt-2 space-y-1">
                                {entry.details.map((detail, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                                    >
                                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                                        <InlineMarkdown text={detail} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AuthorList({ publication }: { publication: Publication }) {
    return (
        <>
            {publication.authors.map((author, idx) => (
                <span key={idx}>
                    <span
                        className={cn(
                            author.isHighlighted && 'font-semibold text-accent',
                            author.isCoAuthor && 'underline underline-offset-4 decoration-neutral-400'
                        )}
                    >
                        {author.name}
                    </span>
                    {author.isCorresponding && (
                        <sup className={cn('font-semibold', author.isHighlighted ? 'text-accent' : 'text-red-500')}>
                            *
                        </sup>
                    )}
                    {idx < publication.authors.length - 1 && ', '}
                </span>
            ))}
        </>
    );
}

function PublicationGroup({
    title,
    prefix,
    publications,
}: {
    title: string;
    prefix: string;
    publications: Publication[];
}) {
    if (publications.length === 0) return null;

    return (
        <div className="mb-8 last:mb-0">
            <div className="flex items-baseline gap-2 mb-4">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                <span className="text-sm text-neutral-400 dark:text-neutral-500 tabular-nums">
                    ({publications.length})
                </span>
            </div>
            <ol className="space-y-4">
                {publications.map((pub, index) => (
                    <li key={pub.id} className="flex gap-3 group">
                        <span className="shrink-0 w-11 text-right font-mono text-sm font-semibold text-accent tabular-nums pt-px">
                            [{prefix}{index + 1}]
                        </span>
                        <div className="min-w-0 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                            <p>
                                <AuthorList publication={pub} />
                                {', '}
                                <span className="text-primary font-medium">“{pub.title},”</span>{' '}
                                <span className="italic">{pub.journal || pub.conference}</span>
                                {pub.volume && `, vol. ${pub.volume}`}
                                {pub.issue && `, no. ${pub.issue}`}
                                {pub.pages && `, pp. ${pub.pages.replace(/--/g, '–')}`}
                                {`, ${pub.year}`}
                                {pub.description && (
                                    <span className="text-neutral-500 dark:text-neutral-500">
                                        {' '}({pub.description})
                                    </span>
                                )}
                                .
                                {(pub.ccf || pub.jcr) && (
                                    <span className="inline-flex gap-1.5 ml-2 align-middle">
                                        {pub.ccf && (
                                            <span className={cn(
                                                'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold leading-none',
                                                pub.ccf === 'A'
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : pub.ccf === 'B'
                                                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            )}>
                                                CCF {pub.ccf}
                                            </span>
                                        )}
                                        {pub.jcr && (
                                            <span className={cn(
                                                'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold leading-none',
                                                pub.jcr === 'Q1'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : pub.jcr === 'Q2'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                            )}>
                                                JCR {pub.jcr}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </p>
                            {(pub.url || pub.arxiv || pub.code) && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {pub.url && (
                                        <a
                                            href={pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            Paper
                                        </a>
                                    )}
                                    {pub.arxiv && (
                                        <a
                                            href={pub.arxiv}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            arXiv
                                        </a>
                                    )}
                                    {pub.code && (
                                        <a
                                            href={pub.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            Code
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

function FundingList({ items }: { items: CvFunding[] }) {
    return (
        <div className="space-y-5">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="border-l-2 border-accent/70 pl-4 py-0.5"
                >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <h3 className="font-semibold text-primary leading-snug">{item.title}</h3>
                        {item.period && (
                            <span className="shrink-0 self-start text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                                {item.period}
                            </span>
                        )}
                    </div>
                    <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 space-y-0.5">
                        {item.role && <p className="font-medium text-accent-dark dark:text-accent">{item.role}</p>}
                        {item.topic && <p className="leading-relaxed">{item.topic}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

function SupervisionGrid({ sections }: { sections: CvListSection[] }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-baseline justify-between mb-3">
                        <h3 className="font-semibold text-primary">{section.category}</h3>
                        <span className="text-xs font-semibold text-accent tabular-nums">
                            {section.items.length}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {section.items.join(' · ')}
                    </p>
                </div>
            ))}
        </div>
    );
}

function ActivityList({ sections }: { sections: CvListSection[] }) {
    return (
        <div className="space-y-6">
            {sections.map((section, index) => (
                <div key={index}>
                    <h3 className="font-semibold text-primary mb-2.5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {section.category}
                    </h3>
                    <ul className="space-y-1.5 ml-3.5">
                        {section.items.map((item, i) => (
                            <li
                                key={i}
                                className="flex gap-2.5 text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed"
                            >
                                <span className="mt-[11px] h-px w-3 shrink-0 bg-accent/60" />
                                <InlineMarkdown text={item} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default function CvPage({ config, publications, identity }: CvPageProps) {
    const labels = { ...DEFAULT_LABELS, ...(config.labels || {}) };

    const journalPublications = useMemo(
        () => publications.filter((p) => p.type === 'journal'),
        [publications]
    );
    const conferencePublications = useMemo(
        () => publications.filter((p) => p.type === 'conference'),
        [publications]
    );

    const sections = useMemo(() => {
        const list: { id: string; label: string }[] = [];
        if (config.career?.length) list.push({ id: 'cv-career', label: labels.career });
        if (config.education?.length) list.push({ id: 'cv-education', label: labels.education });
        if (config.honors?.length) list.push({ id: 'cv-honors', label: labels.honors });
        if (config.research_items?.length) list.push({ id: 'cv-research', label: labels.research_interests });
        if (journalPublications.length + conferencePublications.length > 0) {
            list.push({ id: 'cv-publications', label: labels.publications });
        }
        if (config.teaching?.length) list.push({ id: 'cv-teaching', label: labels.teaching });
        if (config.funding?.length) list.push({ id: 'cv-funding', label: labels.funding });
        if (config.supervision?.length) list.push({ id: 'cv-supervision', label: labels.supervision });
        if (config.activities?.length) list.push({ id: 'cv-activities', label: labels.activities });
        return list;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, journalPublications.length, conferencePublications.length]);

    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const visible = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visible.add(entry.target.id);
                    } else {
                        visible.delete(entry.target.id);
                    }
                });
                const firstVisible = sections.find((s) => visible.has(s.id));
                if (firstVisible) {
                    setActiveSection(firstVisible.id);
                }
            },
            { rootMargin: '-25% 0px -65% 0px' }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            {/* Letterhead */}
            <header className="pb-8 border-b-2 border-primary/10 dark:border-neutral-800">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p className="text-sm font-medium tracking-widest uppercase text-accent mb-2">
                            {config.title}
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary leading-tight">
                            {identity.name}
                        </h1>
                        <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
                            {identity.title}, {identity.institution}
                        </p>
                        {config.titles && config.titles.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {config.titles.map((title, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-sm font-medium text-accent-dark dark:text-accent shadow-sm"
                                    >
                                        <TrophyIcon className="h-3.5 w-3.5" />
                                        {title}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                            {identity.email && (
                                <a
                                    href={`mailto:${identity.email}`}
                                    className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                                >
                                    <EnvelopeIcon className="h-4 w-4" />
                                    {identity.email}
                                </a>
                            )}
                            {identity.google_scholar && (
                                <a
                                    href={identity.google_scholar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                                >
                                    <AcademicCapIcon className="h-4 w-4" />
                                    Google Scholar
                                </a>
                            )}
                            {identity.github && (
                                <a
                                    href={identity.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                                >
                                    <CodeBracketIcon className="h-4 w-4" />
                                    GitHub
                                </a>
                            )}
                            <a
                                href="https://gxhen.github.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                            >
                                <GlobeAltIcon className="h-4 w-4" />
                                gxhen.github.io
                            </a>
                            {identity.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPinIcon className="h-4 w-4" />
                                    {identity.location}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-col gap-2.5 shrink-0 print:hidden">
                        {config.pdf && (
                            <a
                                href={config.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium shadow-sm hover:bg-accent-dark transition-colors"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                {labels.download_pdf}
                            </a>
                        )}
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:border-accent hover:text-accent transition-colors"
                        >
                            <PrinterIcon className="h-4 w-4" />
                            {labels.print}
                        </button>
                    </div>
                </div>
            </header>

            {/* Section quick nav */}
            {sections.length > 0 && (
                <nav className="sticky top-16 lg:top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mt-2 bg-background/85 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 print:hidden">
                    <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={cn(
                                    'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                                    activeSection === section.id
                                        ? 'bg-accent text-white'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:bg-accent/10 hover:text-accent'
                                )}
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>
                </nav>
            )}

            <div className="mt-10 space-y-14">
                {config.career && config.career.length > 0 && (
                    <SectionShell id="cv-career" title={labels.career}>
                        <Timeline entries={config.career} />
                    </SectionShell>
                )}

                {config.education && config.education.length > 0 && (
                    <SectionShell id="cv-education" title={labels.education}>
                        <Timeline entries={config.education} />
                    </SectionShell>
                )}

                {config.honors && config.honors.length > 0 && (
                    <SectionShell id="cv-honors" title={labels.honors}>
                        <ul className="space-y-2.5">
                            {config.honors.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex gap-3 text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed"
                                >
                                    <TrophyIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                                    <InlineMarkdown text={item} />
                                </li>
                            ))}
                        </ul>
                    </SectionShell>
                )}

                {config.research_items && config.research_items.length > 0 && (
                    <SectionShell id="cv-research" title={labels.research_interests}>
                        {config.research_summary && (
                            <p className="text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                                {config.research_summary}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {config.research_items.map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent-dark dark:text-accent"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </SectionShell>
                )}

                {(journalPublications.length > 0 || conferencePublications.length > 0) && (
                    <SectionShell id="cv-publications" title={labels.publications}>
                        <PublicationGroup
                            title={labels.journal_publications}
                            prefix="J"
                            publications={journalPublications}
                        />
                        <PublicationGroup
                            title={labels.conference_publications}
                            prefix="C"
                            publications={conferencePublications}
                        />
                    </SectionShell>
                )}

                {config.teaching && config.teaching.length > 0 && (
                    <SectionShell id="cv-teaching" title={labels.teaching}>
                        <Timeline entries={config.teaching} />
                    </SectionShell>
                )}

                {config.funding && config.funding.length > 0 && (
                    <SectionShell id="cv-funding" title={labels.funding}>
                        <FundingList items={config.funding} />
                    </SectionShell>
                )}

                {config.supervision && config.supervision.length > 0 && (
                    <SectionShell id="cv-supervision" title={labels.supervision}>
                        <SupervisionGrid sections={config.supervision} />
                    </SectionShell>
                )}

                {config.activities && config.activities.length > 0 && (
                    <SectionShell id="cv-activities" title={labels.activities}>
                        <ActivityList sections={config.activities} />
                    </SectionShell>
                )}
            </div>
        </motion.div>
    );
}
