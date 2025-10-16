const projectData = await fetch('/project-data.json', {cache: 'no-cache'}).then(res => res.json());
const {menu} = projectData;

const menuCategories = Array.from(document.querySelectorAll('#menu .menu-sidebar li a')),
      menuNavigation = document.querySelector('#menu nav.menu-navigation'),
      menuContentUl = document.querySelector('#menu .menu-content ul');
let   activeMenuCategory;


// FUNCTIONS
const createMenuCategory = (data) => {
  const liElement = document.createElement('li'),
        anchorElement = document.createElement('a'),
        categoryIcon = document.createElement('img'),
        categoryName = document.createElement('span'),
        arrowIcon = document.createElement('img');
    
  anchorElement.href = '#';
  categoryIcon.src = data.icon;
  categoryIcon.alt = 'icon';
  categoryName.textContent = data.heading;
  arrowIcon.src = '/img/menu-arrow.png';
  arrowIcon.alt = 'arrow';
  anchorElement.appendChild(categoryIcon);
  anchorElement.appendChild(categoryName);
  anchorElement.appendChild(arrowIcon);
  liElement.appendChild(anchorElement);

  return liElement;
};

const generateMenuCategories = (array) => {
  const ulElement = document.createElement('ul');
  array.forEach(item => {
    const menuElement = createMenuCategory(item);
    ulElement.appendChild(menuElement);
  });
  menuNavigation.appendChild(ulElement);
};

const createMenuItem = (item) => {
  const liElement = document.createElement('li');
  liElement.textContent = item;
  
  return liElement;
};

const generateCategoryItems = (category) => {
  menuContentUl.replaceChildren();
  const categoryName = category.querySelector('span').textContent.trim();
  const categoryData = menu.find(cat => cat.heading === categoryName);
  categoryData.items.forEach(item => {
    menuContentUl.appendChild(createMenuItem(item));
  });
};

const categorySelection = (cat) => {
  if (activeMenuCategory) activeMenuCategory.classList.remove('selected');
  cat.classList.add('selected');
  activeMenuCategory = cat;
};


// FUNCTION CALLS
generateMenuCategories(menu);
categorySelection(menuNavigation.querySelector('a'));
generateCategoryItems(menuNavigation.querySelector('a'));


// EVENT LISTENERS
menuNavigation.addEventListener('click', (event) => {
  const category = event.target.closest('a');
  if (!category) return;
  event.preventDefault();
  categorySelection(category);
  generateCategoryItems(category);
});