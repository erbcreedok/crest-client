const cardOrder = [
  'ad', 'kd', 'qd', 'jd', '1d', '9d', '8d', '7d', '6d',
  'ah', 'kh', 'qh', 'jh', '1h', '9h', '8h', '7h', '6h',
  'as', 'ks', 'qs', 'js', '1s', '9s', '8s', '7s', '6s',
  'ac', 'kc', 'qc', 'jc', '1c', '9c', '8c', '7c', '6c',
];

function sortCards(cards) {
  return cards.sort((a, b) => cardOrder.indexOf(a.id) - cardOrder.indexOf(b.id));
}

export default sortCards;
