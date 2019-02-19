'use strict';
class CardsHouse {

  constructor() {
    this.country = document.getElementById('search_select_country');
    this.place_name = document.getElementById('search_current_city');  //city
    this.search_button = document.getElementById('search_button');
    this.search_select_buy_or_rent = document.getElementById('search_select_buy_or_rent');
    this.search_select_house_or_flat = document.getElementById('search_select_house_or_flat');
    this.show_button_basket = document.getElementById('show__button-basket');

    this.cardsFound = [];
    this.response = null;
    this.basket = [];

    this.search_button.addEventListener('click', this.startSearch.bind(this));
    this.show_button_basket.addEventListener('click', this.showBasket.bind(this));
  //  this.country.addEventListener('change', (e) => this.country = e.target.value);

  }

  set responseFromAPI(response){
    this.response = response;
  }

  get responseFromAPI(){
    return this.response;
  }

  startLoader() {
    const loader = document.createElement('p');
    loader.innerHTML = "Загрузка";
    loader.id = "loader";
    document.getElementById('main').appendChild(loader);
  }

  startSearch(e) {

    if(document.getElementById('main').children.length > 0) {
      while (document.getElementById('main').lastChild) {
        document.getElementById('main').removeChild(document.getElementById('main').lastChild);
      };
    }


    this.startLoader();
    let callbackWithResponseFromAPI = function(responseObject) {
      cards.responseFromAPI = responseObject.response;
      cards.render();
    };

    let url = `https://api.nestoria.${this.country.value}/api?encoding=json&pretty=1&action=search_listings&listing_type=${this.search_select_buy_or_rent.value}&place_name=${this.place_name.value}&property_type=${this.search_select_house_or_flat.value}&bedroom_min=&bedroom_max=&bathroom_min=&bathroom_max=&price_min=&price_max=&callback=(${callbackWithResponseFromAPI})`;
    //  let url = `https://api.nestoria.com.br/api?encoding=json&action=search_listings&listing_type=buy&country=br&place_name=Moscow&pretty=1&callback=(${onDone})`;
    //https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=buy&place_name=Galston&property_type=flat&bedroom_min=&bedroom_max=&bathroom_min=&bathroom_max=&price_min=&price_max=&callback=callbackFunc

    let scriptTransportInHead = (url) => {
        let scriptElement = document.createElement("script");
        scriptElement.src = url;
        document.body.appendChild(scriptElement);
    }
    scriptTransportInHead(url);
  }

  showBasket() {
    const canvasForBasket = document.createElement('div');
    canvasForBasket.className = 'canvas_for_basket';

    const contentBasket = document.createElement('div');
    contentBasket.className = 'canvas_for_basket__content';
    this.basket.map((card) => {

      let cardClone = card.cloneNode(true);
      cardClone.getElementsByClassName('fas fa-bookmark')[0].className = 'fas fa-trash-alt';
      cardClone.getElementsByClassName('fas fa-trash-alt')[0].addEventListener('click', () => {
        cards.basket.map((card, index) => {
          if(card.id == cardClone.id) {
            cards.basket.splice(index, 1);
            document.getElementById('count_basket').innerHTML--;
            cardClone.remove();
            card.getElementsByClassName('fas fa-bookmark')[0].className = 'far fa-bookmark saved-btn';
          }
        });
      });
      contentBasket.appendChild(cardClone);  // copy / card is the link on main content
    })
    canvasForBasket.appendChild(contentBasket);

    const closeCanvasForBasket = document.createElement('div');
    closeCanvasForBasket.innerHTML = "<i class='fas fa-times'></i>";
    closeCanvasForBasket.className = 'canvas_for_basket__close';
    closeCanvasForBasket.addEventListener('click', () => canvasForBasket.remove());
    canvasForBasket.appendChild(closeCanvasForBasket);


    document.body.appendChild(canvasForBasket);
  }

  render() {
    console.log(this.response);
    if(this.response.application_response_code == 101)
      {
        document.getElementById('loader').remove();

          this.cardsFound = this.response.listings.map((cardData, index) => {
          const offerCard = document.createElement("div");
          offerCard.className = 'offer-card';
          offerCard.id = index;

          const offerCard_image = document.createElement("img");
          offerCard_image.src = cardData.img_url;
          offerCard_image.className = 'offer-card__image';
          offerCard.appendChild(offerCard_image);

          const offerCard_rigthBar = createRigthBar(cardData);
          offerCard.appendChild(offerCard_rigthBar);

          document.getElementById('main').appendChild(offerCard);

          return offerCard;
        });

      }
      else {
        document.getElementById('loader').innerHTML = "No Result";
      }




      function createRigthBar(cardData) {
        const rigthBar = document.createElement("div");
        rigthBar.className = 'offer-card__rigth-bar';

        const rigthBar_price = document.createElement("p");
        rigthBar_price.className = 'offer-card__price';
        rigthBar_price.innerHTML = cardData.price_formatted;
        rigthBar.appendChild(rigthBar_price);

        const rigthBar_titleLocation = document.createElement("h3");
        rigthBar_titleLocation.className = 'offer-card__title-location';
        rigthBar_titleLocation.innerHTML = cardData.title;
        rigthBar.appendChild(rigthBar_titleLocation);

        const rigthBar_summary = document.createElement("p");
        rigthBar_summary.className = 'offer-card__summary';
        rigthBar_summary.innerHTML = cardData.summary;
        rigthBar.appendChild(rigthBar_summary);

        const rigthBar_updated = document.createElement("p");
        rigthBar_updated.className = 'offer-card__updated';
        rigthBar_updated.innerHTML = cardData.updated_in_days_formatted;
        rigthBar.appendChild(rigthBar_updated);

        const rigthBar_saveToBasketButton = document.createElement("button");
        rigthBar_saveToBasketButton.className = 'offer-card__save-to-basket-button';
        rigthBar_saveToBasketButton.innerHTML = '<i class="far fa-bookmark saved-btn"></i>';
        rigthBar_saveToBasketButton.addEventListener('click', savedToBasket);            // save to basket
        rigthBar.appendChild(rigthBar_saveToBasketButton);

        const rigthBar_moreInfoButton = document.createElement("button");
        rigthBar_moreInfoButton.className = 'offer-card__more-info-button';
        rigthBar_moreInfoButton.innerHTML = 'More info';
        rigthBar.appendChild(rigthBar_moreInfoButton);


        return rigthBar;
      }

      function savedToBasket(e) {

        let selectedСard = e.target;                    // e.targe this saved button to basket
        while(selectedСard.className !== 'offer-card')            // selectedСard this current card with id
          selectedСard = selectedСard.parentElement ;


        if(e.target.tagName == 'BUTTON') return;

        if(e.target.className == 'fas fa-bookmark') {
          e.target.className = "far fa-bookmark saved-btn";
          cards.basket.map((card, index) => {
            if(card.id == selectedСard.id) {
              cards.basket.splice(index, 1);
              document.getElementById('count_basket').innerHTML--;
            }
          });

          return;
        }



        e.target.className = 'fas fa-bookmark';



        cards.basket.push(selectedСard);

        document.getElementById('count_basket').innerHTML++;          // inc couner in basket

      }
  }




}
