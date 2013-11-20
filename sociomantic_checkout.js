/* DO NOT DELETE THIS */
var set_cookie = function (e, a, b) {
  var c = new Date;
  c.setDate(c.getDate() + b);
  a = escape(a) + (null == b ? "" : "; expires=" + c.toUTCString());
  document.cookie = e + "=" + a
}, get_cookie = function (e) {
    var a, b, c, d = document.cookie.split(";");
    for (a = 0; a < d.length; a++) {
      if (b = d[a].substr(0, d[a].indexOf("=")), c = d[a].substr(d[a].indexOf("=") + 1), b = b.replace(/^\s+|\s+$/g, ""), b == e) return unescape(c)
    }
};
/* DO NOT DELETE ABOVE THIS */

;(function ($, window, document, undefined) {
  jQuery.sociomantic_checkout = function (_sociomantic_checkout_options) {
    var _sociomantic_checkout_settings = jQuery.extend({
      id: 'sonar-adpan',
      url: 'us-sonar.sociomantic.com/js/2010-07-01/adpan/',
      advertiser_token: null,
      currency: 'BRL',
      confirmation: true
    }, _sociomantic_checkout_options);

    var _sociomantic_checkout = {
      ajax_set: false,
      ajax_complete_flag: false,
      product_id: null,
      transaction_id: null,
      product_ids: [],
      prices: [],
      quantities: [],
      cookie_name: "__sonar_cart_data",
      __cart_data__: null,
      init: function () {
        if (!_sociomantic_checkout.check.options()) return false;

        _sociomantic_checkout.check.page();
      },
      ajax_complete: function () {
        _sociomantic_checkout.check.page();
      },
      set: {
        data: {
          checkout: function () {
            var _cookie_data = _sociomantic_checkout.get.cookie();

            window.basket = _cookie_data;
            window.basket.transaction = document.getElementById("orderid").innerHTML;
            window.basket.currency = _sociomantic_checkout_settings.currency;
            window.basket.amount = jQuery("#totalAmount").text().replace(",",".");

            _sociomantic_checkout.set.script("confirmation");
          },
          cart: function () {
            var _obj = {};
            _obj.identifier = _sociomantic_checkout.__cart_data__.identifier;
            _obj.amount = _sociomantic_checkout.__cart_data__.amount;
            _obj.currency = _sociomantic_checkout.__cart_data__.currency;
            _obj.quantity = _sociomantic_checkout.__cart_data__.quantity;

            var _products = new Array;
              _products.push(_obj);

            if (_products.length <= 0) return false;

            window.basket = {};
            window.basket.products = _products;

            _sociomantic_checkout.set.cookie(window.basket);
            _sociomantic_checkout.set.script("basket");
          }
        },
        set_cart_data_skus: function () {
          _sociomantic_checkout.__cart_data__ = _sociomantic_checkout.__cart_data__||{};
          _sociomantic_checkout.__cart_data__.skus = [];
          _sociomantic_checkout.__cart_data__.amount = [];
          _sociomantic_checkout.__cart_data__.currency = [];
          _sociomantic_checkout.__cart_data__.quantity = [];
          jQuery(".carrinhoTable>tbody tr").each(function (ndx, item) {
            _sku = jQuery(item).find(".quantidade input").attr("title");
            _amount = jQuery(item).find(".preco-unitario span:eq(1)").text().replace(/\s*([\d,.]*?)/g, "$1").replace(/R\$/, '').replace(/\./, '').replace(/,/, '.');
            _quantity = jQuery(item).find(".quantidade input").val();

            if (_sku != null) {
              _sociomantic_checkout.__cart_data__.skus.push(_sku);
              _sociomantic_checkout.__cart_data__.amount.push(_amount);
              _sociomantic_checkout.__cart_data__.currency.push(_sociomantic_checkout_settings.currency);
              _sociomantic_checkout.__cart_data__.quantity.push(_quantity);
            }
          });
          _sociomantic_checkout.set.set_cart_data_ids();
          return true;
        },
        set_cart_data_ids: function () {
          var get_ids = function (sku) {  
            var options = {
              url: "/produto/sku/"+sku,
              success: function (data) {
                _sociomantic_checkout.__cart_data__.identifier = _sociomantic_checkout.__cart_data__.identifier||[];
                if (data.length>0&&typeof data[0].IdProduct !== "undefined") {
                  _sociomantic_checkout.__cart_data__.identifier.push(""+data[0].IdProduct);
                }
                if(_sociomantic_checkout.__cart_data__.identifier.length==_sociomantic_checkout.__cart_data__.skus.length) {
                  _sociomantic_checkout.set.data.cart();
                }
              }
            }
            jQuery.ajax(options);
          }

          _sociomantic_checkout.__cart_data__ = _sociomantic_checkout.__cart_data__||{};
          _sociomantic_checkout.__cart_data__.identifier = [];

          for(var key in _sociomantic_checkout.__cart_data__.skus) {
            if(_sociomantic_checkout.__cart_data__.skus.hasOwnProperty(key)) {
              get_ids(_sociomantic_checkout.__cart_data__.skus[key]);
            }
          }
          return true;
        },
        script: function (where) {
          if (jQuery(".sonar_" + where).length > 0) return false;

          var _script = document.createElement("script");
          _script.id = _sociomantic_checkout_settings.id;
          _script.type = 'text/javascript';
          _script.async;
          _script.src = '//' + _sociomantic_checkout_settings.url + _sociomantic_checkout_settings.advertiser_token;
          _script.className = "sonar_" + where;

          document.body.appendChild(_script);

          if(_sociomantic_checkout_settings.confirmation) {
            _sociomantic_checkout.set.confirmation();
          }
        },
        cookie: function (data) {
          if (typeof data == "undefined") return false;

          if (typeof Object.prototype.toSource == "undefined")
            _data_string = "(" + JSON.stringify(data) + ")";
          else
            _data_string = data.toSource();

          set_cookie(_sociomantic_checkout.cookie_name, _data_string, {
            "expires": 1,
            "path": "/"
          });
        },
        product: function (_sku) {
          if (typeof _sku == "undefined" || _sku == null) {
            _sociomantic_checkout.log("Sku não encontrado.")
            return false;
          }

          _sociomantic_checkout.product_id = _sku;
          _sociomantic_checkout.set.sociomantic.cart();
        },
        confirmation: function () {
          // not from sociomantic? not confirmation page? return false
          if ((!/sociomantic/.test(document.cookie)) || (!jQuery("body").hasClass("finaliza-compra"))) return false;

          window.sale = {
            confirmed: true
          };

          if (typeof sociomantic === 'object' &&
            typeof sociomantic.sonar === 'object' &&
            typeof sociomantic.sonar.adv === 'object' &&
            typeof sociomantic.sonar.adv['marcynonline-br'] === 'object' &&
            typeof sociomantic.sonar.adv['marcynonline-br'].getConfirmed === 'function') {
            sociomantic.sonar.adv[_sociomantic_checkout_settings.advertiser_token].getConfirmed();
          }
        }
      },
      get: {
        cookie: function () {
          return (new Function("return " + get_cookie(_sociomantic_checkout.cookie_name)))();
        }
      },
      reset: {
        cookie: function () {
          set_cookie(_sociomantic_checkout.cookie_name, '', -1);
        }
      },
      check: {
        page: function () {
          if (jQuery("body").hasClass("carrinho")) {
            _sociomantic_checkout.set.set_cart_data_skus();
          } else {
            _sociomantic_checkout.set.data.checkout();
          }
        },
        options: function () {
          var _valid = true;

          if (typeof _sociomantic_checkout_settings.advertiser_token == "undefined" || _sociomantic_checkout_settings.advertiser_token == null) {
            _valid = false;
            _sociomantic_checkout.log("O advertiser_token do anunciante para o Sociomantic é obrigatório.");
          }

          return _valid;
        }
      },
      log: function (msg) {
        if (typeof console == "undefined") return false;

        console.log(msg);
      }
    }

    return _sociomantic_checkout.init();
  };
})(jQuery,window,document);