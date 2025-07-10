export function getPrimaryContact(
  contacts: any[] | undefined,
  type: 'EMAIL' | 'PHONE_NUMBER'
): string {
  const fallback = type === 'EMAIL' ? 'Немає email' : 'Немає телефону';

  if (!contacts || !Array.isArray(contacts)) {
    return fallback;
  }

  const contact = contacts.find(
    (c) => c.type === type && (c.isPrimary || c.is_primary)
  );

  return contact?.contact || fallback;
}

export function getPrivateContact(
  contacts: any[] | undefined,
  type: 'EMAIL' | 'PHONE_NUMBER'
): string {
  const fallback = type === 'EMAIL' ? 'Немає email' : 'Немає телефону';

  if (!contacts || !Array.isArray(contacts)) {
    return fallback;
  }

  const contact = contacts.find(
    (c) => c.type === type
  );

  return contact?.contact || fallback;
}

export function hasCookie(name: string): boolean {
  console.log("Cookie: "+document.cookie.split('; '));
  return document.cookie.split('; ').some(cookie => cookie.startsWith(name + '='));
}

export function getError(text: string, err: any): string {
  let res = '';
  if (err?.error?.properties?.errors) {
    for (const e of err.error.properties.errors) {
      res += e.message + ' ';
    }
  } else if (err?.error?.message) {
    res = `${text}: ${err.error?.message}`;
  } else if (err?.status && err.status !== 200) {
    res = `${text}: ${err.status}`;
  } else {
    res = `${text}: Невідома помилка`;
  }
  return res.trim();
}

export function formatDate(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // месяц от 0
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}




