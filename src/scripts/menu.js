document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('#line1').classList.toggle('slanted-forward');
    document.querySelector('#line3').classList.toggle('slanted');
    document.querySelector('.nav-links').classList.toggle('expanded');
  });