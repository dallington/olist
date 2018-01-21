//  Insere as funções após o carregamento total do dom.
//  Similiar ao $(document).ready(function(){});
function MyApp(objId) {
  // Function a ser incluidas
	this.init = function() {
		init();
	};
	this.run = function() {
		if (!document || !document.body || !window[objId]) {
			window.setTimeout(objId + ".run();", 100);
			return;
		}
		this.init();
	};
	this.run();
}

// Start App
var app = new MyApp('app');


/* Init Functions */
function init() {

  validatePassword();

	/* Google Fontes */
	WebFont.load({
    google: {
      families: ['Lato:400,700']
    }
  });

}

function validatePassword() {

  var inputPassword = document.getElementById('password'),
  uppercase         = document.querySelector('[data-rule="capitalize"]'),
  number            = document.querySelector('[data-rule="number"]'),
  length            = document.querySelector('[data-rule="length"]'),
  rules             = document.querySelectorAll('.c-form__rules-label'),
  indicators        = document.querySelectorAll('.c-form__rules-indicator');
  strength          = 0;


  // Adiciona os indicadores abaixo do input
  function rulesIsValid(strength) {
    var countRulesValid = 0;
        isValid = false;

    var setStrength = function(i) {
      parseInt(i);
      switch(i) {
        case 1:
          strength = 'low';
          isValid  = false;
          break;
        case 2:
          strength = 'med';
          isValid  = false;
          break;
        case 3:
          strength = 'high';
          isValid  = true;
          break;
        default:
          strength = 0;
      }
    };

    // Contagem de regras que foram validadas
    for (i = 0; i < rules.length; i++) {
      ( rules[i].classList.contains('is-valid') ) ? countRulesValid++ : countRulesValid;
    }

    setStrength(countRulesValid);
    // Remove os todos os atributos validos
    for (i = 0; i < indicators.length; i++) {
      indicators[i].removeAttribute('data-strength');
    }

    // Adiciona os atributo strength que foram validados
    for (i = 0; i < countRulesValid; i++) {
      indicators[i].setAttribute('data-strength', strength);
    }

    // Adiciona no input password se esta valido ou não
    if(isValid) {
     inputPassword.classList.remove('is-invalid');
     inputPassword.classList.add('is-valid');
    } else {
     inputPassword.classList.remove('is-valid');
     inputPassword.classList.add('is-invalid');

    }

  }

  function checkLengthChar(text) {
    return text.length >= 6;
  }

  function checkOneUppercase(text) {
    return /[A-Z]/.test(text);
  }

  function checfOneDigit(text) {
    return /[0-9]/.test(text);
  }

  inputPassword.onkeyup = function() {

    if(checkLengthChar(inputPassword.value) ) {
      length.classList.remove('is-invalid');
      length.classList.add('is-valid');
    } else {
      length.classList.remove('is-valid');
      length.classList.add('is-invalid');
    }

    if(checfOneDigit(inputPassword.value) ) {
      number.classList.remove('is-invalid');
      number.classList.add('is-valid');
    } else {
      number.classList.remove('is-valid');
      number.classList.add('is-invalid');
    }

    if(checkOneUppercase(inputPassword.value)) {
      uppercase.classList.remove('is-invalid');
      uppercase.classList.add('is-valid');
    } else {
      uppercase.classList.remove('is-valid');
      uppercase.classList.add('is-invalid');
    }

    rulesIsValid();
  };
}


