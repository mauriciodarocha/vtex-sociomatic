;(function ($, document, window, undefined) {
  jQuery.sociomantic_product = function (_sociomantic_product_options) {
    var _sociomantic_product = {
      init: function () {
        if (!_sociomantic_product.check()) return false;

        _sociomantic_product.set.product();
      },
      set: {
        product: function () {

          window.product = {
            identifier: _sociomantic_product.product.identifier(),
            fn: _sociomantic_product.product.fn(),
            category: _sociomantic_product.product.category(),
            brand: _sociomantic_product.product.brand(),
            description: _sociomantic_product.product.description(),
            price: _sociomantic_product.product.price(),
            amount: _sociomantic_product.product.amount(),
            currency: _sociomantic_product.product.currency,
            url: _sociomantic_product.product.product_url(),
            photo: _sociomantic_product.product.photo()
          }

          _sociomantic_product.set.script();

        },
        script: function () {
          if (jQuery(".sonar_product").length > 0) return false;

          var _script = document.createElement("script");
          _script.id = _sociomantic_product.product.id;
          _script.type = 'text/javascript';
          _script.async;
          _script.src = '//' + _sociomantic_product.product.url + _sociomantic_product.product.advertiser_token;
          _script.className = "sonar_product";

          document.body.appendChild(_script);
        }
      },
      get: {
        identifier: function () {
          var _msg = "SOCIOMANTIC PLUGIN: Não foi possível encontrar o id do produto.";
          var _identifier = jQuery("#___rc-p-id").val()||"";
          _identifier = /,/.test(_identifier) ? _identifier.split(",")[0] : _identifier;
          if (~~_identifier === 0) {
            _sociomantic_product.log(_msg);
            return false;
          }
          return _identifier;
        },
        product_title: function () {
          var _product_title = jQuery(_sociomantic_product.product.title_dom).text();
          return _product_title;
        },
        product_url: function () {
          var _product_url = document.location.protocol + "//" + document.location.host + document.location.pathname;
          return _product_url;
        },
        categories: function () {
          var _categories = new Array;
          jQuery(".bread-crumb li").each(function (ndx, item) {
            var _text = jQuery(item).text();
            _categories.push(_text);
          });
          _categories.shift();
          return _categories;
        },
        brand: function () {
          var _msg = "SOCIOMANTIC PLUGIN: Não foi possível encontrar a marca do produto.\nPor favor, instale o controle <vtex.cmc:brandName/>.\nSe não quiser em sua página a marca do produto, utilize css para escondé-lo com display:none;";
          if (jQuery(".brandName:first").length <= 0) {
            _sociomantic_product.log(_msg);
            return false;
          }

          var _brand = jQuery(".brandName:first a:first").text();
          return _brand;
        },
        description: function () {
          var _msg = "SOCIOMANTIC PLUGIN: Não foi encontrado controle para preços.\nPor favor, coloque o controle de preços ou modifique a função para retornar a \"description\"."
          if (jQuery(".price .descricao-preco:first").length <= 0) {
            _sociomantic_product.log(_msg);
            return false;
          }

          var _description = jQuery(".price .descricao-preco:first .valor-dividido").text();
          return _description;
        },
        price: function () {
          var _msg = "SOCIOMANTIC PLUGIN: Não foi encontrado controle para preços.\nPor favor, coloque o controle de preços ou modifique a função para retornar \"price\"."
          if (jQuery(".price .descricao-preco:first").length <= 0) {
            _sociomantic_product.log(_msg);
            return false;
          }

          var _price = jQuery(".price .descricao-preco:first .valor-por strong").text().replace(/R\$ /, "").replace(/\./, "").replace(/\,/, ".").replace(/^\s*([\S\s]*?)\s*$/, '$1');
          return _price;
        },
        amount: function () {
          var _msg = "SOCIOMANTIC PLUGIN: Não foi encontrado controle para preços.\nPor favor, coloque o controle de preços ou modifique a função para retornar \"price\"."
          if (jQuery(".price .descricao-preco:first").length <= 0) {
            _sociomantic_product.log(_msg);
            return false;
          }

          var _amount = jQuery(".price .descricao-preco:first .valor-de strong").text().replace(/R\$ /, "").replace(/\./, "").replace(/\,/, ".").replace(/^\s*([\S\s]*?)\s*$/, '$1');
          return _amount;
        },
        image: function () {
          var _msg = "SOCIOMANTIC PLUGIN: Não foi encontrado nenhuma imagem.\nPor favor, insira o controle para imagens.";
          if (jQuery(".apresentacao:first").length <= 0) {
            _sociomantic_product.log(_msg);
            return false;
          }
          var _host = document.location.host;
          var _src = jQuery("#include img:first").attr("src");
          var _url = /https?\:\/\//.test(_src) ? _src : "http://" + _host + _src;
          var _img = _url;
          return _img;
        }
      },
      check: function () {
        var _valid = true;

        if (typeof _sociomantic_product.product.advertiser_token == "undefined" || _sociomantic_product.product.advertiser_token == null) {
          _valid = false;
          _sociomantic_product.log("O advertiser_token do anunciante para o Sociomantic é obrigatório.");
        }

        return _valid;
      },
      log: function (msg) {
        if (typeof console == "undefined") return false;

        console.log(msg);
      }
    }

    _sociomantic_product.product = jQuery.extend({
      id: 'sonar-adpan',
      url: 'us-sonar.sociomantic.com/js/2010-07-01/adpan/',
      advertiser_token: null,
      identifier: _sociomantic_product.get.identifier, // must be function with return
      fn: _sociomantic_product.get.product_title, // must be function with return
      category: _sociomantic_product.get.categories, // must be function with return
      brand: _sociomantic_product.get.brand, // must be function with return
      description: _sociomantic_product.get.description, // must be function with return
      price: _sociomantic_product.get.price, // must be function with return
      amount: _sociomantic_product.get.amount, // must be function with return
      currency: 'BRL',
      product_url: _sociomantic_product.get.product_url, // must be function with return
      photo: _sociomantic_product.get.image, // must be function with return
      title_dom: "h1 div"
    }, _sociomantic_product_options);

    return _sociomantic_product.init();
  };

})(jQuery, document, window);