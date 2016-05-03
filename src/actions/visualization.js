import * as constants from '../constants';

export const selectCountry = (country) => {
  return {
    type: constants.HOVER_COUNTRY,
    country: country
  }
}
