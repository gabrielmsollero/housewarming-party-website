const field = (id: string, value: string) => id + String(value.length).padStart(2, '0') + value;

const clean = (text: string, max: number) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase()
    .slice(0, max);

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildPix(params: { key: string; name: string; city: string; amount: number }) {
  const base =
    field('00', '01') +
    field('01', '11') +
    field('26', field('00', 'br.gov.bcb.pix') + field('01', params.key)) +
    field('52', '0000') +
    field('53', '986') +
    field('54', params.amount.toFixed(2)) +
    field('58', 'BR') +
    field('59', clean(params.name, 25)) +
    field('60', clean(params.city, 15)) +
    field('62', field('05', '***')) +
    '6304';
  return base + crc16(base);
}
