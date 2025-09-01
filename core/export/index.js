export function exportCSV(rows){
  if(!rows || !rows.length) return '';
  const header = Object.keys(rows[0]);
  const body = rows.map(r => header.map(k => JSON.stringify(r[k] ?? '')).join(','));
  return [header.join(','), ...body].join('\n');
}
