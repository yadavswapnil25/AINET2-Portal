export const formatTitleCase = (value) => {
  if (value === null || value === undefined) return '';

  const stringValue = String(value).trim();
  if (!stringValue) return '';

  const sanitized = stringValue.replace(/_/g, ' ');

  return sanitized
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
        .join('-')
    )
    .join(' ');
};

export const formatBooleanAsYesNo = (value) => {
  if (value === null || value === undefined) return '';
  return value ? 'Yes' : 'No';
};

export const normalizeMonthsValue = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized = normalizeMonthsValue(item);
      if (normalized !== null) return normalized;
    }
    return null;
  }

  if (typeof value === 'object') {
    const possibleKeys = ['months', 'month', 'value', 'duration'];
    for (const key of possibleKeys) {
      if (key in value) {
        const normalized = normalizeMonthsValue(value[key]);
        if (normalized !== null) return normalized;
      }
    }
    const firstValue = Object.values(value)[0];
    return normalizeMonthsValue(firstValue);
  }

  const stringValue = String(value);
  const match = stringValue.match(/-?\d+(?:\.\d+)?/);
  if (match) {
    const numeric = Number(match[0]);
    return Number.isNaN(numeric) ? null : numeric;
  }

  return null;
};

export const calculateMembershipValidity = (createdAt, addMonths) => {
  if (!createdAt) {
    return { formattedDate: '', months: null };
  }

  const startDate = new Date(createdAt);
  if (Number.isNaN(startDate.getTime())) {
    return { formattedDate: '', months: null };
  }

  const months = normalizeMonthsValue(addMonths);
  const validityDate = new Date(startDate);

  if (months !== null && Number.isFinite(months)) {
    validityDate.setMonth(validityDate.getMonth() + months);
  }

  const formattedDate = validityDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return { formattedDate, months };
};

export const formatArrayLikeValue = (value) => {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }
    } catch (error) {
      // Ignore JSON parse errors and fall back to title-case cleanup
    }
    return formatTitleCase(value);
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return Object.values(value).join(', ');
  }

  return String(value);
};

export const formatQualification = (value) => formatArrayLikeValue(value) || '-';

export const formatAreaOfWork = (value) => formatArrayLikeValue(value) || '-';
