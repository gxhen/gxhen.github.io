export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'cv';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface CvEntry {
    title: string;
    organization?: string;
    department?: string;
    location?: string;
    period?: string;
    details?: string[];
}

export interface CvFunding {
    title: string;
    role?: string;
    period?: string;
    topic?: string;
}

export interface CvListSection {
    category: string;
    items: string[];
}

export interface CvLabels {
    career?: string;
    education?: string;
    honors?: string;
    research_interests?: string;
    publications?: string;
    journal_publications?: string;
    conference_publications?: string;
    teaching?: string;
    funding?: string;
    supervision?: string;
    activities?: string;
    download_pdf?: string;
    print?: string;
}

export interface CvPageConfig extends BasePageConfig {
    type: 'cv';
    pdf?: string;
    publications_source?: string;
    labels?: CvLabels;
    titles?: string[];
    research_summary?: string;
    research_items?: string[];
    career?: CvEntry[];
    education?: CvEntry[];
    honors?: string[];
    teaching?: CvEntry[];
    funding?: CvFunding[];
    supervision?: CvListSection[];
    activities?: CvListSection[];
}

export interface CvIdentity {
    name: string;
    title: string;
    institution: string;
    email?: string;
    location?: string;
    google_scholar?: string;
    github?: string;
}
