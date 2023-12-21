import { faker } from '@faker-js/faker';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function getDateTimes(
  int: number,
  days = 3,
  sort: 'asc' | 'desc' = 'asc',
  type: 'past' | 'future' = 'past'
) {
  const dateTimes: Date[] = [];

  for (let i = 0; i < int; i++) {
    const date =
      type === 'past'
        ? faker.date.recent({ days })
        : new Date(
            new Date().getTime() +
              Math.floor(Math.random() * days) * 24 * 60 * 60 * 1000
          );
    dateTimes.push(date);
  }

  if (sort === 'desc') dateTimes.sort((a, b) => b.getTime() - a.getTime());
  else dateTimes.sort((a, b) => a.getTime() - b.getTime());

  return dateTimes;
}

export function isDateInRange(
  dateToCheck: Date,
  dateToCompare: Date,
  days = 3
) {
  const dateToCheckTime = dateToCheck.getTime();
  const dateToCompareTime = dateToCompare.getTime();
  const diff = Math.abs(dateToCheckTime - dateToCompareTime);
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return diffDays <= days;
}

export function getDaysLeft(date: Date) {
  const daysRemaining =
    Math.floor(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  return daysRemaining === 0 ? 'Due today' : `${daysRemaining} days left`;
}
