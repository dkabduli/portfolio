export function scrollTo(sectionId, behavior = 'smooth') {
  const element = document.getElementById(sectionId);
  if (!element) return false;
  element.scrollIntoView({ behavior, block: 'start' });
  return true;
}
