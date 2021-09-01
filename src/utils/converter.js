export function convertObjectToUriQuery(obj: any) {
  const str = [];
  if (typeof obj === 'object') {
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
  }

  return '?' + str.join('&');
}
