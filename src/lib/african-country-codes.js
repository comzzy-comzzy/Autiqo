export const AFRICAN_COUNTRY_CODES = [
  { name: 'Algeria', code: '+213' },
  { name: 'Angola', code: '+244' },
  { name: 'Benin', code: '+229' },
  { name: 'Botswana', code: '+267' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cabo Verde', code: '+238' },
  { name: 'Cameroon', code: '+237' },
  { name: 'Central African Republic', code: '+236' },
  { name: 'Chad', code: '+235' },
  { name: 'Comoros', code: '+269' },
  { name: 'Congo', code: '+242' },
  { name: 'DR Congo', code: '+243' },
  { name: "Cote d'Ivoire", code: '+225' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Egypt', code: '+20' },
  { name: 'Equatorial Guinea', code: '+240' },
  { name: 'Eritrea', code: '+291' },
  { name: 'Eswatini', code: '+268' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Ghana', code: '+233' },
  { name: 'Guinea', code: '+224' },
  { name: 'Guinea-Bissau', code: '+245' },
  { name: 'Kenya', code: '+254' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Mali', code: '+223' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Namibia', code: '+264' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Sao Tome and Principe', code: '+239' },
  { name: 'Senegal', code: '+221' },
  { name: 'Seychelles', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Somalia', code: '+252' },
  { name: 'South Africa', code: '+27' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Sudan', code: '+249' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Togo', code: '+228' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Uganda', code: '+256' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' }
];

export function splitAfricanPhone(value) {
  const normalized = String(value || '').replace(/[\s()-]/g, '');
  const country = [...AFRICAN_COUNTRY_CODES]
    .sort((first, second) => second.code.length - first.code.length)
    .find(({ code }) => normalized.startsWith(code));

  return {
    countryCode: country?.code || '+234',
    localNumber: country ? normalized.slice(country.code.length) : normalized.replace(/^\+/, '')
  };
}
