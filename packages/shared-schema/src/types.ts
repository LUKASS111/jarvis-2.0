// Schema Version: 2.1.0

// ====================================================================
// === SECTION 1: CORE IDENTIFICATION
// ====================================================================

interface Timestamps {
  createdAt: string;       // ISO 8601 datetime when the unit was created in Jarvis.
  modifiedAt: string;      // ISO 8601 datetime of the last modification in Jarvis.
  sourceCreatedAt?: string; // ISO 8601 datetime of the original source creation.
  sourceModifiedAt?: string;// ISO 8601 datetime of the original source modification.
  accessedAt?: string;      // ISO 8601 datetime when Jarvis last actively used this unit.
  validFrom?: string;       // ISO 8601 datetime when the information becomes valid.
  validUntil?: string;      // ISO 8601 datetime when the information expires.
}

interface Source {
  type: 'file_system' | 'email' | 'web_scrape' | 'api' | 'user_input' | 'derived';
  originIdentifier: string; // Original identifier (path, URL, email Message-ID).
  ingestedByModule: string; // Name and version of the module that added this unit.
  ingestionProfile?: string; // Profile used for processing.
}

// ====================================================================
// === SECTION 2: MODULAR ANALYSIS FORM (v2.1)
// ====================================================================

interface CoreAnalysis {
  baseType: 'text' | 'image' | 'audio' | 'video' | 'document' | 'spreadsheet' | 'code' | 'archive' | 'geospatial' | '3d_model' | 'tabular_data' | 'binary' | 'unknown';
  mimeTypes?: string[];
  fileExtension?: string;
  isHumanReadable?: boolean;
  isMachineGenerated?: boolean;
  isEncrypted?: boolean;
  isPasswordProtected?: boolean;
  isCompressed?: boolean;
  hasDigitalSignature?: boolean;
  sizeInBytes?: number;
  checksums?: {
    md5?: string;
    sha1?: string;
    sha256?: string;
  };
  language?: string; // ISO 639-1 code
  containsPII?: boolean;
  containsFinancialData?: boolean;
  containsLoginCredentials?: boolean;
  containsMedicalInfo?: boolean;
  containsLegalInfo?: boolean;
  containsExplicitContent?: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  isActionable?: boolean;
  isArchived?: boolean;
  isConfidential?: boolean;
  isPublic?: boolean;
  trustScore?: number; // 0-1
  dataQualityScore?: number; // 0-1
  lifecycleStatus?: 'hot' | 'warm' | 'cold' | 'expiring' | 'deleted';
  sensitivityLevel?: 'public' | 'internal' | 'confidential' | 'highly_restricted';
  isDerived?: boolean;
  entropy?: number;
  processingStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  processingErrors?: string[];
}

interface TextAnalysis {
  wordCount?: number;
  charCount?: number;
  lineCount?: number;
  paragraphCount?: number;
  readingTimeMinutes?: number;
  complexityScore?: number;
  keywords?: string[];
  topics?: string[];
  entities?: { text: string; type: string }[];
  isScannedOCR?: boolean;
  ocrConfidence?: number;
  extractiveSummary?: string;
  abstractiveSummary?: string;
  isFormalLanguage?: boolean;
  readabilityScores?: { [key: string]: number };
}

interface ImageAnalysis {
  dimensions?: { width: number; height: number };
  resolutionDPI?: { x: number; y: number };
  colorModel?: 'RGB' | 'CMYK' | 'Grayscale';
  colorDepth?: number;
  hasAlphaChannel?: boolean;
  dominantColors?: string[];
  detectedObjects?: { label: string; confidence: number; box: [number, number, number, number] }[];
  faceCount?: number;
  exifData?: { [key: string]: any };
  aestheticScore?: number;
  isMeme?: boolean;
  isScreenshot?: boolean;
  hasSteganography?: boolean;
  colorProfile?: string;
  textOnImage?: string[];
}

interface DocumentAnalysis {
    author?: string;
    pageCount?: number;
    title?: string;
    hasMacros?: boolean;
    hasForms?: boolean;
    templateUsed?: string;
    tableCount?: number;
    chartCount?: number;
    revisionHistoryCount?: number;
}

interface FinancialAnalysis {
    type?: 'invoice' | 'receipt' | 'bank_statement' | 'offer' | 'quote' | 'financial_report';
    currency?: string; // ISO 4217 code
    totalAmount?: number;
    taxAmount?: number;
    netAmount?: number;
    invoiceNumber?: string;
    paymentDueDate?: string; // ISO 8601 datetime
    iban?: string;
    sender?: { name?: string; taxId?: string; address?: string };
    recipient?: { name?: string; taxId?: string; address?: string };
    lineItems?: { description: string; quantity: number; unitPrice: number; total: number; taxRate?: number }[];
    paymentMethod?: 'bank_transfer' | 'card' | 'cash' | 'crypto';
    isPaid?: boolean;
    paidAt?: string; // ISO 8601 datetime
}

// ... Define other domain analysis interfaces: Code, Geospatial, CAD, Audio, Video, Email, Web, Calendar, Contact...

interface AnalysisDomains {
  textAnalysis?: TextAnalysis;
  imageAnalysis?: ImageAnalysis;
  documentAnalysis?: DocumentAnalysis;
  financialAnalysis?: FinancialAnalysis;
  // codeAnalysis?: CodeAnalysis;
  // emailAnalysis?: EmailAnalysis;
  // ... and so on for all other domains
}

interface Analysis {
  core: CoreAnalysis;
  domains: AnalysisDomains;
}

// ====================================================================
// === SECTION 3: CORE KNOWLEDGE UNIT DEFINITION
// ====================================================================

export interface KnowledgeUnit {
  // --- Core Identification ---
  id: string; // UUID
  schemaVersion: '2.1.0';
  timestamps: Timestamps;
  source: Source;

  // --- Analysis Form ---
  analysis: Analysis;

  // --- User Data and Relations ---
  userTags?: string[];
  autoTags?: string[];
  customData?: { [key: string]: any };
  rawContent?: string; // For text-based units like notes
  binary?: {
    fileHash: string; // SHA256 of the file
    originalFilename: string;
    mimeType: string;
    fileSize: number;
  };
  relations?: {
    type: string; // e.g., 'mentions_contact', 'part_of_project', 'replaces'
    targetId: string; // UUID of the other KnowledgeUnit
    context?: string;
  }[];
}
