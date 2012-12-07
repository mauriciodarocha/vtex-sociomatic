(function(){
   var _sociomantic_category_plugin = function(_sociomantic_category_options)
   {
		var _sociomantic_category_settings = jQuery.extend({
				id: 'sonar-adpan',
				url: 'us-sonar.sociomantic.com/js/2010-07-01/adpan/',
				advertiser_token:null
			}, _sociomantic_category_options);

		
		var _sociomantic_category = {
			categories:null,
			init: function()
			{
				if(!_sociomantic_category.check()) return false;

				_sociomantic_category.set.categories();
			},
			set:
			{
				categories: function()
				{
					var categories = new Array; 
					jQuery(".bread-crumb:first li").each(function(ndx,item){  
					    categories.push(jQuery(item).text()); 
					}); 

					categories.shift(); // first item out

					_sociomantic_category.categories = categories;

					_sociomantic_category.set.script();
				},
				script: function()
				{
					if(jQuery(".sonar_category").length>0) return false;

					window.product = {};
    				window.product.category = _sociomantic_category.categories;

			        var _script = document.createElement("script");
			        _script.id = _sociomantic_category_settings.id;
			        _script.type = 'text/javascript';
			        _script.async;
			        _script.src = '//'+_sociomantic_category_settings.url+_sociomantic_category_settings.advertiser_token;
			        _script.className = "sonar_category";
			        
			        document.body.appendChild(_script);
				}
			},
			check: function()
			{
				var _valid=true;

				if(typeof _sociomantic_category_settings.advertiser_token=="undefined"||_sociomantic_category_settings.advertiser_token==null)
				{
					_valid = false;
					_sociomantic_category.log("O advertiser_token do anunciante para o Sociomantic é obrigatório.");
				}

				return _valid;
			},
			log: function(msg)
			{
				if(typeof console=="undefined") return false;

				console.log(msg);
			}
		}

		_sociomantic_category.init();
	};

    jQuery.sociomantic_category = function(_sociomantic_category_options){
        return new _sociomantic_category_plugin(_sociomantic_category_options);
    };

})(jQuery);