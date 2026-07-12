export const COMPLIANCE_DOC_IDS = ["privacy", "terms", "support"] as const;

export type ComplianceDocId = (typeof COMPLIANCE_DOC_IDS)[number];

export interface ComplianceDataItem {
  label: string;
  detail: string;
}

export interface ComplianceFaqItem {
  question: string;
  answer: string;
}

export interface ProjectCompliance {
  productName: string;
  supportEmail: string;
  verifiedDomain: string;
  lastUpdated: string;
  privacy: {
    introduction: string;
    dataCollected: ComplianceDataItem[];
    permissions: ComplianceDataItem[];
    singlePurpose: string;
    noDataSelling: string;
    retention: string;
    deletion: string;
    thirdParties?: string;
  };
  terms: {
    introduction: string;
    eligibility: string;
    acceptableUse: string;
    payments: string;
    intellectualProperty: string;
    liability: string;
    changes: string;
  };
  support: {
    introduction: string;
    faq: ComplianceFaqItem[];
  };
}
