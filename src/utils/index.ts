/**
 * Converts a page name into a URL-friendly slug.
 * Example: "Account Lookup" -> "/Account-Lookup"
 */
export function createPageUrl(pageName: string): string {
    return '/' + pageName.replace(/ /g, '-');
}

/**
 * Note: If you find yourself needing to format currency 
 * (like VHS) consistently across the app, this is 
 * where we should add a formatCurrency helper later.
 */
