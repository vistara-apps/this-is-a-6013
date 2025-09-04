import { parse } from "csv-parse/sync";

export interface CustomerRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  totalSpend?: number;
  customFields?: Record<string, any>;
}

export interface CleaningResult {
  cleaned: CustomerRecord[];
  duplicates: CustomerRecord[];
  errors: { row: number; error: string; data: any }[];
}

/**
 * Parse CSV content and return structured data
 */
export function parseCSV(content: string): any[] {
  try {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records;
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clean and standardize customer data
 */
export function cleanCustomerData(rawData: any[]): CleaningResult {
  const cleaned: CustomerRecord[] = [];
  const duplicates: CustomerRecord[] = [];
  const errors: { row: number; error: string; data: any }[] = [];
  const emailSet = new Set<string>();

  rawData.forEach((row, index) => {
    try {
      // Extract and clean basic fields
      const firstName = cleanName(row.firstName || row.first_name || row.fname || '');
      const lastName = cleanName(row.lastName || row.last_name || row.lname || '');
      const email = cleanEmail(row.email || row.emailAddress || row.email_address || '');
      const phone = cleanPhone(row.phone || row.phoneNumber || row.phone_number || '');
      
      // Validation
      if (!firstName || !lastName) {
        errors.push({
          row: index + 1,
          error: 'Missing required fields: firstName and lastName',
          data: row
        });
        return;
      }

      if (!email || !isValidEmail(email)) {
        errors.push({
          row: index + 1,
          error: 'Invalid or missing email address',
          data: row
        });
        return;
      }

      // Check for duplicates
      if (emailSet.has(email.toLowerCase())) {
        duplicates.push({
          firstName,
          lastName,
          email,
          phone,
          source: row.source || 'CSV Import',
          totalSpend: parseFloat(row.totalSpend || row.total_spend || '0') || 0,
          customFields: extractCustomFields(row)
        });
        return;
      }

      emailSet.add(email.toLowerCase());

      // Create cleaned record
      const cleanedRecord: CustomerRecord = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        source: row.source || 'CSV Import',
        totalSpend: parseFloat(row.totalSpend || row.total_spend || '0') || 0,
        customFields: extractCustomFields(row)
      };

      cleaned.push(cleanedRecord);
    } catch (error) {
      errors.push({
        row: index + 1,
        error: error instanceof Error ? error.message : 'Unknown processing error',
        data: row
      });
    }
  });

  return { cleaned, duplicates, errors };
}

/**
 * Clean and standardize name fields
 */
function cleanName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Clean and standardize email addresses
 */
function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Clean and standardize phone numbers
 */
function cleanPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters except + at the beginning
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with 1 and has 11 digits, add + prefix
  if (cleaned.match(/^1\d{10}$/)) {
    cleaned = '+' + cleaned;
  }
  // If it has 10 digits, assume US number
  else if (cleaned.match(/^\d{10}$/)) {
    cleaned = '+1' + cleaned;
  }
  // If it doesn't start with +, add it
  else if (cleaned.match(/^\d/) && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extract custom fields from raw data (excluding standard fields)
 */
function extractCustomFields(row: any): Record<string, any> {
  const standardFields = new Set([
    'firstName', 'first_name', 'fname',
    'lastName', 'last_name', 'lname',
    'email', 'emailAddress', 'email_address',
    'phone', 'phoneNumber', 'phone_number',
    'source', 'totalSpend', 'total_spend'
  ]);

  const customFields: Record<string, any> = {};
  
  Object.entries(row).forEach(([key, value]) => {
    if (!standardFields.has(key) && value !== null && value !== undefined && value !== '') {
      customFields[key] = value;
    }
  });

  return Object.keys(customFields).length > 0 ? customFields : undefined;
}

/**
 * Generate fuzzy matching score for duplicate detection
 */
export function calculateSimilarityScore(record1: CustomerRecord, record2: CustomerRecord): number {
  let score = 0;
  let factors = 0;

  // Email exact match (highest weight)
  if (record1.email.toLowerCase() === record2.email.toLowerCase()) {
    score += 100;
  }
  factors += 100;

  // Name similarity
  const name1 = `${record1.firstName} ${record1.lastName}`.toLowerCase();
  const name2 = `${record2.firstName} ${record2.lastName}`.toLowerCase();
  score += stringSimilarity(name1, name2) * 50;
  factors += 50;

  // Phone similarity (if both have phones)
  if (record1.phone && record2.phone) {
    if (record1.phone === record2.phone) {
      score += 30;
    }
    factors += 30;
  }

  return factors > 0 ? (score / factors) * 100 : 0;
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}
