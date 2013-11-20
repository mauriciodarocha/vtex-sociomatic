(function () {
  var _sociomantic_home_plugin = function (_sociomantic_home_options) {
    var _sociomantic_home_settings = jQuery.extend({
      id: 'sonar-adpan',
      url: 'us-sonar.sociomantic.com/js/2010-07-01/adpan/',
      advertiser_token: null
    }, _sociomantic_home_options);


    var _sociomantic_home = {
      init: function () {
        if (!_sociomantic_home.check()) return false;

        _sociomantic_home.set.script();
      },
      set: {
        script: function () {
          if (jQuery(".sonar_home").length > 0) return false;

          var _script = document.createElement("script");
          _script.id = _sociomantic_home_settings.id;
          _script.type = 'text/javascript';
          _script.async;
          _script.src = '//' + _sociomantic_home_settings.url + _sociomantic_home_settings.advertiser_token;
          _script.className = "sonar_home";

          document.body.appendChild(_script);
        }
      },
      check: function () {
        var _valid = true;

        if (typeof _sociomantic_home_settings.advertiser_token == "undefined" || _sociomantic_home_settings.advertiser_token == null) {
          _valid = false;
          _sociomantic_home.log("O advertiser_token do anunciante para o Sociomantic é obrigatório.");
        }

        return _valid;
      },
      log: function (msg) {
        if (typeof console == "undefined") return false;

        console.log(msg);
      }
    }

    _sociomantic_home.init();
  };

  jQuery.sociomantic_home = function (_sociomantic_home_options) {
    return new _sociomantic_home_plugin(_sociomantic_home_options);
  };

})();