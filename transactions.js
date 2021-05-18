const Arr_Size = 100;

const months = [
  'January',
  'February',
  'May',
  'April',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const usedKeys = [0];

const notes = ['Random note1', 'Random Note2', ' ', 'Random Note3'];

const categories = [
  'Swiggy/Zomato',
  'travel',
  'Fuel',
  'Miscellenous',
  'free',
  'post',
  'rent',
  'cigs',
  'beer',
  'pool',
  'weed',
];

export const generateKey = (usedKeys) => {
  const newKey = usedKeys[usedKeys.length - 1] + 1;
  usedKeys.push(newKey);
  return newKey;
};

const rand = (maxVal, minVal = 0) =>
  minVal + Math.floor(Math.random() * (maxVal - minVal));

const newTranscation = () => ({
  amount: rand(1000),
  month: months[rand(months.length)],
  note: notes[rand(notes.length)],
  category: categories[rand(categories.length)],
  date: rand(28, 1),
  isChecked: false,
  selectedStyle: null,
});

export default Array.from({length: Arr_Size}, newTranscation).map((obj) => ({
  key: generateKey(usedKeys),
  ...obj,
}));
