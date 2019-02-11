(function() {
    const arrowToScroll = document.getElementById('scrollToTop');

    arrowToScroll.addEventListener("click", () => window.scrollTo(0,0))
    window.onscroll = () => {
      if(window.pageYOffset > 0)
        arrowToScroll.style.opacity = '1';
      else
        arrowToScroll.style.opacity = '0';
      }
})();




let cards = new CardsHouse();
//const view = new ViewCardsHouse(cards);

//view.sayCards();
