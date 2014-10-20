$(document).ready( function() {
	
	setCustomSelectors();
	setLinks();
	
	setModals();
	$(window).resize(setModals);
	
	$('input:text[placeholder]').simplePlaceholder();
	
	var $featureLinks = $(".feature-link");
	
	$featureLinks.find(".img").each(function(){
		var img = $(this).attr("data-src");
		$(this).css("background-image","url("+img+")");
	});
	
	$featureLinks.click(function(e){
		e.preventDefault();
		$(".active-feature-link").removeClass("active-feature-link");
		$(this).addClass("active-feature-link");
		
		var feature = $(this).attr("href");
		var featureHTML = $(".active-feature").html();
		$(".active-feature").fadeOut(function(){
			if ($('html').hasClass("ie")) {
				var $oldVid = $(this).find('iframe');
				var oldSrc = $oldVid.attr("src");
				$(this).fadeOut().removeClass("active-feature");
				$oldVid.attr("src","");
				$oldVid.attr("src",oldSrc);
				
				var $newVid = $(feature).find('iframe');
				var src = $newVid.attr("src");
				$newVid.attr("src","");
				$newVid.attr("src",src);
				$(feature).fadeIn().addClass("active-feature");
			} else {
				$(this).html("");
				$(this).removeClass("active-feature");
				$(feature).fadeIn().addClass("active-feature");
				$(this).html(featureHTML);
			}	
		});
	});
	
});

function setModals() {
	var winH = $(window).height(),
		winW = $(window).width(),
		docW = $(document).outerWidth();
	
	
	var $mask = $("#mask"),
		$modal = $(".modal"),
		$form = $("#form-modal"),
		$thanks = $("#thanks-modal");
		
	$modal.each(function(){
		var top = winH/2-$(this).outerHeight()/2;
		if (top < 0) {
			top = 0;
		}
		$(this).css("top", top);
		$(this).css("left", docW/2-$(this).outerWidth()/2);
	});
	
	var maskHeight = $(document).height();
	$mask.css({"height":maskHeight});
	if ( winW < docW && !$("html").hasClass("ie") ) {
		$mask.css({"width":docW});
	} else {
		$mask.css({"width":"100%"});	
	}
	
	$(".download-link").click(function(e){
		e.preventDefault();
		if ($('html').hasClass("oldie")){
			$mask.fadeTo("fast", 0.6);
		} else {
			$mask.fadeIn();
		}
		$form.fadeIn();
	});
	
	/* THIS IS ONLY TO MOCK UP FORM SUBMISSION */
	$("#submit").click(function(e){
		e.preventDefault();
		$form.fadeOut();
		$thanks.fadeIn();
	});
	
	$(".close, #mask").click(function(e){
		e.preventDefault();
		$mask.fadeOut();
		$modal.fadeOut();
	});
}

/* Auto Link Management */
function setCustomSelectors() {
    /* create custom jquery selectors to match external links, mailto links, and tel links */
    jQuery.extend(jQuery.expr[":"], {
        external: function (obj) {
            return obj.href && !obj.href.match(/^mailto\:/) && !obj.href.match(/^javascript\:/) && (obj.hostname && (obj.hostname != location.hostname));
        },
        mailto: function (obj) {
            return obj.href && obj.href.match(/^mailto\:/);
        }
    });
}

function setLinks() {
    /* Add CSS class to all external and mailto links */
    $("a:external").addClass("external");
    $("a:mailto").addClass("mailto");

    /* Add Google Analytics tracking to them */
    setLinkAnalytics();
}

function setLinkAnalytics() {
    /* Add click event for Google Analtyics */
	$("a:external").live("click", function () {
        trackIt('linkout/' + this.href.replace('http://', '').replace('https://', ''), true);
    });
    $("a:mailto").live("click", function () {
        trackIt('mailto/' + this.href.replace('mailto:', ''), true);
    });
}

function trackIt(qstring, ignoredir) {
    if (_gaq) {
        if (ignoredir) {
            if (qstring.length == 0) {
                _gaq.push(['_trackPageview']);
            }else{
                _gaq.push(['_trackPageview', '/' + qstring]);
            }
        }else{
            if (qstring.length == 0){
                /* get page URL, hash and QueryString for pass-through */
                qs = location.search;
                hash = location.hash;
                path = location.pathname;
                if (path.length < 2){
                    path = '';
                }else{
                    /* removes starting slash */
                    path = path.substring(1);
                }
				
                /* combine */
                fullpath = path + qs + hash;

                _gaq.push(['_trackPageview', '/' + fullpath]);
            }else{
                _gaq.push(['_trackPageview', '/' + qstring]);
            }
        }
    }
}

