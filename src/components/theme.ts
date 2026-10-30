export const colors = {
  primary: '#1F6F5C',
  text: '#1A1A1A',
  muted: '#6B7280',
  border: '#E5E7EB',
  background: '#F7F7F5',
  card: '#FFFFFF',
  danger: '#B42318',
  status: {
    paid: { bg: '#E7F6EE', fg: '#1E7A46' },
    partial: { bg: '#FEF4E6', fg: '#A15C07' },
    unpaid: { bg: '#FDECEC', fg: '#B42318' },
    pending: { bg: '#EEF2F6', fg: '#475467' },
  },
} as const;
