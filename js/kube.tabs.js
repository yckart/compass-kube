/*
 	kube.tabs.js v3.0.0
 	Copyright 2013 Imperavi, Inc.
*/
(function($)
{
	var uuid = 0;

	"use strict";

	// Plugin
	$.fn.tabs = function(options)
	{
		var val = [];
		var args = Array.prototype.slice.call(arguments, 1);

		if (typeof options === 'string')
		{
			this.each(function()
			{
				var instance = $.data(this, 'tabs');
				if (typeof instance !== 'undefined' && $.isFunction(instance[options]))
				{
					var methodVal = instance[options].apply(instance, args);
					if (methodVal !== undefined && methodVal !== instance) val.push(methodVal);
				}
				else return $.error('No such method "' + options + '" for Tabs');
			});
		}
		else
		{
			this.each(function()
			{
				if (!$.data(this, 'tabs'))
				{
					$.data(this, 'tabs', Tabs(this, options));
				}
			});
		}

		if (val.length === 0) return this;
		else if (val.length === 1) return val[0];

		return val;
	};

	// Initialization
	function Tabs(el, options)
	{
		return new Tabs.prototype.init(el, options);
	}

	$.Tabs = Tabs;
	$.Tabs.VERSION = '1.0.1';
	$.Tabs.opts = {

		equals: false,
		active: false,
		initCallback: false,
		tabsCallback: false,
		tabCallback: false

	};

	// Functionality
	Tabs.fn = $.Tabs.prototype = {

		// Initialization
		init: function(el, options)
		{
			this.$element = $(el);
			this.uuid = uuid++;

			// Current settings
			this.opts = $.extend(
				{},
				$.Tabs.opts,
				this.$element.data(),
				options
			);

			this.links = this.$element.find('a');
			this.tabs = [];

			this.links.each($.proxy(function(i,s)
			{
				var hash = $(s).attr('href');
				this.tabs.push(hash);

				if (!$(s).hasClass('active')) $(hash).hide();

				// option active
				if (this.opts.active !== false && this.opts.active === hash)
				{
					this.show(s, hash);
				}

				$(s).click($.proxy(function(e)
				{
					location.hash = hash;
					e.preventDefault();
					this.show(s, hash);

				}, this));

			}, this));

			// option equals
			if (this.opts.equals)
			{
				this.setMaxHeight(this.getMaxHeight());
			}

			this.callback('init');
		},
		callback: function(type, event, data)
		{
			var callback = this.opts[type + 'Callback'];
			if ($.isFunction(callback))
			{
				if (event === false) return callback.call(this, data);
				else return callback.call(this, event, data);
			}
			else return data;
		},
		active: function(tab)
		{
			this.links.removeClass('active');
			$(tab).addClass('active');
		},
		show: function(tab, hash)
		{
			this.hideAll();
			$(hash).show();
			this.active(tab);

			this.callback('tabs', tab, hash);
		},
		hideAll: function()
		{
			$.each(this.tabs, function()
			{
				var tab = this.toString();
				$(tab).hide();
			});
		},
		setMaxHeight: function(height)
		{
			$.each(this.tabs, function()
			{
				var tab = this.toString();
				$(tab).css('min-height', height + 'px');
			});
		},
		getMaxHeight: function()
		{
			var max = 0;
			$(this.tabs).each(function()
			{
				var tab = this.toString();
				var h = $(tab).height();
				max = h > max ? h : max;
			});

			return max;
		}
	};

	// Constructor
	Tabs.prototype.init.prototype = Tabs.prototype;

	$(function()
	{
		$('nav[data-toggle="tabs"]').tabs();
	});

})(jQuery);

