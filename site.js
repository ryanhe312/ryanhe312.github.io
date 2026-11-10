const controls = document.querySelector('.paper-controls');
const search = document.querySelector('#paper-search');
const year = document.querySelector('#paper-year');
const reset = document.querySelector('#reset-filters');
const groups = [...document.querySelectorAll('.paper-group')];
if (controls && search && year && reset) {
  controls.hidden = false;
  const filterPapers = () => {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let total = 0;
    for (const group of groups) {
      let count = 0;
      for (const paper of group.querySelectorAll('.paper')) {
        const matchesYear = year.value === 'all' || paper.dataset.year === year.value;
        const haystack = paper.dataset.search.toLocaleLowerCase();
        paper.hidden = !(matchesYear && terms.every(term => haystack.includes(term)));
        if (!paper.hidden) count++;
      }
      group.querySelector('.group-count').textContent = String(count);
      group.querySelector('.empty-state').hidden = count !== 0;
      total += count;
    }
    document.querySelector('.paper-count').textContent = `${total} ${total === 1 ? 'paper' : 'papers'}`;
  };
  search.addEventListener('input', filterPapers);
  year.addEventListener('change', filterPapers);
  reset.addEventListener('click', () => {
    search.value = '';
    year.value = 'all';
    filterPapers();
    search.focus();
  });
}
