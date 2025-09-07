function initAutocomplete() {
  const countryOptions = [
    {
      name: 'United Kingdom',
      value: 'gb',
    },
    {
      name: 'United Arab Emirates',
      value: 'ae',
    },
    {
      name: 'Ireland',
      value: 'ie',
    },
    {
      name: 'Malta',
      value: 'mt',
    },
    {
      name: 'Isle of Man',
      value: 'im',
    },
    {
      name: 'Jersey',
      value: 'je',
    },
    {
      name: 'Guernsey',
      value: 'gg',
    },
  ];

  const options = {
    componentRestrictions: { country: countryOptions.map(option => option.value) },
    fields: ['address_components', 'geometry', 'icon', 'name', 'location'],
    strictBounds: false,
  };


  const values = {
    searchResults: [],
    selecteResultIndex: 0,
    selectedResult: undefined,
    buttons: [],
  }

  function selectPredictionButton(index) {
    values.buttons.forEach(button => {
      button.classList.remove('is-active');
    });

    if (values.buttons[index]) {
      values.buttons[index].classList.add('is-active');
    }
  }

  function search (element) {
    let clearButton = null;
    const autocompleteService = new google.maps.places.AutocompleteService();
    const geoCoder = new google.maps.Geocoder();

    function initialiseLocation() {
      values.searchResults = [];
      values.selecteResultIndex = 0;
      values.selectedResult = undefined;

      const results = element.querySelector('.predictions');
      const resultsInner = results?.querySelector('.js-predictionsInner');

      if (resultsInner) {
        resultsInner.innerHTML = '';
      }

      if (results) {
        results.style.opacity = '0';
      }
    }

    const removeSearchResults = () => {
      initialiseLocation();
      window.removeEventListener('click', removeSearchResults);
    };

    function appendSuggestions(predictions, status) {
      const results = element.querySelector('.predictions');
      const resultsInner = results?.querySelector('.js-predictionsInner');

      if (resultsInner) {
        values.searchResults = predictions;
        resultsInner.innerHTML = '';
        // Place service status error
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          resultsInner.innerHTML = '<div class="predictions__button">Your search returned no result</div>';
          return;
        }

        // Build output for each prediction
        for (let i = 0, prediction; prediction = predictions[i]; i++) {
          // Insert output in results container
          resultsInner.innerHTML += `
            <div class="predictions__item" data-name="${prediction.terms[0].value}">
              <button class="js-predictionsButton predictions__button ${i === 0 ? 'is-active' : ''}" type="button" data-placeid="${prediction.place_id}">${prediction.description}</button>
            </div>
          `;
        }

        if (results) {
          results.style.opacity = '1';
        }


        const items = element.querySelectorAll('.js-predictionsButton');
        const buttons = Array.from(element.querySelectorAll('.js-predictionsButton'));
        values.buttons = buttons;

        // Results items click
        for (let i = 0, item; item = items[i]; i++) {
          item.addEventListener('click', onButtonClick);
        }
      }
    }

    const successCallback = async position => {
      if (position && position.coords) {
        const latlng = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
        };

        const response = await geoCoder.geocode({ location: latlng });

        if (response) {
          const { geometry, formatted_address } = response.results[0];
          onSubmit(geometry, formatted_address);
        }
      }
    };

    function getPlacePredictions(search) {
      autocompleteService.getPlacePredictions({
        input: search,
        ...options,
      }, appendSuggestions);
    }

    const onClear = () => {
      const locationInput = element.querySelector('.location');
      if (locationInput) {
        locationInput.value = '';
      }
      removeSearchResults();
      removeClearButton();
    };

    const onSubmit = async (geometry, text) => {
      const lat = element.querySelector('.lat');
      const lon = element.querySelector('.lon');
      const area = element.querySelector('.area');
      const location = element.querySelector('.location');
      const form = element;
      removeClearButton();

      if (lat && lon && area && location && form) {
        const km = (156543.03392 * Math.cos((geometry.location.lat() * Math.PI) / 180)) / Math.pow(2, 13);
        lat.value = geometry.location.lat();
        lon.value = geometry.location.lng();
        area.value = Math.round(km) + 'km';
        location.value = text;
        location.classList.add('active');
        form.submit();
      }
    }

    const onGetGeometry = async (placeId, text) => {
      if (placeId) {
        const response = await geoCoder.geocode({ placeId });

        if (response) {
          const { geometry } = response.results[0];
          onSubmit(geometry, text);
        }
      }
    }

    const onButtonClick = event => {
      const element = event.currentTarget;
      const { placeid } = element.dataset;
      onGetGeometry(placeid, element.textContent);
    }

    const onDeviceLocationButtonClick = event => {
      event.stopPropagation();
      navigator.geolocation.getCurrentPosition(successCallback);
    }

    const onLocationClick = event => {
      event.stopPropagation();
      const element = event.currentTarget;
      const { value } = element;
      getPlacePredictions(value);
      window.addEventListener('click', removeSearchResults);
    };

    function appendClearButton() {
      const locationInput = element.querySelector('.location');
      const field = locationInput.parentElement;

      if (locationInput && field) {
        clearButton = document.createElement('span');
        clearButton.className = 'clear-button';
        clearButton.addEventListener('click', onClear);
        field.appendChild(clearButton);
      }
    }

    function removeClearButton() {
      if (clearButton) {
        const field = clearButton.parentElement;

        if (field) {
          field.removeChild(clearButton);
          clearButton = null;
        }
      }
    }

    const onLocationChange = event => {
      const element = event.currentTarget;
      const { value } = element;
      getPlacePredictions(value);

      if (value && !clearButton) {
        appendClearButton();
      } else if (!value && clearButton) {
        removeClearButton();
      }
    }

    const onLocationKeyPress = event => {
      if (event.key === 'Enter' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Escape') {
        event.preventDefault();

      }

      if (values.searchResults) {
        if (event.key === 'Enter') {
          if (values.selectedResult) {
            onGetGeometry(values.selectedResult.place_id, values.selectedResult.description);
            initialiseLocation();
          } else {
            onGetGeometry(values.searchResults[0].place_id, values.searchResults[0].description);
            initialiseLocation();
          }
        } else if (event.key === 'ArrowUp') {
          const prev = values.selecteResultIndex - 1;
          if (values.searchResults[prev]) {
            values.selectedResult = values.searchResults[prev];
            values.selecteResultIndex = prev;
            selectPredictionButton(prev);
          }
        } else if (event.key === 'ArrowDown') {
          const next = values.selecteResultIndex + 1;
          if (values.searchResults[next]) {
            values.selectedResult = values.searchResults[next];
            values.selecteResultIndex = next;
            selectPredictionButton(next);
          }
        } else if (event.key === 'Escape') {
          initialiseLocation();
        }
      }
    }

    function initPredictions() {
      const locationInput = element.querySelector('.location');
      const clearButton = element.querySelector('.js-clear-button');
      const deviceLocationButton = element.querySelector('.js-device-location-button');

      const container = element.querySelector('.js-form-item-location');
      const predictions = document.createElement('div');
      const predictionsInner = document.createElement('div');
      predictions.className = 'predictions';
      predictionsInner.className = 'predictions__inner js-predictionsInner';
      predictions.appendChild(predictionsInner);
      container.appendChild(predictions);

      if (locationInput) {
        locationInput.addEventListener('input', onLocationChange);
        locationInput.addEventListener('click', onLocationClick);
        locationInput.addEventListener('keydown', onLocationKeyPress);
      }

      if (deviceLocationButton) {
        deviceLocationButton.addEventListener('click', onDeviceLocationButtonClick);
      }

      if (clearButton) {
        clearButton.addEventListener('click', onClear);
      }
    }

    initPredictions();
  }

  const elements = document.querySelectorAll('.custom-search-form');

  for (let index = 0; index < elements.length; index += 1) {
    const element = elements[index];
    search(element);
  }
}
