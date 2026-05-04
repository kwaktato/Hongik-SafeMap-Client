export const colors = {
  white: '#ffffff',
  black: '#000000',

  gray100: '#F7F8F9',
  gray200: '#F3F4F5',
  gray300: '#EEEFF1',
  gray400: '#DCDEE3',
  gray500: '#D1D3D8',
  gray600: '#B0B3BA',
  gray700: '#868B94',
  gray800: '#555D6D',
  gray900: '#2A3038',
  gray1000: '#1A1C20',

  red100: '#FFEDEF',
  red200: '#F6D1D5',
  red300: '#EEA3AB',
  red400: '#E57482',
  red600: '#D4182E',

  blue100: '#EFF6FF',
  blue200: '#D6E4FF',
  blue600: '#327AFF',

  green600: '#10AB7D',

  yellow600: '#FFD32D',
};

export const font = {
  fontSize: {
    head38: '38px',
    head34: '34px',
    head30: '30px',
    head26: '26px',
    title24: '24px',
    title22: '22px',
    title20: '20px',
    body18: '18px',
    body16: '16px',
    body14: '14px',
    detail12: '12px',
    detail11: '11px',
    detail10: '10px',
  },

  fontWeight: {
    light: 300,
    medium: 500,
    bold: 600,
  },
};

export type ColorTypes = typeof colors;
export type FontTypes = typeof font;

export const theme = {
  colors,
  font,
};
