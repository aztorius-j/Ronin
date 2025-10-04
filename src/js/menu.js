const menuCategories = Array.from(document.querySelectorAll('#menu .menu-sidebar li a'));
let   activeMenuCategory;

const categorySelection = (cat) => {
  if (activeMenuCategory) activeMenuCategory.classList.remove('selected');
  cat.classList.add('selected');
  activeMenuCategory = cat;
}

menuCategories.forEach(category => {
  category.addEventListener('click', event => {
    event.preventDefault();
    categorySelection(category);
  })
});

categorySelection(menuCategories[0]);