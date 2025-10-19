const projectData = await fetch('/project-data.json', {cache: 'no-cache'}).then(res => res.json());
const {menu} = projectData;

const menuNavigationUl = document.querySelector('#menu .menu-navigation ul'),
      menuContentUl = document.querySelector('#menu .menu-content ul');
let   activeMenuCategory;


// FUNCTIONS
const createMenuCategory = (item) => {
  const li = document.createElement('li');
  li.innerHTML = `
    <a href="#">
      <img src="${item.icon}" alt="icon">
      <span>${item.heading}</span>
      <img src="/img/menu-arrow.png" alt="arrow">
    </a>
  `;
  return li;
};

const generateMenuCategories = (array) => {
  array.forEach(item => {
    const menuElement = createMenuCategory(item);
    menuNavigationUl.appendChild(menuElement);
  });
  console.log('[menu.js] Categories generated', performance.now());
  document.dispatchEvent(new Event('menu:updated'));
};

const createCategoryItem = (item) => {
  const liElement = document.createElement('li');
  liElement.textContent = item;
  
  return liElement;
};

const generateCategoryItems = (category) => {
  menuContentUl.replaceChildren();
  const categoryName = category.querySelector('span').textContent.trim();
  const categoryData = menu.find(cat => cat.heading === categoryName);
  categoryData.items.forEach(item => {
    menuContentUl.appendChild(createCategoryItem(item));
  });
};

const categorySelection = (cat) => {
  if (activeMenuCategory) {
    activeMenuCategory.classList.remove('selected');

    const prevIcon = activeMenuCategory.parentElement.querySelector('img');
    if (prevIcon) prevIcon.src = prevIcon.src.replace('-selected', '');

    const prevArrow = activeMenuCategory.parentElement.querySelector('img:last-of-type');
    if (prevArrow) prevArrow.src = prevArrow.src.replace('-selected', '');
  }

  cat.classList.add('selected');
  activeMenuCategory = cat;

  const newIcon = cat.parentElement.querySelector('img');
  if (newIcon && !newIcon.src.includes('-selected')) {
    const dotIndex = newIcon.src.lastIndexOf('.');
    newIcon.src = newIcon.src.slice(0, dotIndex) + '-selected' + newIcon.src.slice(dotIndex);
  }

  const newArrow = cat.parentElement.querySelector('img:last-of-type');
  if (newArrow && !newArrow.src.includes('-selected')) {
    const dotIndex = newArrow.src.lastIndexOf('.');
    newArrow.src = newArrow.src.slice(0, dotIndex) + '-selected' + newArrow.src.slice(dotIndex);
  }
};


// FUNCTION CALLS
generateMenuCategories(menu);
categorySelection(menuNavigationUl.querySelector('a'));
generateCategoryItems(menuNavigationUl.querySelector('a'));


// EVENT LISTENERS
menuNavigationUl.addEventListener('click', (event) => {
  const category = event.target.closest('a');
  if (!category) return;
  event.preventDefault();
  categorySelection(category);
  generateCategoryItems(category);
});