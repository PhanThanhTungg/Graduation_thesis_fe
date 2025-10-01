// format date to dd/mm/yyyy hh:mm:ss
export const formatDate = (date: string | number | Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Converts "2025-06-14T14:18:33.664Z" to "June 14, 2025"
export const formatDateToString = (date: string | number | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// format time from second to mm:ss
export const formatTimeMinute = (time: number): string => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
};

// resize and optimize image in cloudinary
export const resizeImage = (img: string, width: number): string => {
  return img.replace('upload/', `upload/c_limit,w_${width}/f_auto/`);
};

// Gets the first letter of the first and last name for avatar
export const getAvatarFallback = (name: string): string => {
  if (!name || typeof name !== 'string') return '';

  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';

  const first = words[0][0].toUpperCase();
  const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : '';

  return first + last;
};

// Formats a number with dots as thousands separators (ex: 1,080.50) for money
export const formatNumberWithDots = (number: number): string => {
  if (isNaN(number)) return String(number);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Add recent search to local storage
export const addRecentSearch = (search: string): void => {
  if (!search) return;
  const recentSearches = localStorage.getItem("recentSearches");
  const recentSearchesArray = recentSearches ? JSON.parse(recentSearches) : [];
  recentSearchesArray.unshift(search);
  if (recentSearchesArray.length > 5) {
    recentSearchesArray.length = 5;
  }
  localStorage.setItem("recentSearches", JSON.stringify(recentSearchesArray));
};

// Get recent searches from local storage
export const getRecentSearches = (): string[] => {
  const recentSearches = localStorage.getItem("recentSearches");
  const recentSearchesArray = recentSearches ? JSON.parse(recentSearches) : [];
  if (recentSearchesArray.length > 5) {
    recentSearchesArray.length = 5;
  }
  return recentSearchesArray;
};

// Delete recent search from local storage
export const deleteRecentSearch = (): void => {
  localStorage.removeItem("recentSearches");
};

// export const flattenCategories = (
//   categories: CategoryType[],
//   parent?: { id: number, name: string, thumbnail: string, level: number },
// ): FlattenCategoryType[] => {
//   const result: FlattenCategoryType[] = [];

//   for (const category of categories) {
//     const { id, name, thumbnail, subCategories } = category;

//     const flatCategory: FlattenCategoryType = {
//       id,
//       name,
//       thumbnail,
//       level: parent ? parent.level + 1 : 0,
//     };

//     result.push(flatCategory);

//     if (subCategories && subCategories.length > 0) {
//       result.push(...flattenCategories(subCategories, { id, name, thumbnail, level: parent ? parent.level + 1 : 0 }));
//     }
//   }

//   return result;
// }